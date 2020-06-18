// error-related type declarations
interface ReservedOptions {
  statusCode?: number;
}

export type ErrorOptions = {
  [key: string]: any;
} & ReservedOptions;

export interface ErrorType {
  message: string;
  formatMessage?: (options: ErrorOptions) => string;
  name: ErrorNames;
}

// error name values
export enum ErrorNames {
  AUTH_ERROR = 'AuthError',
  DAO_ERROR = 'DaoError',
  MALFORMED_REQUEST_ERROR = 'MalformedRequestError',
  SERVER_ERROR = 'ServerError',
}

// error metadata
export const AuthError = {
  WEAK_PASSWORD: {
    message: 'The provided password is too weak.',
    name: ErrorNames.AUTH_ERROR,
  },
  PASSWORDS_DONT_MATCH: {
    message: 'The provided passwords do not match.',
    name: ErrorNames.AUTH_ERROR,
  },
  DUPLICATE_USERNAME: {
    message: 'The provided username is already associated with an account.',
    name: ErrorNames.AUTH_ERROR,
  },
  INVALID_USERNAME: {
    message: 'The provided username is not a valid email address.',
    name: ErrorNames.AUTH_ERROR,
  },
  INVALID_CREDENTIALS: {
    message: 'The provided credentials are invalid.',
    name: ErrorNames.AUTH_ERROR,
  },
} as const;

export const DaoError = {
  CONNECTION_FAILED: {
    message: 'Error connecting to database.',
    formatMessage: ({ dbUri }: ErrorOptions) => `Error connecting to database at: ${dbUri}`,
    name: ErrorNames.DAO_ERROR,
  },
  COUNT_ERROR: {
    message: 'Error getting document count for collection.',
    formatMessage: ({ dbAndCollectionName }: ErrorOptions) =>
      `Error getting document count for ${dbAndCollectionName}.`,
    name: ErrorNames.DAO_ERROR,
  },
  FIND_ERROR: {
    message: 'Error finding document(s).',
    formatMessage: ({ dbAndCollectionName }: ErrorOptions) =>
      `Error finding document(s) in ${dbAndCollectionName}.`,
    name: ErrorNames.DAO_ERROR,
  },
  INSERT_ERROR: {
    message: 'Error inserting document(s).',
    formatMessage: ({ dbAndCollectionName }: ErrorOptions) =>
      `Error inserting document(s) in ${dbAndCollectionName}.`,
    name: ErrorNames.DAO_ERROR,
  },
  UPDATE_ERROR: {
    message: 'Error updating document(s).',
    formatMessage: ({ dbAndCollectionName }: ErrorOptions) =>
      `Error updating document(s) in ${dbAndCollectionName}.`,
    name: ErrorNames.DAO_ERROR,
  },
  DELETE_ERROR: {
    message: 'Error deleting document(s).',
    formatMessage: ({ dbAndCollectionName }: ErrorOptions) =>
      `Error deleting document(s) in ${dbAndCollectionName}.`,
    name: ErrorNames.DAO_ERROR,
  },
};

function getFieldsMessage(fields: Array<string>) {
  return fields.reduce((acc, fieldName, index, allFields) => {
    const lastFieldName = index === allFields.length - 1;
    return `${acc} ${fieldName}${lastFieldName ? '.' : ','}`;
  }, 'Expected body fields:');
}

export const MalformedRequestError = {
  CREATE_USER: {
    message: 'The create user request is malformed.',
    formatMessage: ({ fields }) =>
      `The create user request is malformed. ${getFieldsMessage(fields)}`,
    name: ErrorNames.MALFORMED_REQUEST_ERROR,
  },
};
