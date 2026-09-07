/**
 * Centralized, validated environment configuration.
 *
 * Uses Joi to validate process.env at boot and exposes a frozen
 * `env` object containing only the values the rest of the app is
 * allowed to read. Any other code must go through this module —
 * never read process.env directly anywhere else.
 *
 * If validation fails we fail fast with a clear, formatted error
 * listing every missing / invalid variable. That is much friendlier
 * than letting `undefined` propagate through the rest of the code.
 */
import Joi from "joi";
import { config as loadDotenv } from "dotenv";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Always load from backend/.env regardless of CWD so the server
// behaves the same when launched from the repo root or the backend
// folder.
loadDotenv({ path: path.resolve(__dirname, "../../.env") });

const bool = Joi.boolean().truthy("true", "1", "yes", "on").falsy("false", "0", "no", "off");

const schema = Joi.object({
  NODE_ENV: Joi.string().valid("development", "test", "staging", "production").default("development"),
  PORT: Joi.number().integer().min(1).max(65535).default(5000),
  CORS_ORIGIN: Joi.string().allow("").default("*"),
  TRUST_PROXY: bool.default(false),
  MAX_UPLOAD_BYTES: Joi.number().integer().min(1024).default(10 * 1024 * 1024),

  GROQ_API_KEY: Joi.string().allow("").default(""),
  GROQ_MODEL: Joi.string().default("llama-3.3-70b-versatile"),
  AI_TIMEOUT_MS: Joi.number().integer().min(1000).default(60_000),

  STORAGE: Joi.string().valid("memory", "firebase").default("memory"),
  FIREBASE_PROJECT_ID: Joi.string().allow("").default(""),
  FIREBASE_CLIENT_EMAIL: Joi.string().allow("").default(""),
  FIREBASE_PRIVATE_KEY: Joi.string().allow("").default(""),
  FIREBASE_STORAGE_BUCKET: Joi.string().allow("").default(""),

  AUTH_MODE: Joi.string().valid("off", "optional", "required").default("off"),
  AUTH_DEV_BYPASS_HEADER: Joi.string().allow("").default(""),

  RATE_LIMIT_WINDOW_MS: Joi.number().integer().min(1000).default(60_000),
  RATE_LIMIT_MAX: Joi.number().integer().min(1).default(120),

  LOG_LEVEL: Joi.string()
    .valid("fatal", "error", "warn", "info", "debug", "trace", "silent")
    .default("info"),
})
  .unknown(true) // allow extra env vars without breaking boot
  .required();

const { value, error } = schema.validate(process.env, { abortEarly: false, convert: true });
if (error) {
  const lines = error.details.map((d) => `  • ${d.message} (${d.path.join(".")})`).join("\n");
  // eslint-disable-next-line no-console
  console.error(`\nInvalid environment configuration:\n${lines}\n`);
  process.exit(1);
}

// Normalize a few fields into nicer runtime values.
const corsOrigin = (value.CORS_ORIGIN || "").trim();
value.CORS_ORIGIN = corsOrigin === "*" || corsOrigin === ""
  ? "*"
  : corsOrigin.split(",").map((s) => s.trim()).filter(Boolean);

value.TRUST_PROXY = !!value.TRUST_PROXY;
value.AI_ENABLED = Boolean(value.GROQ_API_KEY && value.GROQ_API_KEY.length > 0);

if (value.STORAGE === "firebase") {
  const required = ["FIREBASE_PROJECT_ID", "FIREBASE_CLIENT_EMAIL", "FIREBASE_PRIVATE_KEY"];
  const missing = required.filter((k) => !value[k]);
  if (missing.length) {
    // eslint-disable-next-line no-console
    console.error(
      `\nSTORAGE=firebase requires the following env vars: ${missing.join(", ")}\n`
    );
    process.exit(1);
  }
}

if (value.AUTH_MODE === "required") {
  value.AUTH_DEV_BYPASS_HEADER = value.AUTH_DEV_BYPASS_HEADER || "";
}

export const env = Object.freeze(value);
export default env;
