import crypto from 'crypto';
import zxcvbn from 'zxcvbn';

export default class HashedPassword {
  private static iterations = 100000;
  private static keylen = 128;
  private static digest = 'sha512';

  private salt: string;
  private hashedPassword: string;

  private static getHashedPassword(password: string, salt: string): Promise<string> {
    return new Promise((res, rej) => {
      crypto.pbkdf2(
        password,
        salt,
        HashedPassword.iterations,
        HashedPassword.keylen,
        HashedPassword.digest,
        (err, key) => (err ? rej(err) : res(key.toString('base64')))
      );
    });
  }

  private static checkPasswordStrength(password: string) {
    const { score } = zxcvbn(password);

    if (score < 3) {
      // TODO: improve error handling with zxcvbn's result.feedback
      throw new Error('The password provided is insecure');
    }
  }

  constructor() {
    this.salt = crypto.randomBytes(256).toString('base64');
  }

  public async setPassword(password: string) {
    HashedPassword.checkPasswordStrength(password);
    this.hashedPassword = await HashedPassword.getHashedPassword(password, this.salt);
  }

  public async checkPassword(passwordAttempt: string): Promise<boolean> {
    return (
      this.hashedPassword === (await HashedPassword.getHashedPassword(passwordAttempt, this.salt))
    );
  }
}
