import axios from 'axios';

import { ServerError, ErrorTypes } from 'models';
import User from 'routes';

const { MalformedRequestError, AuthError } = ErrorTypes;
const { baseUrl: userBaseUrl } = User;

// this should be managed by a config
const baseURL = 'http://localhost:3000';

// fixtures
const username = 'din@hylia.com';
const password = 'din-farore-nayru-hylia-and-the-gang';
const insecurePassword = 'din';

describe('src/routes/userRoutes', () => {
  describe('when registering a new user', () => {
    async function registerUser(data: any) {
      await axios({
        method: 'post',
        url: `${userBaseUrl}/`,
        headers: { 'Content-Type': 'application/json' },
        baseURL,
        data,
      });
    }

    async function expectRegistrationError(data: any, expectedError: any) {
      expect.assertions(3);

      try {
        await registerUser(data);
      } catch (err) {
        expect(err).toBe(typeof expectedError);
        expect(err.name).toBe(expectedError.name);
        expect(err.message).toBe(expectedError.message);
      }
    }

    describe('when the request is malformed', () => {
      it('it returns a malformed request error,', async () => {
        const data = { username, password };
        const error = new ServerError(MalformedRequestError.CREATE_USER);
        await expectRegistrationError(data, error);
      });
    });

    describe('when the password values do not match', () => {
      it('it returns a password mismatch error', async () => {
        const data = { username, password, confirmPassword: `${password}?` };
        const error = new ServerError(AuthError.PASSWORDS_DONT_MATCH);
        await expectRegistrationError(data, error);
      });
    });

    describe('when the password is insecure', () => {
      it('returns a weak password error', async () => {
        const data = { username, password: insecurePassword, confirmPassword: insecurePassword };
        const error = new ServerError(AuthError.WEAK_PASSWORD);
        await expectRegistrationError(data, error);
      });
    });

    describe('when provided a valid new user', () => {
      const data = { username, password, confirmPassword: password };

      beforeEach(async () => {
        // const response = await registerUser(data);
      });

      // "successfully creates the user"

      describe('when creating a duplicate user', () => {
        it('returns a duplicate username error', async () => {
          const error = new ServerError(AuthError.DUPLICATE_USERNAME);
          await expectRegistrationError(data, error);
        });

        // "does not create a new user"
      });
    });
  });
});
