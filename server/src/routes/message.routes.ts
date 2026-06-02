import express from 'express';
import { messageController } from '../controllers/message.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.post('/', authMiddleware, messageController.saveMessage);

router.get('/:sessionId', authMiddleware, messageController.getMessages);

router.delete('/session/:sessionId', authMiddleware, messageController.clearMessages);

export default router;