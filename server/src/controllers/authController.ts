import { Request, Response } from "express";

import bcrypt from "bcryptjs";

import pool from "../config/db";

import { generateToken } from "../config/jwt";

export const authController = {

    registerUser: async (req: Request, res: Response) => {

        try {

            const { username, password } = req.body;

            const userExists =
                await pool.query(

                    `SELECT *
                     FROM users
                     WHERE username = $1`,

                    [username]
                );

            if (userExists.rows.length > 0) {

                return res.status(400).json({

                    message:
                        "Username already exists"
                });
            }

            const hashedPassword =
                await bcrypt.hash(
                    password,
                    10
                );

            const newUser =
                await pool.query(

                    `INSERT INTO users
                    (username, password)

                    VALUES ($1, $2)

                    RETURNING *`,

                    [
                        username,
                        hashedPassword
                    ]
                );

            const user =
                newUser.rows[0];

            const token =
                generateToken(
                    user.user_id
                );

            res.status(201).json({

                success: true,

                token,

                user: {

                    user_id:
                        user.user_id,

                    username:
                        user.username
                }
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({

                success: false,

                message:
                    "Server error"
            });
        }
    },

    loginUser: async (req: Request, res: Response) => {

        try {

            const { username, password } = req.body;

            const userResult = await pool.query(
                `SELECT * FROM users WHERE username = $1`,
                [username]
            );

            if (userResult.rows.length === 0) {
                return res.status(400).json({
                    message: 'Invalid credentials'
                });
            }
            const user = userResult.rows[0];

            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            const token = generateToken(user.id);
            res.json({
                success: true,
                token,
                user: {
                    user_id: user.id,
                    username: user.username
                }
            });

        } catch (error) {
            console.log(error);
            res.status(500).json({
                success: false,
                message: 'Server error'
            });
        }
    }
};