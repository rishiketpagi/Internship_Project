// Force a deterministic test environment before the rest of the
// app loads. The .env file (if any) is intentionally ignored.
process.env.NODE_ENV = "test";
process.env.LOG_LEVEL = "silent";
process.env.PORT = "0";
process.env.STORAGE = "memory";
process.env.AUTH_MODE = "off";
process.env.RATE_LIMIT_MAX = "10000";
process.env.CORS_ORIGIN = "*";
