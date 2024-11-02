import { getUserData, greetUser, getAuthUser, updateUser } from "../controllers/userController.js";
import express from 'express'
import { authenticateToken } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/greet', authenticateToken, greetUser);
router.get('/get/:id', getUserData);
router.get('/profile', authenticateToken, getAuthUser);
router.post('/:id', authenticateToken, updateUser);

export default router;