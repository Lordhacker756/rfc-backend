import logger from '../utils/logger.js';

class AppError extends Error {
    constructor(message, statusCode, validationErrors = []) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.validationErrors = validationErrors;
        Error.captureStackTrace(this, this.constructor);
    }
}

const errorHandler = (err, req, res, next) => {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error';

    logger.error({
        message: err.message,
        statusCode: err.statusCode,
        validationErrors: err.validationErrors,
    })

    res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
        validationErrors: process.env.NODE_ENV === 'development' ? err.validationErrors : undefined,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
};


export { AppError, errorHandler };