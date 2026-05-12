/**
 * Input Validation Middleware
 * Sanitizes and validates common input types to prevent injection attacks
 */

const UNSAFE_CHARS = /[<>\"'%&;]/g;

/**
 * Sanitize string input to prevent injection attacks
 */
const sanitizeString = (str) => {
  if (typeof str !== 'string') return str;
  return str.trim().replace(UNSAFE_CHARS, '');
};

/**
 * Validate email format
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate username (alphanumeric and underscore only)
 */
const isValidUsername = (username) => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Sanitize object input recursively
 */
const sanitizeObject = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'string') {
    return sanitizeString(obj);
  }
  
  if (typeof obj === 'object') {
    if (Array.isArray(obj)) {
      return obj.map(item => sanitizeObject(item));
    }
    
    const sanitized = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        sanitized[sanitizeString(key)] = sanitizeObject(obj[key]);
      }
    }
    return sanitized;
  }
  
  return obj;
};

/**
 * Express middleware for sanitizing request body, query, and params
 */
const sanitizeInputMiddleware = (req, res, next) => {
  try {
    if (req.body && typeof req.body === 'object') {
      req.body = sanitizeObject(req.body);
    }
    if (req.query && typeof req.query === 'object') {
      req.query = sanitizeObject(req.query);
    }
    if (req.params && typeof req.params === 'object') {
      req.params = sanitizeObject(req.params);
    }
    next();
  } catch (error) {
    console.error('Input sanitization error:', error);
    res.status(400).json({ error: 'Invalid input format' });
  }
};

/**
 * Validate login input
 */
const validateLoginInput = (username, password) => {
  const errors = [];
  
  if (!username || !password) {
    errors.push('Username and password are required');
  }
  if (username && username.length > 50) {
    errors.push('Username is too long');
  }
  if (password && password.length > 256) {
    errors.push('Password is invalid');
  }
  
  return {
    valid: errors.length === 0,
    errors
  };
};

module.exports = {
  sanitizeString,
  sanitizeObject,
  isValidEmail,
  isValidUsername,
  sanitizeInputMiddleware,
  validateLoginInput
};
