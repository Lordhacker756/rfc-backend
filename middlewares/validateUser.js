import { body, validationResult } from 'express-validator';
import { AppError } from '../errors/errorHandler.js';

export const validateRegistration = [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('name').trim().notEmpty(),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            // If validation fails, use AppError to send error to centralized handler
            return next(new AppError('Validation failed', 400, errors.array()));
        }
        next();
    }
];
