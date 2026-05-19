import express from "express";
import { askAI } from "../services/openai.service";

const router = express.Router();

router.post("/chat", async (req, res) => {
    try {
        const { message } = req.body;

        const reply = await askAI(message);

        res.json({
            success: true,
            reply,
        });
    } catch (error: any) {
        console.log(error);

        res.status(500).json({
            success: false,
            error: error.message,
        });
    }
});

export default router;