import dotenv from "dotenv";

dotenv.config();

if (!process.env.PORT || !process.env.NODE_ENV || !process.env.MONGO_URI) {
  console.error(
    "Missing required environment variables. Please check your .env file.",
  );
  process.exit(1);
}

const envConfig = Object.freeze({
  PORT: process.env.PORT || 9000,
  NODE_ENV: process.env.NODE_ENV || "development",
  MONGO_URI: process.env.MONGO_URI,
});

export default envConfig;
