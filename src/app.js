import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { StatusCodes } from "http-status-codes";
import envConfig from "./config/env.config.js";
import v1Routes from "./routes/v1/index.routes.js";
import ErrorHandler from "./middlewares/errorHandler.middleware.js";
import ApiResponse from "./utils/ApiResponse.js";

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

// ─── API Versioning ──────────────────────────────────────

// v1 routes
app.use("/api/v1", v1Routes);

// ─── Health Check ────────────────────────────────────────

app.get("/api/v1/health", (_req, res) => {
  res.status(StatusCodes.OK).json(
    new ApiResponse(StatusCodes.OK, "Server is running healthy ", {
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
    }),
  );
});

// ─── 404 Handler ─────────────────────────────────────────

app.use((_req, res) => {
  res
    .status(StatusCodes.NOT_FOUND)
    .json(new ApiResponse(StatusCodes.NOT_FOUND, "Route not found"));
});

// ─── Global Error Handler ────────────────────────────────

app.use(ErrorHandler.handle);

export default app;
