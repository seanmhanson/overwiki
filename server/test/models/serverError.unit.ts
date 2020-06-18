import ServerError from 'src/models/serverError';
import { ErrorNames } from 'src/models/serverErrorTypes';

const message = 'farore';
const formatMessage = ({ substring }) => `nayru${`: ${substring}`}`;
const name = ErrorNames.AUTH_ERROR;
const statusCode = 403;

describe('src/models/serverError', () => {
  let serverError: ServerError;

  describe('when initialized without a formatted message', () => {
    beforeEach(() => {
      serverError = new ServerError({ message, name });
    });

    it("sets the server error's message, name, and doesn't set a status code", () => {
      expect(serverError.message).toEqual(message);
      expect(serverError.name).toEqual(name);
      expect(serverError.statusCode).toBeUndefined();
    });
  });

  describe('when initialized with a formatted message without correct options', () => {
    beforeEach(() => {
      serverError = new ServerError({ message, formatMessage, name });
    });

    it("sets the server error's default message, name, and doesn't set a status code", () => {
      expect(serverError.message).toEqual(message);
      expect(serverError.name).toEqual(name);
      expect(serverError.statusCode).toBeUndefined();
    });
  });

  describe('when initialized with a formatted message and correct option', () => {
    beforeEach(() => {
      serverError = new ServerError({ message, formatMessage, name }, { substring: 'wisdom' });
    });

    it("sets the server error's formatted message, name, and doesn't set a status code", () => {
      const formattedMessage = formatMessage({ substring: 'wisdom' });
      expect(serverError.message).toEqual(formattedMessage);
      expect(serverError.name).toEqual(name);
      expect(serverError.statusCode).toBeUndefined();
    });
  });

  describe('when initialized without an error name', () => {
    beforeEach(() => {
      serverError = new ServerError({ message });
    });

    it("sets the server error's message, default name, and doesn't set a status code", () => {
      expect(serverError.message).toEqual(message);
      expect(serverError.name).toEqual(ErrorNames.SERVER_ERROR);
      expect(serverError.statusCode).toBeUndefined();
    });
  });

  describe('when initialized with a status code', () => {
    beforeEach(() => {
      serverError = new ServerError({ message, name }, { statusCode });
    });

    it("sets the server error's message, name, and sets a status code", () => {
      expect(serverError.message).toEqual(message);
      expect(serverError.name).toEqual(name);
      expect(serverError.statusCode).toEqual(statusCode);
    });
  });
});
