/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         avatar:
 *           type: string
 *         headline:
 *           type: string
 *         socialAccounts:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               accountType:
 *                 type: string
 *               handle:
 *                 type: string
 * 
 * /user/profile:
 *   get:
 *     summary: Get authenticated user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized
 * 
 * /user/{id}:
 *   post:
 *     summary: Update user profile
 *     tags: [User]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 * 
 * /user/url/{url}:
 *   get:
 *     summary: Get user by custom URL
 *     tags: [User]
 *     parameters:
 *       - in: path
 *         name: url
 *         required: true
 *         schema:
 *           type: string
 *         description: Custom URL of the user
 *     responses:
 *       200:
 *         description: User data retrieved successfully
 *       404:
 *         description: User not found
 *       500:
 *         description: Server error
 */

import { getUserData, greetUser, getAuthUser, updateUser, getUserByUrl, getUserByJwt, getAllRegisteredUsers } from "../controllers/userController.js";
import express from 'express'
import { authenticateToken } from '../middlewares/authMiddleware.js';
import { checkRole } from '../middlewares/roleMiddleware.js';

const router = express.Router();

router.get('/greet', authenticateToken, greetUser);
router.get('/get/:id', getUserData);
router.get('/profile', authenticateToken, getAuthUser);
router.post('/:id', authenticateToken, updateUser);
router.get('/url/:url', getUserByUrl);
router.get('/', authenticateToken, getUserByJwt);
router.get('/all', authenticateToken, checkRole('admin', 'moderator'), getAllRegisteredUsers);

export default router;