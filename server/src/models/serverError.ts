import { ErrorNames, ErrorOptions, ErrorType } from 'src/models/serverErrorTypes';

export default class ServerError extends Error {
  public statusCode: number;

  constructor({ message, formatMessage, name }: ErrorType, options?: ErrorOptions) {
    const useFormattedMessage = formatMessage && options;
    const setStatusCode = options && options.statusCode;

    super(useFormattedMessage ? formatMessage(options) : message);
    this.name = name ?? ErrorNames.SERVER_ERROR;

    if (setStatusCode) {
      const { statusCode } = options;
      this.statusCode = statusCode;
    }
  }
}
