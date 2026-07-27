import "./config/dotenv.js";

import express from "express";
import cors from "cors";

import projectsRouter from "./routes/projects.js";
import locationsRouter from "./routes/locations.js";
import scenesRouter from "./routes/scenes.js";
import charactersRouter from "./routes/characters.js";
import sceneCharacterRouter from "./routes/scene-character.js";

const app = express();

const allowedOrigins = ["http://localhost:5173", process.env.CLIENT_URL].filter(
  Boolean,
);

app.use(
  cors({
    origin(origin, callback) {
      // Allow requests without an Origin header, such as Postman,
      // curl, Render health checks, and server-to-server requests.
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS blocked request from ${origin}`));
    },
  }),
);

app.use(express.json());

// API routes
app.use("/api/projects", projectsRouter);
app.use("/api/projects/:projectId/locations", locationsRouter);
app.use("/api/projects/:projectId/scenes", scenesRouter);
app.use("/api/projects/:projectId/characters", charactersRouter);
app.use(
  "/api/projects/:projectId/scenes/:sceneId/scene-characters",
  sceneCharacterRouter,
);

// Basic server route
app.get("/", (_req, res) => {
  res.status(200).send(`
    <h1 style="text-align: center; margin-top: 50px;">
      ArcForge API
    </h1>
  `);
});

// Render health check
app.get("/api/health", (_req, res) => {
  res.status(200).json({
    status: "ok",
    message: "ArcForge API is running.",
  });
});

// API 404 response
app.use("/api", (_req, res) => {
  res.status(404).json({
    message: "API route not found.",
  });
});

// Error handler
app.use((error, _req, res, _next) => {
  console.error(error);

  if (error.message?.startsWith("CORS blocked request")) {
    return res.status(403).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: "An unexpected server error occurred.",
  });
});

const PORT = Number(process.env.PORT) || 3001;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
