import express from 'express';
import { sessionController } from '../controllers/session.controller';
import { authMiddleware } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/t', (req, res) => {
    res.json({
        message: 'hello JWT'
    });
});

router.get(
    '/test',
    authMiddleware,
    (req, res) => {

        res.json({
            success: true,
            message: 'JWT Working'
        });
    }
);
router.post('/', authMiddleware, sessionController.createSession);

router.get('/user/:userId', authMiddleware, sessionController.getUserSessions);

router.delete('/:sessionId', authMiddleware, sessionController.deleteSession);

router.put('/:sessionId', authMiddleware, sessionController.updateSession);

export default router;