import { Request, Response } from 'express';
import pool from '../config/db';

export const messageController = {

    saveMessage: async (req: Request, res: Response) => {
        try {
            const { session_id, sender, message } = req.body;
            const result = await pool.query(
                `INSERT INTO interview_messages (session_id, sender, message) VALUES ($1, $2, $3)
                    RETURNING *`, [session_id, sender, message]
            );

            res.json(result.rows[0]);

        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Save message failed' });
        }
    },

    getMessages: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            const result = await pool.query(
                `SELECT * FROM interview_messages WHERE session_id = $1 ORDER BY created_at ASC`,
                [sessionId]
            );
            res.json(result.rows);
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Fetch messages failed' });
        }
    },

    clearMessages: async (req: Request, res: Response) => {
        try {
            const { sessionId } = req.params;
            await pool.query(
                `DELETE FROM interview_messages WHERE session_id = $1`,
                [sessionId]
            );
            res.json({ success: true, message: 'Messages cleared' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ success: false, message: 'Server error' });
        }
    }
};