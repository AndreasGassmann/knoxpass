import * as sodium from 'libsodium-wrappers';

/**
 * Convert a value to hex
 *
 * @param value
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toHex(value: any): string {
  return Buffer.from(value).toString('hex');
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

  const nonce = Buffer.from(
    sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES)
  );
  const combinedPayload = Buffer.concat([
    nonce,
    Buffer.from(
      sodium.crypto_secretbox_easy(
        Buffer.from(message, 'utf8'),
        nonce,
        sharedKey
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
 * Encrypt a message with a public key
 *
 * @param payload
 * @param publicKey
 */
export async function sealCryptobox(
  payload: string | Buffer,
  publicKey: Uint8Array
): Promise<string> {
  await sodium.ready;

  const encryptedMessage = sodium.crypto_box_seal(
    payload,
    Buffer.from(publicKey)
  );

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
    Buffer.from(publicKey),
    Buffer.from(privateKey)
  );

  return Buffer.from(decryptedMessage).toString();
}
