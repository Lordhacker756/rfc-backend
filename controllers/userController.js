import User from "../models/User.js";
import mongoose from 'mongoose';
import { AppError } from "../errors/errorHandler.js";
import bcrypt from 'bcryptjs';
import logger, { consoleLog } from '../utils/logger.js';

export const greetUser = async (req, res) => {
    res.send(`Welcome, ${req.user.name}!`);
};

export const getUserByJwt = async(req, res, next) => {
    try {
        // req.user is already populated by authenticateToken middleware
        // and password is already excluded by the middleware
        res.status(200).json({
            status: 'success',
            data: req.user
        });
    } catch (error) {
        logger.error('Get user by JWT error:', error);
        next(new AppError(error.message, 500));
    }
};

export const getUserData = async (req, res, next) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        next(new AppError("Invalid user ID format", 400))
    }
    const id = req.params.id;

    try {
        const userObj = await User.findOne({ _id: id });

        if (!userObj) {
            next(new AppError("User not found!", 404))
        }

        res.json(userObj);
    } catch (error) {
        console.error(error);
        next(new AppError("Something went wrong", 500))
    }
};

export const getAuthUser = async (req, res) => {
    res.status(200).json({
        user: req.user
    })
}

export const updateUser = async (req, res, next) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        // Check if user exists
        const user = await User.findById(id);
        if (!user) {
            return next(new AppError('User not found', 404));
        }

        // Check if authenticated user is updating their own profile
        if (req.user.id !== id) {
            return next(new AppError('Not authorized to update this profile', 403));
        }

        // If password is being updated, hash it
        if (updates.password) {
            const salt = await bcrypt.genSalt(10);
            updates.password = await bcrypt.hash(updates.password, salt);
        }

        // Fields that are allowed to be updated
        const allowedUpdates = ['name', 'email', 'password', 'avatar', 'headline', 'backgroundImage', 'socialAccounts', 'whatsapp', 'address', 'services', 'activeTheme'];

        // Filter out any fields that aren't allowed to be updated
        const filteredUpdates = Object.keys(updates)
            .filter(key => allowedUpdates.includes(key))
            .reduce((obj, key) => {
                obj[key] = updates[key];
                return obj;
            }, {});

        // Update user with filtered updates
        const updatedUser = await User.findByIdAndUpdate(
            id,
            filteredUpdates,
            { new: true, runValidators: true }
        ).select('-password');

        logger.info(`User updated successfully: ${updatedUser.email}`);
        consoleLog.success(`User updated: ${updatedUser.name}`);

        res.json({
            message: 'User updated successfully',
            user: updatedUser
        });
    } catch (error) {
        logger.error('Update user error:', error);
        next(new AppError(error.message, 500));
    }
};

export const getUserByUrl = async (req, res, next) => {
    try {
        const { url } = req.params;

        const user = await User.findOne({ url })
            .select('-password -__v'); // Exclude sensitive data

        if (!user) {
            return next(new AppError('User not found', 404));
        }

        res.status(200).json({
            status: 'success',
            data: user
        });
    } catch (error) {
        logger.error('Error fetching user by URL:', error);
        next(new AppError('Error fetching user data', 500));
    }
};