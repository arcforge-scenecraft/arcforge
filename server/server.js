import express from "express";
import cors from "cors";
import projectsRouter from "./routes/projects.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/projects", projectsRouter);

app.get("/", (req, res) => {
  res
    .status(200)
    .send('<h1 style="text-align: center; margin-top: 50px;">ArcForge</h1>');
});

app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ArcForge server is running",
  });
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
