import express from "express";
import cors from "cors";
import aiRoutes from "./routes/ai.routes";

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("AI Interview Assistant API Running");
});

app.get("/test", (req, res) => {
  res.send("Server working");
});

app.use("/api/ai", aiRoutes);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});