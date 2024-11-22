import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { AppError } from '../errors/errorHandler.js'

export const authenticateToken = async (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        // No token provided, throw a 401 error
        return next(new AppError('Access denied. No token provided.', 401));
    }

    try {
        const verified = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(verified.id).select('-password');

        if (!user) {
            // If no user is found, throw a 404 error
            return next(new AppError('User not found', 404));
        }

        // Check if account is still valid
        if (user.validTill && new Date(user.validTill) < new Date()) {
            return next(new AppError('Account has expired', 403));
        }

        req.user = user;
        next();
    } catch (err) {
        // Invalid token, throw a 403 error
        next(new AppError('Invalid token', 403));
    }
};
