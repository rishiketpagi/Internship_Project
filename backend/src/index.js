/**
 * Server bootstrap.
 *
 * Wires the app to a real HTTP port and installs graceful
 * shutdown handlers so an in-flight request can finish before
 * the process exits.
 */
import { buildApp } from "./app.js";
import { env } from "./config/env.js";
import { logger } from "./config/logger.js";
import { APP_NAME, APP_VERSION } from "./config/constants.js";

const app = buildApp();

const server = app.listen(env.PORT, () => {
  logger.info(
    {
      port: env.PORT,
      env: env.NODE_ENV,
      ai: env.AI_ENABLED ? "groq" : "fallback",
      storage: env.STORAGE,
      auth: env.AUTH_MODE,
    },
    `${APP_NAME} v${APP_VERSION} listening on :${env.PORT}`
  );
  // eslint-disable-next-line no-console
  console.log(`✓ ${APP_NAME} v${APP_VERSION} ready at http://localhost:${env.PORT}`);
  // eslint-disable-next-line no-console
  console.log(`  Health:    http://localhost:${env.PORT}/health`);
  // eslint-disable-next-line no-console
  console.log(`  API docs:  http://localhost:${env.PORT}/docs`);
  // eslint-disable-next-line no-console
  console.log(`  UI:        http://localhost:${env.PORT}/`);
});

const shutdown = (signal) => {
  logger.info({ signal }, "shutting down");
  // Stop accepting new connections, then drain.
  server.close((err) => {
    if (err) {
      logger.error({ err: { message: err.message } }, "error during shutdown");
      process.exit(1);
    }
    process.exit(0);
  });

  // Hard-exit if draining takes too long.
  setTimeout(() => {
    logger.warn("forced shutdown after 10s");
    process.exit(1);
  }, 10_000).unref();
};

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("unhandledRejection", (reason) => {
  logger.error({ err: { message: String(reason) } }, "unhandled promise rejection");
});
process.on("uncaughtException", (err) => {
  logger.fatal({ err: { message: err.message, stack: err.stack } }, "uncaught exception");
  process.exit(1);
});

export { app, server };
