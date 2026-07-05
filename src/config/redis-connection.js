import Redis from "ioredis";
import envConfig from "../env.config.js";

const connection = envConfig.REDIS_URL
  ? new Redis(envConfig.REDIS_URL, { maxRetriesPerRequest: null })
  : {
      host: envConfig.REDIS_HOST,
      port: envConfig.REDIS_PORT,
      password: envConfig.REDIS_PASSWORD || undefined,
    };

export default connection;
