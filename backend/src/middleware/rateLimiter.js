// Rate limiting middleware
const rateLimitStore = new Map();

const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000, // 15 minutes
    max = 100, // limit each IP to 100 requests per windowMs
    message = 'Too many requests from this IP, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
  } = options;

  return (req, res, next) => {
    const key = req.ip || req.connection.remoteAddress;
    const now = Date.now();
    
    // Clean up old entries
    for (const [ip, data] of rateLimitStore.entries()) {
      if (now - data.resetTime > windowMs) {
        rateLimitStore.delete(ip);
      }
    }

    // Get or create rate limit data for this IP
    let rateLimitData = rateLimitStore.get(key);
    if (!rateLimitData || now - rateLimitData.resetTime > windowMs) {
      rateLimitData = {
        count: 0,
        resetTime: now
      };
      rateLimitStore.set(key, rateLimitData);
    }

    // Increment request count
    rateLimitData.count++;

    // Set headers
    if (standardHeaders) {
      res.set({
        'RateLimit-Limit': max,
        'RateLimit-Remaining': Math.max(0, max - rateLimitData.count),
        'RateLimit-Reset': new Date(rateLimitData.resetTime + windowMs)
      });
    }

    if (legacyHeaders) {
      res.set({
        'X-RateLimit-Limit': max,
        'X-RateLimit-Remaining': Math.max(0, max - rateLimitData.count),
        'X-RateLimit-Reset': Math.ceil((rateLimitData.resetTime + windowMs) / 1000)
      });
    }

    // Check if limit exceeded
    if (rateLimitData.count > max) {
      return res.status(429).json({ error: message });
    }

    next();
  };
};

// Predefined rate limiters
const generalLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

const authLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 auth requests per windowMs
  message: 'Too many authentication attempts, please try again later.'
});

const apiLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 API requests per windowMs
});

module.exports = {
  createRateLimiter,
  generalLimiter,
  authLimiter,
  apiLimiter
};