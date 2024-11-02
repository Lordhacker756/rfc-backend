import { getUserData, greetUser, getAuthUser } from "../controllers/userController.js";
import express from 'express'
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/greet', authenticateToken, greetUser);
router.get('/get/:id', getUserData);
router.get('/profile', authenticateToken, getAuthUser);

export default router;