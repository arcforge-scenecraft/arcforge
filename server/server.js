import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projects = [
  {
    id: "1",
    title: "Sci-Fi Space Opera",
    description: "An epic galactic war story.",
  },
  {
    id: "2",
    title: "Cyberpunk Detective",
    description: "Neo-Tokyo noir investigation.",
  },
];

app.use(express.json());
app.use(cors());

app.use(express.static(path.join(__dirname, "public")));

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

app.get("/api/projects", (req, res) => {
  res.status(200).json(projects);
});

app.get("/api/projects/:projectId", (req, res) => {
  const project = projects.find((item) => item.id === req.params.projectId);

  if (!project) {
    return res.status(404).json({ message: "Project not found" });
  }

  return res.status(200).json(project);
});

app.get("*", (req, res, next) => {
  if (req.path.startsWith("/api/")) {
    return next();
  }

  return res.sendFile(path.join(__dirname, "public", "index.html"));
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});