import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const client = new OpenAI({
    apiKey: process.env.OPENROUTER_API_KEY,
    baseURL: "https://openrouter.ai/api/v1",
});

export const askAI = async (message: string) => {
    try {
        const response = await client.chat.completions.create({
            model: "meta-llama/llama-3-8b-instruct",
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        });

        const reply =
            response.choices?.[0]?.message?.content ||
            "No response from AI";

        return reply;
    } catch (error) {
        console.log("OpenAI Error:", error);
        throw error;
    }
};