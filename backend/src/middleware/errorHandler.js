// Error handling middleware
const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Default error
  let error = {
    message: err.message || 'Something went wrong!',
    status: err.status || 500
  };

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    error.message = 'Resource not found';
    error.status = 404;
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    error.message = 'Duplicate field value entered';
    error.status = 400;
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    error.message = Object.values(err.errors).map(val => val.message).join(', ');
    error.status = 400;
  }

  res.status(error.status).json({
    error: error.message
  });
};

// 404 handler
const notFound = (req, res) => {
  res.status(404).json({ error: 'Route not found' });
};

module.exports = {
  errorHandler,
  notFound
};