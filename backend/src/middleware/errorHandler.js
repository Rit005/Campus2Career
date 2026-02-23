
export class APIError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

const handleDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const message = `Duplicate field value: ${field}. Please use another value.`;
  return new APIError(message, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  const message = `Validation error: ${errors.join('. ')}`;
  return new APIError(message, 400);
};

const handleJWTError = () => {
  return new APIError('Invalid token. Please login again.', 401);
};

const handleJWTExpiredError = () => {
  return new APIError('Your token has expired. Please login again.', 401);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    success: false,
    message: err.message,
    stack: err.stack,
    error: err
  });
};


const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  } else {
    console.error('ERROR 💥', err);

    res.status(500).json({
      success: false,
      message: 'Something went wrong. Please try again later.'
    });
  }
};


export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (err.code === 11000) error = handleDuplicateKeyError(err);
    if (err.name === 'ValidationError') error = handleValidationError(err);
    if (err.name === 'JsonWebTokenError') error = handleJWTError();
    if (err.name === 'TokenExpiredError') error = handleJWTExpiredError();

    sendErrorProd(error, res);
  }
};

export const notFound = (req, res, next) => {
  const error = new APIError(`Route ${req.originalUrl} not found`, 404);
  next(error);
};

