import {
  toHex,
  fromHex,
  getSigningKeypairFromSeed,
  getBoxKeypairFromSeed,
  sign,
  verify,
  sealCryptobox,
  openCryptobox,
  encryptCryptoboxPayload,
  decryptCryptoboxPayload,
} from './crypto';

interface Case {
  input: any;
  output: any;
}

interface KeyPairInfo {
  seed: string;
  signKeypair: {
    keyType: 'ed25519';
    privateKey: Uint8Array;
    publicKey: Uint8Array;
  };
  boxKeypair: {
    keyType: 'x25519';
    privateKey: Uint8Array;
    publicKey: Uint8Array;
  };
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
  //     });
  //   });

  //   invalidCases.map((c) => {
  //     return it(`should fail to encrypt and decrypt with encryptCryptoboxPayload ${c.message}`, async () => {
  //       try {
  //         const enrypted = await encryptCryptoboxPayload(
  //           c.message,
  //           toHex(c.keypair.publicKey)
  //         );
  //         // We can't check the encrypted payload, because it's always different
  //         const decrypted = await decryptCryptoboxPayload(
  //           new Uint8Array(fromHex(enrypted)) as any,
  //           c.keypair.publicKey,
  //           c.keypair.privateKey
  //         );
  //         expect(decrypted).toEqual(c.message);
  //         expect(true).toBe(false); // We should never get here
  //       } catch (error) {
  //         expect(error.toString()).toBe(c.error);
  //       }
  //     });
  //   });
  // });
});
