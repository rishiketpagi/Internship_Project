/**
 * Structured logger built on pino.
 *
 * In development the logs are pretty-printed; in production
 * the output is JSON (one log line per event) so a log shipper
 * (Cloudwatch / Loki / Datadog) can ingest it directly.
 *
 * Import the singleton `logger` from anywhere — do NOT instantiate
 * a new pino() in feature code.
 */
import pino from "pino";
import { env } from "./env.js";

const isDev = env.NODE_ENV === "development";
const isTest = env.NODE_ENV === "test";

const transport = isDev && !isTest
  ? {
      target: "pino-pretty",
      options: {
        colorize: true,
        translateTime: "SYS:HH:MM:ss.l",
        ignore: "pid,hostname,req,res,responseTime",
        singleLine: false,
      },
    }
  : undefined;

const baseLogger = pino(
  {
    level: isTest ? "silent" : env.LOG_LEVEL,
    base: {
      service: "resume-generator-backend",
      env: env.NODE_ENV,
    },
    timestamp: pino.stdTimeFunctions.isoTime,
    redact: {
      paths: [
        "req.headers.authorization",
        "req.headers.cookie",
        "*.password",
        "*.token",
        "*.apiKey",
        "*.api_key",
      ],
      censor: "[redacted]",
    },
  },
  transport ? pino.transport(transport) : undefined
);

export const logger = baseLogger;
export default logger;
