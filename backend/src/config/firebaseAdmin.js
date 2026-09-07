/**
 * Lazy Firebase Admin SDK initializer.
 *
 * - Imports firebase-admin ONLY when STORAGE=firebase or
 *   AUTH_MODE != "off" (otherwise we don't need it).
 * - Initializes the app exactly once and exposes named services
 *   (`auth`, `db`, `storage`).
 * - Never throws at import time: if initialization fails, the
 *   error is recorded and subsequent `auth`/`db` access is
 *   `null`, which auth.js / repositories handle gracefully.
 */
import { env } from "./env.js";
import { logger } from "./logger.js";

let _admin = null;
let _auth = null;
let _db = null;
let _storage = null;
let _initialized = false;

const shouldInitialize =
  env.STORAGE === "firebase" || env.AUTH_MODE === "optional" || env.AUTH_MODE === "required";

if (shouldInitialize) {
  try {
    const admin = (await import("firebase-admin")).default;

    if (!admin.apps.length) {
      admin.initializeApp({
        credential: admin.credential.cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          // Env-provided private keys have escaped newlines (\n) that
          // need to be expanded back to real line breaks for crypto.
          privateKey: (env.FIREBASE_PRIVATE_KEY || "").replace(/\\n/g, "\n"),
        }),
        storageBucket: env.FIREBASE_STORAGE_BUCKET || undefined,
      });
    }

    _admin = admin;
    _auth = admin.auth();
    _db = admin.firestore();
    _storage = env.FIREBASE_STORAGE_BUCKET ? admin.storage().bucket() : null;
    _initialized = true;

    logger.info(
      {
        projectId: env.FIREBASE_PROJECT_ID,
        storageBucket: env.FIREBASE_STORAGE_BUCKET || null,
        storageBackend: env.STORAGE,
      },
      "firebase admin initialized"
    );
  } catch (err) {
    logger.error({ err: { message: err.message } }, "firebase admin failed to initialize");
  }
}

export const admin = _admin;
export const auth = _auth;
export const db = _db;
export const storage = _storage;
export const firebaseReady = _initialized;

export const assertFirebase = () => {
  if (!_initialized) {
    throw new Error("Firebase Admin SDK is not configured. Set STORAGE=firebase and FIREBASE_* env vars.");
  }
};
