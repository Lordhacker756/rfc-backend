import { body, validationResult } from 'express-validator';
import { AppError } from '../errors/errorHandler.js';

export const validateRegistration = [
    body('email')
        .isEmail().withMessage('A valid email address is required')
        .normalizeEmail(),
    body('password')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required'),
    body('role')
        .isIn(['moderator', 'user']).withMessage('Role must be either "moderator" or "user"'),
    body('validityMonths')
        .optional()
        .isInt({ min: 1, max: 60 }).withMessage('Validity months must be between 1 and 60'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const formattedErrors = errors.array().map(err => ({
                field: err.path,
                message: err.msg
            }));
            return next(new AppError('Validation failed', 400, formattedErrors));
        }
        next();
    }
];
