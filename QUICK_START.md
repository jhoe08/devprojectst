# Quick Reference: Using New Security Services

## 1. Password Service

### For New User Registration
```javascript
const { hashPassword, validatePasswordStrength } = require('../admin/passwordService');

app.post('/register', async (req, res) => {
  const { password } = req.body;
  
  // Validate password strength
  const validation = validatePasswordStrength(password);
  if (!validation.valid) {
    return res.status(400).json({ 
      error: 'Weak password',
      details: validation.errors 
    });
  }
  
  // Hash password before storing
  try {
    const hashedPassword = await hashPassword(password);
    // Save to database with hashedPassword
    // db.users.create({ ...userData, password: hashedPassword });
  } catch (error) {
    return res.status(500).json({ error: 'Password processing failed' });
  }
});
```

### For Login Verification
```javascript
const { verifyPassword } = require('../admin/passwordService');

app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  
  // Get user from database
  const user = await db.users.findOne({ username });
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Verify password using centralized service
  try {
    const isCorrect = await verifyPassword(password, user.password);
    if (!isCorrect) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Password correct - create session
    req.session.user = user;
    res.redirect('/');
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
});
```

---

## 2. Input Validation & Sanitization

### Automatic Sanitization (Already Active)
```javascript
// All requests are automatically sanitized
app.post('/api/data', (req, res) => {
  // req.body, req.query, req.params are already sanitized
  console.log(req.body); // Dangerous characters removed
});
```

### Manual Validation
```javascript
const { 
  validateLoginInput,
  isValidEmail,
  isValidUsername,
  sanitizeString 
} = require('../admin/inputValidation');

// Login validation
const { valid, errors } = validateLoginInput(username, password);

// Email validation
if (isValidEmail(email)) {
  // Process email
}

// Username validation
if (isValidUsername(username)) {
  // Register user
}

// Manual sanitization
const cleanString = sanitizeString(userInput);
```

---

## 3. Error Handling

### In Route Handlers
```javascript
const { asyncHandler, AppError } = require('../admin/errorHandler');

// Wrap async route handlers automatically
app.post('/api/submit', asyncHandler(async (req, res) => {
  const data = req.body;
  
  // Any error thrown is automatically caught and handled
  if (!data.required) {
    throw new AppError('Missing required field', 400, 'VALIDATION_ERROR');
  }
  
  const result = await db.save(data);
  res.json({ success: true, data: result });
}));
```

### Custom Error Responses
```javascript
const { AppError } = require('../admin/errorHandler');

// Create custom errors with status codes
throw new AppError('User not found', 404, 'USER_NOT_FOUND');
throw new AppError('Permission denied', 403, 'FORBIDDEN');
throw new AppError('Invalid input', 400, 'INVALID_INPUT');

// Errors automatically logged and formatted response sent
```

### Handling Database Errors
```javascript
const { handleDatabaseError } = require('../admin/errorHandler');

try {
  await db.query(sql);
} catch (error) {
  const appError = handleDatabaseError(error);
  // User-friendly error automatically created
  throw appError;
}
```

---

## 4. Logging

### Using Logger (Pino)
```javascript
const { logger } = require('../admin/errorHandler');

// Available log levels: trace, debug, info, warn, error, fatal
logger.info({ userId: 123 }, 'User logged in');
logger.warn({ action: 'failed' }, 'Action failed');
logger.error({ code: 'DB_ERROR' }, 'Database error occurred');

// Errors are automatically logged in error middleware
```

---

## 5. Complete Example: New User Registration

```javascript
const express = require('express');
const { asyncHandler, errorHandler, AppError } = require('./admin/errorHandler');
const { sanitizeInputMiddleware, validateLoginInput } = require('./admin/inputValidation');
const { hashPassword, validatePasswordStrength } = require('./admin/passwordService');
const db = require('./admin/database');

const app = express();

app.use(sanitizeInputMiddleware); // Sanitize all inputs

// Register route
app.post('/register', asyncHandler(async (req, res) => {
  const { username, password, email } = req.body;
  
  // Validate login input format
  const validation = validateLoginInput(username, password);
  if (!validation.valid) {
    throw new AppError(validation.errors.join(', '), 400, 'VALIDATION_ERROR');
  }
  
  // Validate password strength
  const strength = validatePasswordStrength(password);
  if (!strength.valid) {
    throw new AppError(
      'Password too weak: ' + strength.errors.join(', '),
      400,
      'WEAK_PASSWORD'
    );
  }
  
  // Check if user exists
  const existing = await db.getEmployeeByUsername(username);
  if (existing.length > 0) {
    throw new AppError('Username already taken', 409, 'DUPLICATE_USER');
  }
  
  // Hash password
  const hashedPassword = await hashPassword(password);
  
  // Save user
  const result = await db.createEmployee({
    username,
    email,
    password: hashedPassword
  });
  
  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    userId: result.insertId
  });
}));

// Global error handler MUST be last
app.use(errorHandler);

app.listen(3000, () => console.log('Server running'));
```

---

## 6. Testing the Services

### Test Password Hashing
```bash
# In Node REPL or test file
const { hashPassword, verifyPassword, validatePasswordStrength } = require('./admin/passwordService');

(async () => {
  // Test validation
  const validation = validatePasswordStrength('Pass123!');
  console.log('Valid password:', validation.valid);
  
  // Test hashing
  const hash = await hashPassword('MyPassword123!');
  console.log('Hashed:', hash);
  
  // Test verification
  const correct = await verifyPassword('MyPassword123!', hash);
  const wrong = await verifyPassword('WrongPassword', hash);
  console.log('Correct:', correct); // true
  console.log('Wrong:', wrong);     // false
})();
```

### Test Input Sanitization
```bash
const { sanitizeString, isValidEmail, isValidUsername } = require('./admin/inputValidation');

console.log(sanitizeString('<script>alert("xss")</script>'));
// Output: scriptalertxssscript

console.log(isValidEmail('user@example.com'));    // true
console.log(isValidEmail('invalid-email'));       // false

console.log(isValidUsername('john_doe'));        // true
console.log(isValidUsername('john-doe'));        // false
```

---

## 7. Common Patterns

### Protected Route with Validation
```javascript
app.post('/api/protected', 
  // Sanitization middleware already applied globally
  asyncHandler(async (req, res) => {
    const { action, data } = req.body;
    
    // Verify user is logged in
    if (!req.session?.user) {
      throw new AppError('Not authenticated', 401, 'UNAUTHORIZED');
    }
    
    // Validate input
    if (!action || !data) {
      throw new AppError('Missing required fields', 400, 'INVALID_INPUT');
    }
    
    // Process request
    const result = await processAction(action, data);
    
    res.json({ success: true, result });
  })
);
```

### BEFORE (Old Pattern - Don't Use)
```javascript
// ❌ DON'T DO THIS ANYMORE
const { registerUser, loginUser, authenticateUser } = require('../admin/misc');

app.post('/login', (req, res) => {
  const { username, password } = req.body;
  // Multiple password methods, unclear which works
  // No error handling, errors go to console
  // No input sanitization
});
```

---

## 💡 Pro Tips

1. **Always use asyncHandler** for async route handlers - it catches errors automatically
2. **Throw AppError** instead of console.log - it gets proper status codes and logging
3. **Never bypass sanitizeInputMiddleware** - all user input should be cleaned
4. **Don't mix password methods** - always use passwordService.js
5. **Check password strength** before saving new users
6. **Log sensitive info carefully** - password hashes never logged

---

## 📞 Troubleshooting

**Q: "Cannot find module 'admin/passwordService'"**  
A: Make sure you're requiring from correct path relative to file location: `require('./admin/passwordService')`

**Q: "Password verification always fails"**  
A: Ensure passwords in DB are bcrypt hashed. Old passwords from other hashing methods won't work.

**Q: "Sanitization removed needed characters"**  
A: Increase allowed characters in `inputValidation.js` UNSAFE_CHARS regex, but be careful with security.

**Q: "Error handler not catching errors"**  
A: Make sure you wrapped route handler with `asyncHandler()` and error handler is placed last.
