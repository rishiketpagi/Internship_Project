/**
 * Jest configuration for the backend.
 *
 * Tests run in ESM mode (Node 20+ supports it natively for
 * imports), against the in-memory storage backend and the AI
 * fallback path — no external services required.
 */
export default {
  testEnvironment: "node",
  testMatch: ["<rootDir>/tests/**/*.test.js"],
  transform: {},
  moduleFileExtensions: ["js", "mjs"],
  setupFiles: ["<rootDir>/tests/setupEnv.js"],
  testTimeout: 15_000,
  verbose: true,
};
