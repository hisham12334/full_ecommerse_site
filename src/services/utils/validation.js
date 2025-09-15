// Validation utilities
export const validators = {
  email: (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  password: (password) => {
    return password && password.length >= 6;
  },

  required: (value) => {
    return value && value.toString().trim().length > 0;
  },

  phone: (phone) => {
    const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  },

  price: (price) => {
    return !isNaN(price) && parseFloat(price) > 0;
  }
};

export const validateForm = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach(field => {
    const value = data[field];
    const fieldRules = rules[field];

    fieldRules.forEach(rule => {
      if (typeof rule === 'string') {
        // Built-in validator
        if (!validators[rule](value)) {
          errors[field] = errors[field] || `Invalid ${field}`;
        }
      } else if (typeof rule === 'function') {
        // Custom validator
        const result = rule(value);
        if (result !== true) {
          errors[field] = errors[field] || result;
        }
      }
    });
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};