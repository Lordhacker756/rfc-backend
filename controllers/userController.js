import User from "../models/User.js";
import mongoose from 'mongoose';
import { AppError } from "../errors/errorHandler.js";

export const greetUser = async (req, res) => {
    res.send(`Welcome, ${req.user.name}!`);
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

export const logout = (req, res) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
};