import { Request, Response } from 'express';
import pool from '../config/db';

export const categoryController = {

    getCategories: async (req: Request, res: Response) => {

        try {
            const result = await pool.query(`SELECT *
                    FROM interview_categories
                    ORDER BY id`
            );

            res.json({
                success: true,
                categories: result.rows
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message:
                    'Failed to load categories'
            });
        }
    }
};