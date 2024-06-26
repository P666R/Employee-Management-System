import express from 'express';
import registerUser from '../controllers/auth/registerController.js';
import loginUser from '../controllers/auth/loginController.js';
import { loginLimiter } from '../middleware/apiLimiter.js';
import newAccessToken from '../controllers/auth/refreshTokenController.js';
import logoutUser from '../controllers/auth/logoutController.js';

const router = express.Router();

router.post('/register', registerUser);

router.post('/login', loginLimiter, loginUser);

router.get('/new_access_token', newAccessToken);

router.get('/logout', logoutUser);

export default router;
