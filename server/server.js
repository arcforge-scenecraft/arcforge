import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import projectsRouter from "./routes/projects.js";
import locationsRouter from "./routes/locations.js"
<<<<<<< Updated upstream
import scenesRouter from "./routes/scenes.js"
=======
import charactersRouter from "./routes/characters.js"
>>>>>>> Stashed changes

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(express.json());
app.use(cors());

// Kept both middleware lines from the conflict
app.use(express.static(path.join(__dirname, "public")));
app.use("/api/projects", projectsRouter);
app.use("/api/projects/:projectId/locations", locationsRouter)
<<<<<<< Updated upstream
app.use("/api/projects/:projectId/scenes", scenesRouter)
=======
app.use("/api/projects/:projectId/characters", charactersRouter)
>>>>>>> Stashed changes

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
