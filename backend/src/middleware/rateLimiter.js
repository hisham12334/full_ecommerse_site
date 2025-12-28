// backend/src/middleware/rateLimiter.js
const rateLimitStore = new Map();

// Clean up expired entries every 5 minutes (instead of every request)
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.resetTime > 15 * 60 * 1000) { // 15 min window
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000); 

const createRateLimiter = (options = {}) => {
  const {
    windowMs = 15 * 60 * 1000,
    max = 100,
    message = 'Too many requests from this IP, please try again later.',
    standardHeaders = true,
    legacyHeaders = false,
  } = options;

  return (req, res, next) => {
    // Trust proxy is required for Render/Vercel to get real IP
    // Ensure app.set('trust proxy', 1) is in server.js
    const key = req.headers['x-forwarded-for'] || req.ip; 
    
    const now = Date.now();
    let rateLimitData = rateLimitStore.get(key);

    if (!rateLimitData || now - rateLimitData.resetTime > windowMs) {
      rateLimitData = { count: 0, resetTime: now };
      rateLimitStore.set(key, rateLimitData);
    }

    rateLimitData.count++;

    if (standardHeaders) {
      res.set({
        'RateLimit-Limit': max,
        'RateLimit-Remaining': Math.max(0, max - rateLimitData.count),
        'RateLimit-Reset': new Date(rateLimitData.resetTime + windowMs)
      });
    }

    if (rateLimitData.count > max) {
      return res.status(429).json({ error: message });
    }

    next();
  };
};

// ... keep your exports (generalLimiter, etc.)
module.exports = { createRateLimiter, generalLimiter: createRateLimiter({ max: 100 }), authLimiter: createRateLimiter({ max: 10 }), apiLimiter: createRateLimiter({ max: 1000 }) };