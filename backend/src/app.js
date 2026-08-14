import "dotenv/config";
import express from "express";
import cors from "cors";
import profilesRouter from "./routes/profiles.js";
import eventsRouter from "./routes/events.js";

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
app.use(express.json());

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/profiles", profilesRouter);
app.use("/api/events", eventsRouter);

app.use((req, res) => {
  res.status(404).json({ error: "Not found" });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal server error" });
});

export default app;
