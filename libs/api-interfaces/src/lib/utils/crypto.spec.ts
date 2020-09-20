import { ApiChallenge } from '../services/api.service';
import {
  toHex,
  fromHex,
  getSigningKeypairFromSeed,
  getBoxKeypairFromSeed,
  sign,
  verify,
  sealCryptobox,
  openCryptobox,
  createCryptoBoxClient,
  createCryptoBoxServer,
  encryptCryptoboxPayload,
  decryptCryptoboxPayload,
  generateChallengeSignature,
  verifyChallengeSignature,
} from './crypto';

interface Case {
  input: any;
  output: any;
}

interface EdKeyPair {
  keyType: 'ed25519';
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

interface BoxKeyPair {
  keyType: 'x25519';
  privateKey: Uint8Array;
  publicKey: Uint8Array;
}

interface KeyPairInfo {
  seed: string;
  signKeypair: EdKeyPair;
  boxKeypair: BoxKeyPair;
}

const keypair1: KeyPairInfo = {
  seed: '625c5c69-f926-4bef-829d-2270d6f8f170',
  signKeypair: {
    keyType: 'ed25519',
    privateKey: new Uint8Array([
      80,
      142,
      151,
      119,
      210,
      181,
      118,
      125,
      180,
      75,
      154,
      76,
      71,
      41,
      251,
      107,
      45,
      132,
      189,
      225,
      173,
      141,
      162,
      189,
      160,
      116,
      125,
      179,
      189,
      82,
      126,
      155,
      206,
      159,
      37,
      144,
      183,
      196,
      153,
      78,
      229,
      35,
      178,
      251,
      226,
      46,
      11,
      195,
      19,
      108,
      217,
      173,
      180,
      80,
      35,
      104,
      50,
      69,
      228,
      162,
      236,
      226,
      214,
      195,
    ]),
    publicKey: new Uint8Array([
      206,
      159,
      37,
      144,
      183,
      196,
      153,
      78,
      229,
      35,
      178,
      251,
      226,
      46,
      11,
      195,
      19,
      108,
      217,
      173,
      180,
      80,
      35,
      104,
      50,
      69,
      228,
      162,
      236,
      226,
      214,
      195,
    ]),
  },
  boxKeypair: {
    keyType: 'x25519',
    privateKey: new Uint8Array([
      131,
      70,
      78,
      182,
      37,
      255,
      103,
      46,
      107,
      253,
      119,
      39,
      160,
      62,
      37,
      49,
      231,
      37,
      42,
      3,
      222,
      99,
      192,
      250,
      222,
      36,
      51,
      101,
      245,
      235,
      58,
      117,
    ]),
    publicKey: new Uint8Array([
      100,
      216,
      178,
      148,
      139,
      109,
      75,
      192,
      227,
      233,
      137,
      123,
      40,
      28,
      94,
      155,
      132,
      14,
      131,
      211,
      127,
      8,
      208,
      104,
      126,
      27,
      68,
      16,
      174,
      122,
      76,
      31,
    ]),
  },
};

const keypair2: KeyPairInfo = {
  seed: 'b369d36e-d66f-4d33-891d-e6e90a58ec0c',
  signKeypair: {
    keyType: 'ed25519',
    privateKey: new Uint8Array([
      105,
      177,
      190,
      21,
      26,
      149,
      210,
      195,
      230,
      21,
      227,
      105,
      122,
      199,
      207,
      199,
      72,
      143,
      230,
      185,
      97,
      165,
      169,
      104,
      107,
      220,
      222,
      217,
      63,
      127,
      69,
      97,
      65,
      121,
      60,
      117,
      192,
      237,
      111,
      6,
      228,
      68,
      228,
      210,
      62,
      192,
      79,
      162,
      60,
      167,
      186,
      113,
      238,
      235,
      95,
      13,
      142,
      50,
      49,
      126,
      128,
      218,
      26,
      238,
    ]),
    publicKey: new Uint8Array([
      65,
      121,
      60,
      117,
      192,
      237,
      111,
      6,
      228,
      68,
      228,
      210,
      62,
      192,
      79,
      162,
      60,
      167,
      186,
      113,
      238,
      235,
      95,
      13,
      142,
      50,
      49,
      126,
      128,
      218,
      26,
      238,
    ]),
  },
  boxKeypair: {
    keyType: 'x25519',
    privateKey: new Uint8Array([
      86,
      191,
      99,
      207,
      159,
      136,
      130,
      158,
      21,
      214,
      98,
      104,
      142,
      218,
      8,
      7,
      94,
      59,
      218,
      200,
      181,
      110,
      149,
      168,
      77,
      77,
      117,
      202,
      248,
      63,
      35,
      121,
    ]),
    publicKey: new Uint8Array([
      56,
      81,
      6,
      241,
      97,
      243,
      178,
      106,
      101,
      40,
      210,
      191,
      107,
      127,
      226,
      213,
      160,
      50,
      212,
      69,
      33,
      187,
      21,
      144,
      88,
      104,
      161,
      95,
      68,
      198,
      118,
      118,
    ]),
  },
};

const keypair3: KeyPairInfo = {
  seed: '2a39a0da-62e5-45aa-a1eb-cde30b80a813',
  signKeypair: {
    keyType: 'ed25519',
    privateKey: new Uint8Array([
      163,
      247,
      108,
      199,
      177,
      102,
      145,
      111,
      202,
      17,
      241,
      249,
      219,
      228,
      18,
      149,
      219,
      213,
      13,
      96,
      162,
      119,
      204,
      101,
      55,
      234,
      185,
      161,
      161,
      217,
      155,
      163,
      36,
      50,
      77,
      108,
      90,
      241,
      166,
      109,
      11,
      216,
      93,
      218,
      169,
      136,
      246,
      115,
      6,
      232,
      11,
      92,
      162,
      134,
      55,
      124,
      194,
      93,
      137,
      2,
      163,
      238,
      176,
      220,
    ]),
    publicKey: new Uint8Array([
      36,
      50,
      77,
      108,
      90,
      241,
      166,
      109,
      11,
      216,
      93,
      218,
      169,
      136,
      246,
      115,
      6,
      232,
      11,
      92,
      162,
      134,
      55,
      124,
      194,
      93,
      137,
      2,
      163,
      238,
      176,
      220,
    ]),
  },
  boxKeypair: {
    keyType: 'x25519',
    privateKey: new Uint8Array([
      8,
      121,
      149,
      173,
      252,
      144,
      201,
      39,
      216,
      222,
      116,
      242,
      82,
      131,
      18,
      223,
      102,
      80,
      188,
      166,
      93,
      50,
      165,
      60,
      5,
      4,
      172,
      67,
      21,
      72,
      180,
      121,
    ]),
    publicKey: new Uint8Array([
      18,
      42,
      44,
      215,
      208,
      1,
      82,
      232,
      37,
      179,
      225,
      201,
      207,
      138,
      91,
      135,
      85,
      21,
      169,
      176,
      106,
      93,
      182,
      55,
      74,
      119,
      6,
      188,
      178,
      2,
      176,
      102,
    ]),
  },
};

describe('crypto', () => {
  describe('toHex', () => {
    const cases: Case[] = [
      { input: '', output: '' },
      { input: 'test', output: '74657374' },
      { input: 'a longer input', output: '61206c6f6e67657220696e707574' },
      {
        input:
          'a very very very very very very very very very very very very very very very very very very long input',
        output:
          '61207665727920766572792076657279207665727920766572792076657279207665727920766572792076657279207665727920766572792076657279207665727920766572792076657279207665727920766572792076657279206c6f6e6720696e707574',
      },
    ];

    cases.map((c) => {
      return it(`should hexlify ${c.input}`, async () => {
        const hex = toHex(c.input);
        expect(hex).toEqual(c.output);
      });
    });
  });

  describe('getSigningKeypairFromSeed', () => {
    const cases: Case[] = [
      {
        input: keypair1.seed,
        output: keypair1.signKeypair,
      },
      {
        input: keypair2.seed,
        output: keypair2.signKeypair,
      },
      {
        input: keypair3.seed,
        output: keypair3.signKeypair,
      },
    ];

    cases.map((c) => {
      return it(`should getSigningKeypairFromSeed ${c.input}`, async () => {
        const hex = await getSigningKeypairFromSeed(c.input);
        expect(hex).toEqual(c.output);
      });
    });
  });

  describe('getBoxKeypairFromSeed', () => {
    const cases: Case[] = [
      {
        input: keypair1.seed,
        output: keypair1.boxKeypair,
      },
      {
        input: keypair2.seed,
        output: keypair2.boxKeypair,
      },
      {
        input: keypair3.seed,
        output: keypair3.boxKeypair,
      },
    ];

    cases.map((c) => {
      return it(`should getBoxKeypairFromSeed ${c.input}`, async () => {
        const hex = await getBoxKeypairFromSeed(c.input);
        expect(hex).toEqual(c.output);
      });
    });
  });

  describe('sign', () => {
    const validCases = [
      {
        message: 'test',
        keypair: keypair1.signKeypair, // sign keypair is only used for signing
        signature:
          '4a26e2d2150730ed51e889a00cf32f0ad7c0ce6340ffcf77453af86f9b8a52032e2003d3e3a47ce913109e54df356e6a6382d8fa49b07cd0786ab4e7fea40907',
      },
    ];

    const invalidCases = [
      {
        message: 'test',
        keypair: keypair1.boxKeypair, // box keypair is only used for encryption
        error: 'TypeError: invalid privateKey length',
      },
    ];

    validCases.map((c) => {
      return it(`should sign and verify ${c.message}`, async () => {
        const hex = await sign(c.message, c.keypair.privateKey as any);
        expect(hex).toEqual(c.signature);
        const isValid = await verify(
          c.message,
          c.signature,
          toHex(c.keypair.publicKey)
        );
        expect(isValid).toBe(true);
      });
    });

    invalidCases.map((c) => {
      return it(`should fail to sign ${c.message}`, async () => {
        try {
          await sign(c.message, c.keypair.privateKey as any);
        } catch (error) {
          expect(error.toString()).toBe(c.error);
        }
      });
    });
  });

  describe('encrypt with public key using sealCryptobox', () => {
    const validCases = [
      {
        message: 'test',
        keypair: keypair1.boxKeypair,
      },
    ];

    const invalidCases = [
      {
        message: 'test',
        keypair: keypair1.signKeypair,
        error: 'TypeError: invalid privateKey length',
      },
    ];

    validCases.map((c) => {
      return it(`should encrypt and decrypt with sealCryptobox ${c.message}`, async () => {
        const enrypted = await sealCryptobox(
          c.message,
          toHex(c.keypair.publicKey)
        );
        // We can't check the encrypted payload, because it's always different
        const decrypted = await openCryptobox(
          new Uint8Array(fromHex(enrypted)) as any,
          c.keypair.publicKey,
          c.keypair.privateKey
        );
        expect(decrypted).toEqual(c.message);
      });
    });

    invalidCases.map((c) => {
      return it(`should fail to encrypt and decrypt with sealCryptobox ${c.message}`, async () => {
        try {
          const enrypted = await sealCryptobox(
            c.message,
            toHex(c.keypair.publicKey)
          );
          // We can't check the encrypted payload, because it's always different
          const decrypted = await openCryptobox(
            new Uint8Array(fromHex(enrypted)) as any,
            c.keypair.publicKey,
            c.keypair.privateKey
          );
          expect(decrypted).toEqual(c.message);
          expect(true).toBe(false); // We should never get here
        } catch (error) {
          expect(error.toString()).toBe(c.error);
        }
      });
    });
  });

  // describe('encrypt with public key using sealCryptobox', () => {
  //   const validCases = [
  //     {
  //       message: 'test',
  //       keypair1: keypair1.boxKeypair,
  //       keypair2: keypair2.boxKeypair,
  //     },
  //   ];

  //   const invalidCases = [
  //     {
  //       message: 'test',
  //       keypair1: keypair1.signKeypair,
  //       keypair2: keypair2.signKeypair,
  //       error: 'TypeError: invalid privateKey length',
  //     },
  //   ];

  //   validCases.map((c) => {
  //     return it(`should encrypt and decrypt with encryptCryptoboxPayload ${c.message}`, async () => {
  //       const clientKey = await createCryptoBoxClient(
  //         toHex(c.keypair1.publicKey),
  //         c.keypair2.privateKey
  //       );
  //       const serverKey = await createCryptoBoxServer(
  //         toHex(c.keypair1.publicKey),
  //         c.keypair2.privateKey
  //       );

  //       const enrypted = await encryptCryptoboxPayload(
  //         c.message,
  //         clientKey as any
  //       );
  //       // We can't check the encrypted payload, because it's always different
  //       const decrypted = await decryptCryptoboxPayload(
  //         new Uint8Array(fromHex(enrypted)) as any,
  //         serverKey as any
  //       );
  //       expect(decrypted).toEqual(c.message);
  //     });
  //   });

  // invalidCases.map((c) => {
  //   return it(`should fail to encrypt and decrypt with encryptCryptoboxPayload ${c.message}`, async () => {
  //     try {
  //       const enrypted = await encryptCryptoboxPayload(
  //         c.message,
  //         toHex(c.keypair.publicKey)
  //       );
  //       // We can't check the encrypted payload, because it's always different
  //       const decrypted = await decryptCryptoboxPayload(
  //         new Uint8Array(fromHex(enrypted)) as any,
  //         c.keypair.publicKey,
  //         c.keypair.privateKey
  //       );
  //       expect(decrypted).toEqual(c.message);
  //       expect(true).toBe(false); // We should never get here
  //     } catch (error) {
  //       expect(error.toString()).toBe(c.error);
  //     }
  //   });
  // });
  // });

  describe('generate a signature for a challenge', () => {
    const getChallenge = (difficulty: number) => ({
      difficulty: difficulty,
      challenge: 'a-random-string',
      expiration: new Date().getTime(),
    });
    const validCases: {
      challenge: ApiChallenge;
      keypair: EdKeyPair;
      signature: string;
    }[] = [
      {
        challenge: getChallenge(0),
        keypair: keypair1.signKeypair,
        signature:
          'ed:0:a-random-string:f025a84ecb46a9d8b72688ebde1cb1ef74dc361d8e7cbca6b3f31e573ea4b4895362c78e8e7ee67f7a293eb5d2bfbfc60b814510159e40160dfbb2264c73e003:ce9f2590b7c4994ee523b2fbe22e0bc3136cd9adb45023683245e4a2ece2d6c3',
      },
      {
        challenge: getChallenge(1),
        keypair: keypair1.signKeypair,
        signature:
          'ed:0:a-random-string:f025a84ecb46a9d8b72688ebde1cb1ef74dc361d8e7cbca6b3f31e573ea4b4895362c78e8e7ee67f7a293eb5d2bfbfc60b814510159e40160dfbb2264c73e003:ce9f2590b7c4994ee523b2fbe22e0bc3136cd9adb45023683245e4a2ece2d6c3',
      },
      {
        challenge: getChallenge(2),
        keypair: keypair1.signKeypair,
        signature:
          'ed:8:a-random-string:c74759dc70dfb1e998da7a5330946c2f3d55ed6a5560937729656d2feffb7dd1c65a76238f28c21eac39bbd61e77bc886aee8649ea37603e27fdc92da5c9b900:ce9f2590b7c4994ee523b2fbe22e0bc3136cd9adb45023683245e4a2ece2d6c3',
      },
      {
        challenge: getChallenge(3),
        keypair: keypair1.signKeypair,
        signature:
          'ed:59:a-random-string:666ec43e0489de2ae2842c582978dd23b6de1c2f2800ed0da3bd196c7f428c53ce3a01a7cdb67d9b6957fb2ed26b81adbec521f29d5c36cfbb9a83c0a848df06:ce9f2590b7c4994ee523b2fbe22e0bc3136cd9adb45023683245e4a2ece2d6c3',
      },
      {
        challenge: getChallenge(4),
        keypair: keypair1.signKeypair,
        signature:
          'ed:3446:a-random-string:223cd3031b81f00e66d557ba5085745c5a568fd0cb6d5b97bab59e6efb1f346f5a554dd20308238e74aa829084ce46533bf0a59612cd038fd36ce07c1cdd0000:ce9f2590b7c4994ee523b2fbe22e0bc3136cd9adb45023683245e4a2ece2d6c3',
      },
      {
        challenge: getChallenge(5),
        keypair: keypair1.signKeypair,
        signature:
          'ed:6051:a-random-string:fffff06f11e89aec36a6a4bd249197203975f1bac3afc81e4026def37544db407a3bf1218dce554399ed32030562290469abf4f9c6fccfeefbffc99dbb8b5704:ce9f2590b7c4994ee523b2fbe22e0bc3136cd9adb45023683245e4a2ece2d6c3',
      },
      {
        challenge: getChallenge(0),
        keypair: keypair2.signKeypair,
        signature:
          'ed:0:a-random-string:bc4a500248aa2332be0baa36b226714c4ebb3cd0fadf3656035bffac5b569738d09988dc4b7c59ed47638ac2789dffe65f184fa7f5ef5b9389e28d588edaf10b:41793c75c0ed6f06e444e4d23ec04fa23ca7ba71eeeb5f0d8e32317e80da1aee',
      },
      {
        challenge: getChallenge(1),
        keypair: keypair2.signKeypair,
        signature:
          'ed:0:a-random-string:bc4a500248aa2332be0baa36b226714c4ebb3cd0fadf3656035bffac5b569738d09988dc4b7c59ed47638ac2789dffe65f184fa7f5ef5b9389e28d588edaf10b:41793c75c0ed6f06e444e4d23ec04fa23ca7ba71eeeb5f0d8e32317e80da1aee',
      },
      {
        challenge: getChallenge(2),
        keypair: keypair2.signKeypair,
        signature:
          'ed:2:a-random-string:2d292f6e64b7995c2eb2c63c3153b51ada83402f621ba13fff7b93fd1a2fd9c3de10bacce999ed6a2153135a607ade47d46c4276bc3f3021a32a046dae29c500:41793c75c0ed6f06e444e4d23ec04fa23ca7ba71eeeb5f0d8e32317e80da1aee',
      },
      {
        challenge: getChallenge(3),
        keypair: keypair2.signKeypair,
        signature:
          'ed:57:a-random-string:145ca03359e5d1b0b69c0c6ac37f9a70455563cf63dcb7c84c4c1074d07b447c69cda667a13065f8406b693d2c6f6e928500cd69d35db9ce0f7fadef9f247000:41793c75c0ed6f06e444e4d23ec04fa23ca7ba71eeeb5f0d8e32317e80da1aee',
      },
      {
        challenge: getChallenge(4),
        keypair: keypair2.signKeypair,
        signature:
          'ed:898:a-random-string:ba817367449571daea98da129cc30e40732abe135ad718777ec38f4dffa518a8d976ce07f4997df8ada62227049e6bc302b093c2ea512fe8c1451824e7eb0000:41793c75c0ed6f06e444e4d23ec04fa23ca7ba71eeeb5f0d8e32317e80da1aee',
      },
      {
        challenge: getChallenge(5),
        keypair: keypair2.signKeypair,
        signature:
          'ed:8142:a-random-string:50b952fa74c08f6e7217c96018e0f6cea4116e82a780736bd5d358c8ca1139b5b995b88ddf3bc1b2f63c81de02b2c7405089628b59a9dea827cca20e5c200000:41793c75c0ed6f06e444e4d23ec04fa23ca7ba71eeeb5f0d8e32317e80da1aee',
      },
    ];

    // const invalidCases = [
    //   {
    //     message: 'test',
    //     keypair: keypair1.signKeypair,
    //     error: 'TypeError: invalid privateKey length',
    //   },
    // ];

    validCases.map((c) => {
      return it(`should generate a signature for a challenge and difficulty ${c.challenge.challenge} (${c.challenge.difficulty})`, async () => {
        const t0 = performance.now();
        const challengeSignature = await generateChallengeSignature(
          c.challenge,
          c.keypair
        );
        const t1 = performance.now();
        console.log(
          `Call to generateChallengeSignature with difficulty ${
            c.challenge.difficulty
          } took ${t1 - t0} milliseconds.`
        );
        verifyChallengeSignature('', challengeSignature);
        expect(challengeSignature).toEqual(c.signature);
      });
    });

    // invalidCases.map((c) => {
    //   return it(`should fail to encrypt and decrypt with sealCryptobox ${c.message}`, async () => {
    //     try {
    //       const enrypted = await sealCryptobox(
    //         c.message,
    //         toHex(c.keypair.publicKey)
    //       );
    //       // We can't check the encrypted payload, because it's always different
    //       const decrypted = await openCryptobox(
    //         new Uint8Array(fromHex(enrypted)) as any,
    //         c.keypair.publicKey,
    //         c.keypair.privateKey
    //       );
    //       expect(decrypted).toEqual(c.message);
    //       expect(true).toBe(false); // We should never get here
    //     } catch (error) {
    //       expect(error.toString()).toBe(c.error);
    //     }
    //   });
    // });
  });
});
