import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import { generateUniqueUrl } from '../utils/urlGenerator.js';
import logger, { consoleLog } from '../utils/logger.js';

dotenv.config();

const createAdminUser = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI);
        consoleLog.info('Connected to MongoDB');

        // Check if admin already exists
        const existingAdmin = await User.findOne({ role: 'admin' });
        if (existingAdmin) {
            consoleLog.warn('Admin user already exists!');
            process.exit(0);
        }

        // Admin user details
        const adminData = {
            email: process.env.ADMIN_EMAIL || 'admin@example.com',
            password: process.env.ADMIN_PASSWORD || 'adminPassword123',
            name: 'System Admin',
            role: 'admin',
            validTill: new Date('2099-12-31'), // Far future date
        };

        // Generate unique URL for admin
        const url = await generateUniqueUrl(adminData.name);

        // Create admin user
        const admin = new User({
            ...adminData,
            url,
            isActive: true
        });

        await admin.save();

        consoleLog.success('Admin user created successfully!');
        consoleLog.info(`Email: ${adminData.email}`);
        consoleLog.info('Please change the password after first login');

    } catch (error) {
        consoleLog.error('Error creating admin user:');
        console.error(error);
    } finally {
        await mongoose.disconnect();
        process.exit(0);
    }
};

createAdminUser(); 