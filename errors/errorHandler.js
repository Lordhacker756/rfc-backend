import logger from '../utils/logger.js';

class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    // Log the error
    logger.error({
        message: err.message,
        stack: err.stack,
        statusCode: err.statusCode,
        path: req.path,
        method: req.method
    });

    const response = {
        status: err.status,
        message: err.message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    // Add specific error details if they exist (e.g., validation errors)
    if (err.errors) {
        response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
};


export { AppError, errorHandler };