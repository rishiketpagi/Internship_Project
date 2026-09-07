/**
 * Auth-related controller.
 *
 * Right now we just return the decoded user. In the future
 * this is where sign-in/sign-up/onboarding endpoints would
 * live (the frontend is expected to talk to Firebase directly
 * for those, which is the standard pattern).
 */
import asyncHandler from "../utils/asyncHandler.js";
import { ok } from "../utils/response.js";
import { env } from "../config/env.js";

export const me = asyncHandler(async (req, res) => {
  ok(res, {
    user: req.user || null,
    auth: {
      mode: env.AUTH_MODE,
      required: env.AUTH_MODE === "required",
    },
  });
});
