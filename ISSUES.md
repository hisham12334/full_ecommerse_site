# Potential Issues & Recommendations

> **Last Reviewed:** December 30, 2025

This document outlines potential security vulnerabilities, code quality concerns, and recommendations for improvement.

---

## 🔴 Critical Security Issues

### 1. Hardcoded Admin Credentials
**File:** `backend/src/config/database.js` (lines 41-44)

```javascript
const hashedPassword = await bcrypt.hash('admin123', 10);
await client.query("INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)", 
  ['Admin', 'admin@admin.com', hashedPassword, 'admin']);
```

**Risk:** Default admin account with predictable credentials (`admin@admin.com` / `admin123`) is created automatically.

**Fix:**
- Remove auto-creation of admin account
- Use environment variables for initial admin setup
- Or require admin setup via CLI/setup script

---

### 2. Default JWT Secret Fallback
**Files:** `backend/src/middleware/auth.js`, `backend/src/controllers/authController.js`

```javascript
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production';
```

**Risk:** If `JWT_SECRET` env variable is not set, a predictable default is used, making all tokens forgeable.

**Fix:**
```javascript
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error('FATAL: JWT_SECRET environment variable is not set');
}
```

---

### 3. SSL Certificate Validation Disabled
**File:** `backend/src/config/database.js` (line 16)

```javascript
ssl: { rejectUnauthorized: false }
```

**Risk:** Vulnerable to man-in-the-middle attacks. SSL certificates are not validated.

**Fix:** For production, set `rejectUnauthorized: true` and configure proper SSL certificates.

---

### 4. Tokens Stored in localStorage
**File:** `src/context/AuthContext.jsx`

```javascript
localStorage.setItem('authToken', response.token);
```

**Risk:** localStorage is vulnerable to XSS attacks. Any injected script can steal tokens.

**Recommendation:**
- Use `httpOnly` cookies for token storage (requires backend changes)
- Or implement token refresh mechanism with shorter token lifetimes

---

## 🟠 Medium Priority Issues

### 5. Rate Limiter Uses In-Memory Store
**File:** `backend/src/middleware/rateLimiter.js`

```javascript
const rateLimitStore = new Map();
```

**Risk:** 
- Not shared across multiple server instances (if scaled)
- Resets on server restart
- Memory could grow unbounded under attack

**Fix:** Use Redis or similar persistent store for rate limiting.

---

### 6. Rate Limiters Not Applied to Routes
The rate limiters are defined but I didn't see them applied to the auth routes in the server configuration.

**Fix:** Apply limiters in route definitions:
```javascript
app.use('/api/auth', authLimiter, createAuthRoutes(db));
```

---

### 7. Weak Password Requirements
**File:** `backend/src/middleware/validation.js` (line 14)

```javascript
if (!password || password.length < 6) {
```

**Risk:** 6 characters is too short by modern standards.

**Fix:** Require minimum 8 characters with complexity rules:
- At least one uppercase letter
- At least one number
- At least one special character

---

### 8. No CSRF Protection
The API relies solely on JWT tokens without CSRF protection for state-changing operations when cookies might be used.

**Fix:** Implement CSRF tokens for sensitive operations.

---

### 9. JWT in Client-Side Token Parsing
**File:** `src/context/AuthContext.jsx` (line 19)

```javascript
const payload = JSON.parse(atob(token.split('.')[1]));
```

**Risk:** Manual JWT parsing without signature verification. Malformed tokens could cause crashes.

**Fix:** Add try-catch and validate token structure before parsing.

---

## 🟡 Code Quality Issues

### 10. Inconsistent Error Handling
Some API endpoints return errors in different formats:
- `{ error: 'message' }`
- `{ success: false, error: 'message' }`

**Fix:** Standardize all error responses.

---

### 11. No Input Sanitization
User inputs are validated but not sanitized for HTML/SQL injection in some areas.

**Fix:** Add input sanitization library (e.g., `validator.js` or `DOMPurify`).

---

### 12. Duplicate JWT_SECRET Definition
JWT_SECRET is defined in multiple files instead of being centralized.

**Fix:** Create a central config file:
```javascript
// backend/src/config/auth.js
module.exports = {
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: '24h'
};
```

---

### 13. No Database Connection Pooling Limits
**File:** `backend/src/config/database.js`

The PostgreSQL pool has no explicit min/max connections set.

**Fix:**
```javascript
pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 20,  // Maximum connections
  min: 2,   // Minimum connections
  idleTimeoutMillis: 30000
});
```

---

### 14. No Health Check Endpoint
No dedicated health check endpoint for monitoring/load balancers.

**Fix:** Add health check route:
```javascript
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});
```

---

### 15. Frontend Logout Inconsistency
**Files:** `src/context/AuthContext.jsx` vs `src/services/api/auth.js`

AuthContext clears `authToken` but api/auth.js clears `token`. Inconsistent key names.

```javascript
// AuthContext.jsx
localStorage.removeItem('authToken');

// api/auth.js
localStorage.removeItem('token');  // Different key!
```

**Fix:** Use consistent localStorage key names across the codebase.

---

## 🔧 Missing Features (Production Readiness)

| Feature | Status | Priority |
|---------|--------|----------|
| Password Reset Flow | ❌ Missing | High |
| Email Verification | ❌ Missing | High |
| Account Lockout (failed attempts) | ❌ Missing | Medium |
| Audit Logging | ❌ Missing | Medium |
| Request Logging | ❌ Missing | Medium |
| API Documentation (Swagger/OpenAPI) | ❌ Missing | Low |
| Unit/Integration Tests | ❌ Missing | High |
| Database Migrations System | ⚠️ Basic | Medium |

---

## 📋 Quick Fix Priority List

1. **CRITICAL:** Remove default JWT secret fallback
2. **CRITICAL:** Remove/secure hardcoded admin credentials
3. **HIGH:** Enable SSL certificate validation in production
4. **HIGH:** Apply rate limiters to routes
5. **MEDIUM:** Strengthen password requirements
6. **MEDIUM:** Fix localStorage key inconsistency
7. **LOW:** Add health check endpoint
8. **LOW:** Centralize configuration

---

## ✅ Things Done Well

- ✅ Passwords properly hashed with bcrypt
- ✅ SQL injection prevented with parameterized queries
- ✅ CORS properly configured with whitelist
- ✅ Role-based access control implemented
- ✅ Order transactions use database locks (`FOR UPDATE`)
- ✅ Server-side price calculation (prevents price manipulation)
- ✅ Token expiry (24h) implemented
- ✅ Error boundaries in frontend
