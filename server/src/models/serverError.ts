import { ErrorNames, ErrorOptions, ErrorType } from 'src/models/serverErrorTypes';

export default class ServerError extends Error {
  public statusCode: number;

  constructor({ message, formatMessage, name }: ErrorType, options?: ErrorOptions) {
    super(formatMessage ? formatMessage(options) : message);
    this.name = name ?? ErrorNames.SERVER_ERROR;

    const { statusCode } = options;
    if (statusCode) {
      this.statusCode = statusCode as number;
    }
  }
}
