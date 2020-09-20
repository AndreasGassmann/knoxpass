import { ApiChallenge } from '@knoxpass/api-interfaces';
import * as sodium from 'libsodium-wrappers';

/**
 * Convert a value to hex
 *
 * @param value
 */
export function toHex(value: string | Buffer | Uint8Array): string {
  return Buffer.from(value).toString('hex');
}

/**
 * Convert a value from hex
 *
 * @param value
 */
export function fromHex(value: string): Buffer | Uint8Array {
  return Buffer.from(value, 'hex');
}

/**
 * Get the hash for a seed
 *
 * @param seed
 */
async function getHashForSeed(seed: string): Promise<Uint8Array> {
  await sodium.ready;

  return sodium.crypto_generichash(32, sodium.from_string(seed));
}

/**
 * Get a signing keypair from a seed
 *
 * @param seed
 */
export async function getSigningKeypairFromSeed(
  seed: string
): Promise<sodium.KeyPair> {
  await sodium.ready;

  const hash: Uint8Array = await getHashForSeed(seed);
  const derivedSeed: Uint8Array = sodium.crypto_kdf_derive_from_key(
    32,
    0,
    'knoxpass_ed25519_seed',
    hash
  );

  return sodium.crypto_sign_seed_keypair(derivedSeed);
}

/**
 * Get an encryption keypair from a seed
 *
 * @param seed
 */
export async function getBoxKeypairFromSeed(
  seed: string
): Promise<sodium.KeyPair> {
  await sodium.ready;

  const hash: Uint8Array = await getHashForSeed(seed);
  const derivedSeed: Uint8Array = sodium.crypto_kdf_derive_from_key(
    32,
    0,
    'knoxpass_curve25519_seed',
    hash
  );

  return sodium.crypto_box_seed_keypair(derivedSeed);
}

/**
 * Encrypt a message with a shared key
 *
 * @param message
 * @param sharedKey
 */
export async function encryptCryptoboxPayload(
  message: string,
  sharedKey: Uint8Array
): Promise<string> {
  await sodium.ready;

  const nonce = new Uint8Array(
    Buffer.from(sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES))
  );
  const combinedPayload = Buffer.concat([
    nonce,
    Buffer.from(
      sodium.crypto_secretbox_easy(
        new Uint8Array(Buffer.from(message, 'utf8')),
        nonce,
        new Uint8Array(sharedKey)
      )
    ),
  ]);

  return toHex(combinedPayload);
}

/**
 * Decrypt a message with a shared key
 *
 * @param payload
 * @param sharedKey
 */
export async function decryptCryptoboxPayload(
  payload: Uint8Array,
  sharedKey: Uint8Array
): Promise<string> {
  await sodium.ready;

  const nonce = payload.slice(0, sodium.crypto_secretbox_NONCEBYTES);
  const ciphertext = payload.slice(sodium.crypto_secretbox_NONCEBYTES);

  return Buffer.from(
    sodium.crypto_secretbox_open_easy(ciphertext, nonce, sharedKey)
  ).toString('utf8');
}

/**
 * Create a cryptobox shared key
 *
 * @param otherPublicKey
 * @param selfPrivateKey
 */
async function createCryptoBox(
  otherPublicKey: string,
  selfPrivateKey: Uint8Array
): Promise<[Uint8Array, Uint8Array, Uint8Array]> {
  return [
    selfPrivateKey,
    selfPrivateKey,
    new Uint8Array(Buffer.from(otherPublicKey, 'hex')),
  ];
}

/**
 * Create a cryptobox client
 *
 * @param otherPublicKey
 * @param selfPrivateKey
 */
export async function createCryptoBoxClient(
  otherPublicKey: string,
  selfPrivateKey: Uint8Array
): Promise<sodium.CryptoKX> {
  const keys = await createCryptoBox(otherPublicKey, selfPrivateKey);

  return sodium.crypto_kx_client_session_keys(...keys);
}

/**
 * Create a cryptobox server
 *
 * @param otherPublicKey
 * @param selfPrivateKey
 */
export async function createCryptoBoxServer(
  otherPublicKey: string,
  selfPrivateKey: Uint8Array
): Promise<sodium.CryptoKX> {
  const keys = await createCryptoBox(otherPublicKey, selfPrivateKey);

  return sodium.crypto_kx_server_session_keys(...keys);
}

/**
 * Encrypt a message with a public key
 *
 * @param payload
 * @param publicKey
 */
export async function sealCryptobox(
  payload: string,
  publicKey: string
): Promise<string> {
  await sodium.ready;

  const decodedPublicKey = new Uint8Array(Buffer.from(publicKey, 'hex'));
  const encryptedMessage = sodium.crypto_box_seal(payload, decodedPublicKey);

  return toHex(encryptedMessage);
}

/**
 * Decrypt a message with public + private key
 *
 * @param encryptedPayload
 * @param publicKey
 * @param privateKey
 */
export async function openCryptobox(
  encryptedPayload: string | Buffer,
  publicKey: Uint8Array,
  privateKey: Uint8Array
): Promise<string> {
  await sodium.ready;

  const decryptedMessage = sodium.crypto_box_seal_open(
    encryptedPayload,
    publicKey,
    privateKey
  );

  return Buffer.from(decryptedMessage).toString();
}

/**
 * Decrypt a message with public + private key
 *
 * @param encryptedPayload
 * @param publicKey
 * @param privateKey
 */
export async function sign(
  message: string,
  privateKey: Buffer
): Promise<string> {
  await sodium.ready;

  // password: `ed:${toHex(rawSignature)}:${await this.getPublicKey()}`,

  const hash: Uint8Array = sodium.crypto_generichash(
    32,
    sodium.from_string(message)
  );
  const rawSignature: Uint8Array = sodium.crypto_sign_detached(
    hash,
    privateKey
  );

  return toHex(rawSignature);
}

/**
 * Decrypt a message with public + private key
 *
 * @param encryptedPayload
 * @param publicKey
 * @param privateKey
 */
export async function verify(
  message: string,
  signature: string,
  publicKey: string
): Promise<boolean> {
  await sodium.ready;

  const rawSignature: Buffer | Uint8Array = new Uint8Array(fromHex(signature));

  const hash: Uint8Array = sodium.crypto_generichash(
    32,
    sodium.from_string(message)
  );

  const isValidSignature: boolean = sodium.crypto_sign_verify_detached(
    rawSignature,
    hash,
    new Uint8Array(Buffer.from(publicKey, 'hex'))
  );

  return isValidSignature;
}

export async function generateChallengeSignature(
  challenge: ApiChallenge,
  keypair: sodium.KeyPair
) {
  const MAX_TIMEOUT = 10 * 1000;
  let isRunning = true;

  const timeout = setTimeout(() => {
    isRunning = false;
  }, MAX_TIMEOUT);

  let nonce = 0;
  while (isRunning) {
    const signature = await sign(
      nonce + challenge.challenge,
      keypair.privateKey as any
    );

    const prefix = signature.slice(0, 1).repeat(challenge.difficulty);
    const postfix = signature.slice(-1).repeat(challenge.difficulty);

    if (signature.startsWith(prefix) || signature.endsWith(postfix)) {
      if (timeout) {
        clearTimeout(timeout);
      }
      return [
        'ed',
        nonce,
        challenge.challenge,
        signature,
        toHex(keypair.publicKey),
      ].join(':');
    }
    nonce++;
  }

  throw new Error('No valid nonce found within specified timeframe.');
}

export async function verifyChallengeSignature(
  pkh: string,
  challengeSignature: string
) {
  const [
    prefix,
    nonce,
    challenge,
    signature,
    publicKey,
  ] = challengeSignature.split(':');

  if (prefix !== 'ed') {
    throw new Error('Prefix invalid!');
  }

  if (nonce.indexOf('.') !== -1) {
    // TODO: Not sure if these checks are necessary
    throw new Error('Nonce is a float!');
  }

  const parsedNonce = parseInt(nonce, 10);
  if (isNaN(parsedNonce)) {
    // TODO: Not sure if these checks are necessary
    throw new Error('Nonce cannot be parsed!');
  }

  if (parsedNonce < 0) {
    // TODO: Not sure if these checks are necessary
    throw new Error('Nonce cannot be negative');
  }

  return verify(nonce + challenge, signature, publicKey);
}
