/**
 * Database Error Handling
 * Centralized error types and handling for database operations
 */

export enum DatabaseErrorCode {
  CONNECTION_FAILED = 'CONNECTION_FAILED',
  TRANSACTION_FAILED = 'TRANSACTION_FAILED',
  STORE_NOT_FOUND = 'STORE_NOT_FOUND',
  ITEM_NOT_FOUND = 'ITEM_NOT_FOUND',
  DUPLICATE_KEY = 'DUPLICATE_KEY',
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  VERSION_ERROR = 'VERSION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
}

export class DatabaseError extends Error {
  constructor(
    public readonly code: DatabaseErrorCode,
    message: string,
    public readonly originalError?: Error
  ) {
    super(message);
    this.name = 'DatabaseError';
  }
}

export class DatabaseErrorHandler {
  static handleError(operation: string, error: unknown): DatabaseError {
    if (error instanceof DatabaseError) {
      return error;
    }

    if (error instanceof DOMException) {
      switch (error.name) {
        case 'InvalidStateError':
          return new DatabaseError(
            DatabaseErrorCode.CONNECTION_FAILED,
            `Database connection failed during ${operation}`,
            error
          );
        case 'ConstraintError':
          return new DatabaseError(
            DatabaseErrorCode.DUPLICATE_KEY,
            `Duplicate key constraint violated in ${operation}`,
            error
          );
        case 'QuotaExceededError':
          return new DatabaseError(
            DatabaseErrorCode.QUOTA_EXCEEDED,
            `Storage quota exceeded during ${operation}`,
            error
          );
        case 'VersionError':
          return new DatabaseError(
            DatabaseErrorCode.VERSION_ERROR,
            `Database version mismatch in ${operation}`,
            error
          );
        case 'TransactionInactiveError':
          return new DatabaseError(
            DatabaseErrorCode.TRANSACTION_FAILED,
            `Transaction inactive during ${operation}`,
            error
          );
        default:
          return new DatabaseError(
            DatabaseErrorCode.UNKNOWN_ERROR,
            `Unknown database error in ${operation}: ${error.message}`,
            error
          );
      }
    }

    if (error instanceof Error) {
      return new DatabaseError(
        DatabaseErrorCode.UNKNOWN_ERROR,
        `Error in ${operation}: ${error.message}`,
        error
      );
    }

    return new DatabaseError(
      DatabaseErrorCode.UNKNOWN_ERROR,
      `Unknown error in ${operation}`,
      error as Error
    );
  }
}
