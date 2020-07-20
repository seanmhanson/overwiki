import { ErrorTypes } from 'models';

const { AuthError, DaoError, MalformedRequestError } = ErrorTypes;

const ERROR_TYPES = [AuthError, DaoError, MalformedRequestError];

describe('src/models/serverErrorTypes', () => {
  describe('when creating a Server Error of any type', () => {
    it('provides a default message ending in a period', () => {
      ERROR_TYPES.forEach((errorType) => {
        Object.keys(errorType).forEach((errorName) => {
          const { message }: { message: string } = errorType[errorName];
          expect(message.substr(-1)).toEqual('.');
        });
      });
    });

    it('provides a message formatter that returns a message ending in a period', () => {
      ERROR_TYPES.forEach((errorType) => {
        Object.keys(errorType).forEach((errorName) => {
          const { formatMessage }: { formatMessage: Function } = errorType[errorName];
          if (formatMessage) {
            const message = formatMessage({});
            expect(message.substr(-1)).toEqual('.');
          }
        });
      });
    });
  });
});
