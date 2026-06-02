import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";
import pool from "./config/db";
import authRoutes from "./routes/authRoutes";
import sessionRoutes from './routes/session.routes';
import messageRoutes from './routes/message.routes';
import categoryRoutes from './routes/category.routes';

const app = express();

app.use(cors());
app.use(cors({
  origin: [
    'http://localhost:4200',
    'https://ai-interview-assistant-app.netlify.app'
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Interview Assistant API Running");
});

app.get("/test", (req, res) => {
  res.send("Server working");
});

app.get("/db-test", async (req, res) => {

  try {

    const result = await pool.query("SELECT NOW()");

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false
    });

  }

});
app.use("/api/ai", aiRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/session', sessionRoutes);
app.use('/api/message', messageRoutes);
app.use('/api/category', categoryRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});