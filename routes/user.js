import { getAuthUser, getUserData, greetUser } from "../controllers/userController.js";
import express from 'express'
import {ensureAuthenticated} from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/dashboard', ensureAuthenticated, greetUser);
router.get('/user/:username', getUserData);
router.get('/user/profile', getAuthUser);


export default router;