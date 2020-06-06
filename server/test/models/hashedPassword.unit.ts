import crypto from 'crypto';

// subject
import HashedPassword from 'src/models/hashedPassword';

// globals
const securePassword = 'aSufficientlyLongPasswordShouldProveToBeSecure';
const insecurePassword = 'insecurePassword';

// mocks
const randomBytesSpy = jest.spyOn(crypto, 'randomBytes');
const pbkdf2Spy = jest.spyOn(crypto, 'pbkdf2');

describe('src/models/hashedPassword', () => {
  let firstHashedPassword: HashedPassword;
  let secondHashedPassword: HashedPassword;
  let firstSalt: string;
  let secondSalt: string;

  describe('when instantiated for a first password', () => {
    beforeEach(() => {
      firstHashedPassword = new HashedPassword();
    });

    it('generates a salt for the password', () => {
      const { type, value } = randomBytesSpy.mock.results[0];
      expect(randomBytesSpy).toHaveBeenCalledTimes(1);
      expect(type).toEqual('return');

      firstSalt = value.toString('base64');
      expect(firstSalt).toHaveLength(344);
    });

    describe('when hashing the first password', () => {
      it('validates the password strength and hashes the value', () => {
        expect(() => firstHashedPassword.setPassword(securePassword)).not.toThrow();

        expect(pbkdf2Spy).toHaveBeenCalledTimes(1);
      });

      describe('when checking the password against a password attempt', () => {
        beforeEach(async () => {
          await firstHashedPassword.setPassword(securePassword);
        });

        it('indicates when a password matches', async () => {
          expect(await firstHashedPassword.checkPassword(securePassword)).toEqual(true);
        });

        it('indicates when a password does not match', async () => {
          expect(await firstHashedPassword.checkPassword(insecurePassword)).toEqual(false);
        });
      });

      describe('when instantiated for a second password', () => {
        beforeEach(() => {
          randomBytesSpy.mockClear();
          pbkdf2Spy.mockClear();
          secondHashedPassword = new HashedPassword();
        });

        it('generates a salt for the password', () => {
          const { type, value } = randomBytesSpy.mock.results[0];
          expect(randomBytesSpy).toHaveBeenCalledTimes(1);
          expect(type).toEqual('return');

          secondSalt = value.toString('base64');
          expect(secondSalt).toHaveLength(344);
          expect(secondSalt).not.toEqual(firstSalt);
        });

        describe('when hashing a second, secure password', () => {
          it('validates the password strength and hashes the value', () => {
            expect(() => secondHashedPassword.setPassword(securePassword)).not.toThrow();

            expect(pbkdf2Spy).toHaveBeenCalledTimes(1);
          });
        });

        describe('when hashing a second, insecure password', () => {
          it("throws an insecure password error and doesn't hash the value", async () => {
            await expect(() =>
              secondHashedPassword.setPassword(insecurePassword)
            ).rejects.toThrow();
            expect(pbkdf2Spy).not.toHaveBeenCalled();
          });
        });
      });
    });
  });
});
