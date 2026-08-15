import "dotenv/config";
import express from "express";
import cors from "cors";
import profilesRouter from "./routes/profiles.js";
import eventsRouter from "./routes/events.js";
import authRouter from "./routes/auth.js";
import { requireAuth } from "./middleware/auth.js";

const app = express();

const FRONTEND_URLS = (process.env.FRONTEND_URL ?? "http://localhost:5173")
  .split(",")
  .map((origin) => origin.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const stripTrailingSlash = (origin) =>
  origin ? origin.replace(/\/+$/, "") : origin;

app.use(
  cors({
    origin(origin, callback) {
      callback(
        null,
        !origin || FRONTEND_URLS.includes(stripTrailingSlash(origin)),
      );
    },
  }),
);

app.use((req, res, next) => {
  if (Buffer.isBuffer(req.body)) {
    try {
      req.body = JSON.parse(req.body.toString("utf8"));
    } catch {
      req.body = {};
    }
  } else if (typeof req.body === "string") {
    try {
      req.body = JSON.parse(req.body);
    } catch {
      req.body = {};
    }
  }
  next();
});

app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/auth", authRouter);
app.use("/api/profiles", requireAuth, profilesRouter);
app.use("/api/events", requireAuth, eventsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
