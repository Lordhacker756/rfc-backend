import express from 'express';
import { register, login, logout } from '../controllers/authController.js';
import { validateRegistration } from '../middlewares/validateUser.js'

const router = express.Router();

router.post('/register', validateRegistration, register);
router.post('/login', login);
router.get('/logout', logout);

export default router;
