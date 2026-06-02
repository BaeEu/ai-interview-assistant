import { Request, Response } from 'express';
import pool from '../config/db';

export const sessionController = {
    createSession: async (req: Request, res: Response) => {

        try {
            const { user_id, category } = req.body;
            const result = await pool.query(`INSERT INTO interview_sessions
                (user_id, category) VALUES ($1, $2) RETURNING *`,
                [user_id, category]
            );
            res.json(result.rows[0]);

        } catch (error) {
            console.log(error);
            res.status(500).json({
                message: 'Create session failed'
            });
        }
    },

    getUserSessions: async (req: Request, res: Response) => {
        try {
            const { userId } = req.params;
            const result = await pool.query(`SELECT * FROM interview_sessions
                 WHERE user_id = $1 ORDER BY created_at DESC`,
                [userId]
            );
            res.json({
                success: true,
                sessions: result.rows
            });
        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Failed to load sessions'
            });
        }
    },
    deleteSession: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;

            await pool.query(
                `DELETE FROM interview_messages WHERE session_id = $1`,
                [sessionId]
            );

            await pool.query(
                `DELETE FROM interview_sessions WHERE session_id = $1`, [sessionId]
            );

            res.json({ success: true, message: 'Session deleted' });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    },

    updateSession: async (req: Request, res: Response) => {
        try {

            const { sessionId } = req.params;

            const { category } = req.body;

            await pool.query(`UPDATE interview_sessions SET category = $1,modified_date = NOW()
                                WHERE session_id = $2`, [category, sessionId]
            );

            res.json({ success: true });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false
            });
        }
    }
};