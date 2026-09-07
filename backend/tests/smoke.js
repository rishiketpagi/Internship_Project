/**
 * Out-of-band smoke test. Boots the app on a random port and
 * hits a couple of endpoints to verify the wiring. Useful in
 * CI after a deployment.
 *
 *   node tests/smoke.js
 */
import { buildApp } from "../src/app.js";

const start = async () => {
  process.env.NODE_ENV = process.env.NODE_ENV || "production";
  process.env.PORT = process.env.PORT || "0";
  process.env.STORAGE = process.env.STORAGE || "memory";
  process.env.AUTH_MODE = process.env.AUTH_MODE || "off";
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || "warn";

  const app = buildApp();
  const server = app.listen(process.env.PORT);
  await new Promise((r) => server.on("listening", r));
  const port = server.address().port;
  const base = `http://127.0.0.1:${port}`;

  const hits = [
    { method: "GET", path: "/health", expect: 200 },
    { method: "GET", path: "/openapi.json", expect: 200 },
    { method: "GET", path: "/", expect: 200 },
    { method: "GET", path: "/nope", expect: 404 },
    {
      method: "POST",
      path: "/api/extract/text",
      body: { text: "John Doe\nemail: john@example.com\n\nSKILLS\nJavaScript, Node.js" },
      expect: 200,
    },
  ];

  let failed = 0;
  for (const h of hits) {
    const res = await fetch(`${base}${h.path}`, {
      method: h.method,
      headers: { "Content-Type": "application/json" },
      body: h.body ? JSON.stringify(h.body) : undefined,
    });
    const ok = res.status === h.expect;
    if (!ok) failed += 1;
    // eslint-disable-next-line no-console
    console.log(`${ok ? "✓" : "✗"} ${h.method} ${h.path} → ${res.status} (expected ${h.expect})`);
  }

  server.close();
  if (failed > 0) {
    // eslint-disable-next-line no-console
    console.error(`\n${failed} check(s) failed`);
    process.exit(1);
  }
  // eslint-disable-next-line no-console
  console.log("\nAll smoke checks passed.");
};

start().catch((err) => {
  // eslint-disable-next-line no-console
  console.error("smoke test failed:", err);
  process.exit(1);
});
