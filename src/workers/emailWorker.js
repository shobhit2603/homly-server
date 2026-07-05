import { Worker } from "bullmq";
import connection from "../config/config/bullmq-connection.js";
import { sendWelcomeEmail } from "../services/sendMailServices/sendWelcomeEmail.js";
import logger from "../utils/logger.js";

const worker = new Worker(
  "email",
  async (job) => {
    logger.info(`Processing job ${job.id} - ${job.name}`);

    try {
      if (job.name === "welcome-user") {
        await sendWelcomeEmail(job.data);
      } else if (job.name === "verify-email") {
        const { sendVerificationEmail } =
          await import("../services/sendMailServices/sendVerificationEmail.js");
        await sendVerificationEmail(job.data);
      } else if (job.name === "reset-password") {
        console.log("RESET EMAIL RECIPIENT:", job.data.to);
        const { sendResetPasswordEmail } =
          await import("../services/sendMailServices/sendResetPasswordEmail.js");
        await sendResetPasswordEmail(job.data);
      } else {
        logger.warn(`Unknown job type: ${job.name}`);
      }
    } catch (error) {
      logger.error(`Job ${job.id} failed: ${error.message}`);
      throw error; // Throw error to trigger BullMQ's automatic retry logic
    }
  },
  {
    connection,
    concurrency: 5, // Process up to 5 jobs concurrently
  },
);

worker.on("completed", (job) => {
  logger.info(`Job ${job.id} (${job.name}) completed successfully`);
});

worker.on("failed", (job, err) => {
  logger.error(`Job ${job?.id} (${job?.name}) failed: ${err.message}`);
});

worker.on("error", (err) => {
  logger.error("Worker encountered an error:", err);
});

logger.info("BullMQ Email Worker started successfully!");
