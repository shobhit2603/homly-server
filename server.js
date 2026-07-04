import app from "./src/app.js";
import envConfig from "./src/config/env.config.js";
import DatabaseConfig from "./src/config/db.config.js";

const PORT = envConfig.PORT || 9000;

const startServer = async () => {
  try {
    // Connect to MongoDB
    await DatabaseConfig.connect();

    // Start Express server
    app.listen(PORT, () => {
      console.log(`\n Homely Server is running`);
      console.log(`   Environment : ${envConfig.NODE_ENV}`);
      console.log(`   Port        : ${PORT}`);
      console.log(`   URL         : http://localhost:${PORT}`);
      console.log(`   Health      : http://localhost:${PORT}/api/v1/health\n`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();
