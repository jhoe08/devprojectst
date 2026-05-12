/**
 * Centralized Error Handling Middleware and Utilities
 */

const pino = require('pino');
const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: {
    target: 'pino-pretty',
    options: {
      colorize: true,
      translateTime: 'SYS:standard',
      ignore: 'pid,hostname'
    }
  }
});

/**
 * Custom Application Error class
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.timestamp = new Date().toISOString();
  }
}

/**
 * Async error wrapper for Express route handlers
 * Catches errors and passes them to error middleware
 */
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * Global error handling middleware
 * Should be placed AFTER all other middleware and routes
 */
const errorHandler = (err, req, res, next) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  // Log error
  const errorLog = {
    message: err.message,
    code: err.code || 'UNKNOWN_ERROR',
    statusCode: err.statusCode || 500,
    timestamp: err.timestamp || new Date().toISOString(),
    path: req.path,
    method: req.method,
    url: req.originalUrl
  };

  if (isDevelopment) {
    errorLog.stack = err.stack;
  }

  logger.error(errorLog, 'Request error');

  // Send error response
  const statusCode = err.statusCode || 500;
  const response = {
    success: false,
    error: {
      message: err.message || 'Internal Server Error',
      code: err.code || 'INTERNAL_ERROR'
    }
  };

  if (isDevelopment) {
    response.error.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Validate database operation errors
 */
const handleDatabaseError = (error) => {
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  logger.error({
    type: 'DATABASE_ERROR',
    message: error.message,
    code: error.code,
    sqlState: error.sqlState
  }, 'Database operation failed');

  // Map specific MySQL errors to user-friendly messages
  if (error.code === 'ER_DUP_ENTRY') {
    return new AppError('This record already exists', 409, 'DUPLICATE_ENTRY');
  }
  if (error.code === 'ER_BAD_FIELD_ERROR') {
    return new AppError('Invalid field', 400, 'INVALID_FIELD');
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    return new AppError('Referenced record does not exist', 404, 'NOT_FOUND');
  }

  return new AppError(
    isDevelopment ? error.message : 'Database operation failed',
    500,
    'DATABASE_ERROR'
  );
};

/**
 * Validation error formatter
 */
const formatValidationError = (error) => {
  return new AppError(
    error.message || 'Validation failed',
    400,
    'VALIDATION_ERROR'
  );
};

module.exports = {
  logger,
  AppError,
  asyncHandler,
  errorHandler,
  handleDatabaseError,
  formatValidationError
};
