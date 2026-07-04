import mongoose from "mongoose";
import envConfig from "./env.config.js";

class DatabaseConfig {
  static async connect() {
    try {
      mongoose.connection.on("connected", () => {
        console.log(" MongoDB connected successfully");
      });

      mongoose.connection.on("error", (error) => {
        console.error(" MongoDB connection error:", error.message);
      });

      mongoose.connection.on("disconnected", () => {
        console.warn(" MongoDB disconnected");
      });

      await mongoose.connect(envConfig.MONGO_URI);
    } catch (error) {
      console.error(" Failed to connect to MongoDB:", error.message);
      process.exit(1);
    }
  }
}

export default DatabaseConfig;
