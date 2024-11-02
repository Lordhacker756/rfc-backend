import express from 'express';
import { upload } from '../utils/cloudinary.js';
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { AppError } from '../errors/errorHandler.js';
import logger from '../utils/logger.js';

const router = express.Router();

router.post('/upload-image', authenticateToken, upload.single('image'), async (req, res, next) => {
    try {
        if (!req.file) {
            return next(new AppError('No file uploaded', 400));
        }

        logger.info(`Image uploaded successfully: ${req.file.path}`);

        res.status(200).json({
            message: 'Upload successful',
            imageUrl: req.file.path,
            publicId: req.file.filename
        });
    } catch (error) {
        logger.error('Upload error:', error);
        next(new AppError('Error uploading file', 500));
    }
});

export default router; 