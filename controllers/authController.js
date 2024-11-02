import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import { AppError } from '../errors/errorHandler.js';

export const register = async (req, res, next) => {
    try {
        const { email, password, name } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            // User already exists, throw a 400 error
            return next(new AppError('User already exists', 400));
        }

        // Create new user
        const user = new User({
            email,
            password,
            name
        });

        await user.save();

        // Create and assign token
        const token = jwt.sign(
            { id: user._id, email: user.email },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(201).json({
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

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            // User not found, throw a 400 error
            return next(new AppError('User not found', 400));
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
