// Validation middleware
const validateRegistration = (req, res, next) => {
  const { name, email, password } = req.body;
  const errors = [];

  if (!name || name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password || password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;
  const errors = [];

  if (!email || !isValidEmail(email)) {
    errors.push('Valid email is required');
  }

  if (!password) {
    errors.push('Password is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

const validateProduct = (req, res, next) => {
  const { title, price, image } = req.body;
  const errors = [];

  if (!title || title.trim().length < 2) {
    errors.push('Product title must be at least 2 characters long');
  }

  if (!price || isNaN(price) || parseFloat(price) <= 0) {
    errors.push('Valid price is required');
  }

  if (!image || !isValidUrl(image)) {
    errors.push('Valid image URL is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

const validateOrder = (req, res, next) => {
  const { items, total, shippingAddress } = req.body;
  const errors = [];

  if (!items || !Array.isArray(items) || items.length === 0) {
    errors.push('Order items are required');
  }

  if (!total || isNaN(total) || parseFloat(total) <= 0) {
    errors.push('Valid total amount is required');
  }

  if (!shippingAddress || typeof shippingAddress !== 'object') {
    errors.push('Shipping address is required');
  }

  if (errors.length > 0) {
    return res.status(400).json({ error: errors.join(', ') });
  }

  next();
};

// Helper functions
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const isValidUrl = (url) => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

module.exports = {
  validateRegistration,
  validateLogin,
  validateProduct,
  validateOrder
};