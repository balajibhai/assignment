import "dotenv/config";
import serverless from "serverless-http";
import { connectDb } from "../../src/db.js";
import app from "../../src/app.js";

const expressHandler = serverless(app);

let dbConnected = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function ensureDb() {
  let lastError;
  for (let attempt = 1; attempt <= 3; attempt += 1) {
    try {
      await connectDb();
      dbConnected = true;
      return;
    } catch (err) {
      lastError = err;
      if (attempt < 3) await sleep(250 * 2 ** (attempt - 1));
    }
  }
  throw lastError;
}

export const handler = async (event, context) => {
  const path = event?.rawUrl ?? event?.path ?? "";
  if (!dbConnected && !path.includes("/api/health")) {
    try {
      await ensureDb();
    } catch (err) {
      console.error("Database connection failed:", err.message);
      return {
        statusCode: 503,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          error: "Database unavailable. Please try again.",
        }),
      };
    }
  }
  return expressHandler(event, context);
};
