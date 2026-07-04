import { Queue } from "bullmq";
import connection from "../config/config/bullmq-connection.js";

export const emailQueue = new Queue("email", {
  connection,
  defaultJobOptions: {
    attempts: 3, // Retry up to 3 times on failure
    backoff: {
      type: "exponential",
      delay: 5000, // Wait 5s, 10s, 20s, etc. between retries
    },
    removeOnComplete: true, // Delete job metadata from Redis on success
    removeOnFail: false, // Keep failed jobs in Redis for debugging
  },
});
