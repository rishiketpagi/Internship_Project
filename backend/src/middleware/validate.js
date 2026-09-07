/**
 * Joi-based request validation middleware.
 *
 * Use:
 *   router.post("/foo", validate({ body: schema }), handler)
 *
 * Supports validating body, query, params, and headers.
 * On failure it throws an HttpError(400) carrying the
 * `details` array so the client gets a structured list of
 * which fields are wrong.
 */
import { HttpError } from "../utils/httpError.js";

const pick = (req, part) => {
  if (part === "body") return req.body ?? {};
  if (part === "query") return req.query ?? {};
  if (part === "params") return req.params ?? {};
  if (part === "headers") return req.headers ?? {};
  throw new HttpError(500, `validate(): unknown part '${part}'`);
};

export const validate = (schemas) => (req, res, next) => {
  try {
    for (const part of ["body", "query", "params", "headers"]) {
      const schema = schemas[part];
      if (!schema) continue;
      const { value, error } = schema.validate(pick(req, part), {
        abortEarly: false,
        stripUnknown: part !== "headers",
        convert: true,
      });
      if (error) {
        const details = error.details.map((d) => ({
          part,
          path: d.path.join("."),
          message: d.message,
          type: d.type,
        }));
        throw new HttpError(400, "Request validation failed", {
          code: "VALIDATION_ERROR",
          details,
          expose: true,
        });
      }
      // Replace the validated/coerced value back on the request.
      if (part === "body") req.body = value;
      else if (part === "query") req.validatedQuery = value;
      else if (part === "params") req.params = value;
    }
    next();
  } catch (err) {
    next(err);
  }
};
