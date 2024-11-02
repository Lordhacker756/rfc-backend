# NFC Backend Service

A robust Node.js backend service for NFC-based digital business card management, built with Express.js and MongoDB.

## 🚀 Features

- User Authentication (Register/Login/Logout)
- JWT-based Authorization
- Profile Management
- Image Upload with Cloudinary
- Rate Limiting
- Error Handling
- Logging System
- Testing Suite

## 🛠️ Tech Stack

- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for Authentication
- Winston for Logging
- Jest for Testing
- Cloudinary for Image Storage
- Express Validator for Input Validation
- Helmet for Security Headers
- CORS Support

## 📋 Prerequisites

- Node.js 20.x
- MongoDB
- Cloudinary Account
- Environment Variables Setup

## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:
- MONGO_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret_key
- CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
- CLOUDINARY_API_KEY=your_cloudinary_api_key
- CLOUDINARY_API_SECRET=your_cloudinary_api_secret


## 🚀 Installation

1. Clone the repository
2. Install dependencies:
```npm install```
3. Start the development server:
```npm run dev```


## 🔍 API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - User login
- `GET /auth/logout` - User logout

### User Management
- `GET /user/profile` - Get authenticated user profile
- `GET /user/get/:id` - Get user by ID
- `POST /user/:id` - Update user profile

### Utilities
- `POST /util/upload-image` - Upload image to Cloudinary

## 🔒 Security Features

- Password Hashing (bcrypt)
- Rate Limiting
- JWT Authentication
- Security Headers (Helmet)
- Input Validation
- Error Handling
- CORS Configuration

## 📝 Logging

The application uses Winston for logging with different log levels:
- Error logs: `logs/error.log`
- Combined logs: `logs/combined.log`
- Console logs with color coding

## 📄 License

This project is licensed under the Apache-2.0 License - see the LICENSE file for details.
