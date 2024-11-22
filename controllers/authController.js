import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { AppError } from '../errors/errorHandler.js';
import logger, { consoleLog } from '../utils/logger.js';
import { generateUniqueUrl } from '../utils/urlGenerator.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, name, role, validityMonths } = req.body;

        // Check if authenticated user has permission to create this role
        if (role === 'admin' ||
            (role === 'moderator' && req.user.role !== 'admin') ||
            (role === 'user' && !['admin', 'moderator'].includes(req.user.role))) {
            return next(new AppError('You do not have permission to create this role', 403));
        }

        logger.info(`New registration attempt for user: ${email}`);

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new AppError('User already exists', 400));
        }

        // Generate unique URL from name
        const url = await generateUniqueUrl(name);

        // Calculate validTill based on creator's role
        let validTill;
        if (req.user.role === 'admin') {
            // Admin can set custom validity for moderators
            validTill = new Date();
            validTill.setMonth(validTill.getMonth() + (validityMonths || 12)); // Default 12 months
        } else if (req.user.role === 'moderator') {
            // Moderator's created users inherit moderator's validTill
            validTill = new Date(req.user.validTill);
        }

        // Create new user
        const user = new User({
            email,
            password,
            name,
            url,
            role,
            validTill,
            createdBy: req.user._id
        });

        await user.save();

        logger.info(`User registered successfully: ${email}`);
        consoleLog.success(`New user registered: ${name}`);

        res.status(201).json({
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                url: user.url,
                role: user.role,
                validTill: user.validTill
            }
        });
    } catch (error) {
        logger.error('Registration error:', error);
        next(new AppError(error.message, 500));
    }
};

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            // User not found, throw a 400 error
            return next(new AppError('User not found', 400));
        }

        // Check if the user's account is not expired
        const today = new Date();
        if (user.validTill && new Date(user.validTill) < today) {
            return next(new AppError('Account has expired', 403));
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            // Invalid password, throw a 400 error
            return next(new AppError('Invalid password', 400));
        }

        // Create and assign token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name
            }
        });
    } catch (error) {
        // Pass any internal server error to error handler
        next(new AppError(error.message, 500));
    }
};

export const logout = (req, res, next) => {
    req.logout((err) => {
        if (err) return next(new AppError('Logout failed', 500));
        res.redirect('/');
    });
};
