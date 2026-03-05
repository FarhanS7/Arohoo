import express from 'express';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
// Mocking prisma for now until global injection set up
// In actual app, we'd inject the singleton prisma client
import { PrismaClient } from '@prisma/client';

const router = express.Router();
const prisma = new PrismaClient();
const authService = new AuthService(prisma);
const authController = new AuthController(authService);

router.post('/register', authController.register);
router.post('/login', authController.login);

export default router;
