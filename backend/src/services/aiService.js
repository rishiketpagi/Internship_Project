/**
 * AI service.
 *
 * Single point of contact for every LLM call in the system.
 *
 *   - If GROQ_API_KEY is set, all calls go to Groq.
 *   - Otherwise the service degrades to a deterministic, regex
 *     and heuristic-based fallback so the rest of the app keeps
 *     working for local dev, smoke tests, and CI.
 *
 * The fallback is intentionally NOT smart. It's there so the
 * "happy path" still works without a key. Anything that needs
 * a real answer requires a real key.
 *
 * Every call returns a parsed JS object (or throws). We never
 * leak a raw LLM string back to controllers.
 */
import Groq from "groq-sdk";
import { env } from "../config/env.js";
import { logger } from "../config/logger.js";
import { HttpError } from "../utils/httpError.js";

let _groq = null;
const getClient = () => {
  if (!env.AI_ENABLED) return null;
  if (!_groq) {
    _groq = new Groq({ apiKey: env.GROQ_API_KEY });
  }
  return _groq;
};

/**
 * Internal: run a Groq chat completion with a hard timeout and
 * automatic JSON extraction. Throws on timeout / non-JSON.
 */
const runGroq = async ({ system, user, temperature = 0, model }) => {
  const client = getClient();
  if (!client) {
    throw new HttpError(503, "AI is not configured (set GROQ_API_KEY).", {
      code: "AI_DISABLED",
    });
  }

  const start = Date.now();
  const completion = await Promise.race([
    client.chat.completions.create({
      model: model || env.GROQ_MODEL,
      temperature,
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: { type: "json_object" },
    }),
    new Promise((_, reject) =>
      setTimeout(
        () => reject(new HttpError(504, "AI request timed out", { code: "AI_TIMEOUT" })),
        env.AI_TIMEOUT_MS
      )
    ),
  ]);

  const text = completion?.choices?.[0]?.message?.content || "";
  logger.debug(
    { durationMs: Date.now() - start, model: model || env.GROQ_MODEL, bytes: text.length },
    "groq completion"
  );

  return extractJson(text);
};

/**
 * Extract a JSON object from a model response. Tolerates:
 *   - leading/trailing prose
 *   - ```json ... ``` fences
 *   - the whole response being pure JSON
 */
export const extractJson = (text) => {
  if (!text) {
    throw new HttpError(502, "AI returned an empty response", { code: "AI_EMPTY" });
  }
  const trimmed = text.trim();
  // Pure JSON fast path
  if (trimmed.startsWith("{")) {
    try {
      return JSON.parse(trimmed);
    } catch {
      // fall through
    }
  }
  // Strip code fences
  const fenced = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced) {
    try {
      return JSON.parse(fenced[1].trim());
    } catch {
      // fall through
    }
  }
  // Find the first {...} block
  const start = trimmed.indexOf("{");
  const end = trimmed.lastIndexOf("}");
  if (start >= 0 && end > start) {
    try {
      return JSON.parse(trimmed.slice(start, end + 1));
    } catch {
      // fall through
    }
  }
  throw new HttpError(502, "AI response was not valid JSON", {
    code: "AI_INVALID_JSON",
    details: { sample: trimmed.slice(0, 200) },
  });
};

/**
 * High-level helper. If AI is enabled, runs the real call;
 * otherwise invokes the provided fallback synchronously.
 *
 *   const data = await aiOrFallback({
 *     system, user,
 *     fallback: () => ({ ...deterministic... }),
 *   });
 */
export const aiOrFallback = async ({ system, user, temperature, model, fallback }) => {
  if (env.AI_ENABLED) {
    try {
      return await runGroq({ system, user, temperature, model });
    } catch (err) {
      logger.error({ err: { message: err.message, code: err.code } }, "groq call failed");
      if (fallback) {
        logger.warn("falling back to deterministic output");
        return fallback();
      }
      throw err;
    }
  }
  if (fallback) return fallback();
  throw new HttpError(503, "AI is not configured and no fallback is available.", {
    code: "AI_DISABLED",
  });
};

export const aiService = {
  isEnabled: () => env.AI_ENABLED,
  runGroq,
  extractJson,
  aiOrFallback,
};

export default aiService;
