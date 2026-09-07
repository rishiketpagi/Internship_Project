/**
 * Authentication middleware.
 *
 *   AUTH_MODE=off        : no auth, req.user is null
 *   AUTH_MODE=optional   : verify if Authorization present, do not fail
 *   AUTH_MODE=required   : require a valid Firebase ID token
 *
 * The middleware is intentionally written so that the rest of the
 * app can treat `req.user` as a real User object (or null) and
 * stay agnostic to how the user was authenticated.
 *
 * A header-based bypass is available for local dev / smoke tests
 * when AUTH_MODE=required. Setting it to anything other than ""
 * in production is a configuration error — startup will warn.
 */
import { auth as firebaseAuth } from "../config/firebaseAdmin.js";
import { env } from "../config/env.js";
import { HttpError, unauthorized } from "../utils/httpError.js";
import { logger } from "../config/logger.js";

if (env.AUTH_MODE === "required" && env.AUTH_DEV_BYPASS_HEADER) {
  logger.warn(
    "AUTH_DEV_BYPASS_HEADER is set while AUTH_MODE=required — never enable this in production."
  );
}

const extractBearer = (req) => {
  const raw = req.headers.authorization || "";
  const [scheme, token] = raw.split(/\s+/);
  if (scheme && scheme.toLowerCase() === "bearer" && token) return token;
  return null;
};

const verifyIdToken = async (token) => {
  if (!firebaseAuth) {
    throw new Error(
      "AUTH_MODE=required but Firebase Admin is not configured. " +
        "Set FIREBASE_* env vars or switch AUTH_MODE=off for local dev."
    );
  }
  return firebaseAuth.verifyIdToken(token, true);
};

const buildReqUser = (decoded) => ({
  uid: decoded.uid,
  email: decoded.email || null,
  emailVerified: decoded.email_verified || false,
  name: decoded.name || null,
  picture: decoded.picture || null,
  providerId: decoded.firebase?.sign_in_provider || null,
  raw: decoded,
});

export const authMiddleware = async (req, res, next) => {
  // Header bypass for local dev / smoke testing.
  if (
    env.AUTH_MODE === "required" &&
    env.AUTH_DEV_BYPASS_HEADER &&
    req.headers["x-dev-bypass"] === env.AUTH_DEV_BYPASS_HEADER
  ) {
    req.user = {
      uid: req.headers["x-dev-uid"] || "dev-user",
      email: req.headers["x-dev-email"] || "dev@local",
      emailVerified: true,
      name: "Dev User",
      providerId: "dev-bypass",
    };
    return next();
  }

  const token = extractBearer(req);

  if (!token) {
    if (env.AUTH_MODE === "off") {
      req.user = null;
      return next();
    }
    if (env.AUTH_MODE === "optional") {
      req.user = null;
      return next();
    }
    return next(unauthorized("Missing Bearer token"));
  }

  try {
    const decoded = await verifyIdToken(token);
    req.user = buildReqUser(decoded);
    next();
  } catch (err) {
    logger.warn({ err: { message: err.message, code: err.code } }, "auth failed");
    next(new HttpError(401, "Invalid or expired authentication token", { code: "UNAUTHORIZED" }));
  }
};

/**
 * Convenience guard: only let the request through if req.user is set.
 * Mount AFTER authMiddleware on protected routes.
 */
export const requireAuth = (req, _res, next) => {
  if (!req.user) return next(unauthorized("Authentication required"));
  next();
};
