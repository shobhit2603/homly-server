import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import envConfig from "./config/env.config.js";

const app = express();

// ─── Global Middlewares ──────────────────────────────────

// CORS configuration
app.use(
  cors({
    origin: envConfig.ALLOWED_ORIGINS,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Parse JSON request bodies
app.use(express.json({ limit: "16kb" }));

// Parse URL-encoded request bodies
app.use(express.urlencoded({ extended: true, limit: "16kb" }));

// Parse cookies
app.use(cookieParser());

// HTTP request logger (dev mode)
if (envConfig.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

export default app;
