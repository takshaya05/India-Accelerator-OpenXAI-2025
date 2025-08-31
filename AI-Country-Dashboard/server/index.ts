import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import { getTop15, getAll } from "./routes/countries";
import { chatWithOllama } from "./routes/ollama";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Countries
  app.get("/api/countries/top15", getTop15);
  app.get("/api/countries/all", getAll);

  // Ollama proxy
  app.post("/api/ollama/chat", chatWithOllama);

  return app;
}
