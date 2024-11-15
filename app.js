import './utils/envCheck.js';

import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';

import authRoutes from './routes/auth.js';
import userRoutes from './routes/user.js';
import uploadRoutes from './routes/upload.js';
import { errorHandler } from './errors/errorHandler.js';
import logger, { consoleLog } from './utils/logger.js';
import { swaggerDocs } from './utils/swagger.js';

dotenv.config();
const app = express();

// Database connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    logger.info('MongoDB connected 🌿');
  })
  .catch((err) => {
    logger.error('MongoDB connection error:', err);
    consoleLog.error(`MongoDB connection failed: ${err.message}`);
  });

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per window
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/auth', limiter);
app.use('/user', limiter);
app.use('/test', limiter);
app.use('/util', limiter);


// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

// Routes
app.use('/auth', authRoutes);
app.use('/user', userRoutes);
app.use('/test', (req, res) => {
  res.json({
    message: "Server running!"
  })
})
app.use('/util', uploadRoutes);

// Add this before the errorHandler
swaggerDocs(app);

app.use(errorHandler)



export default app;
