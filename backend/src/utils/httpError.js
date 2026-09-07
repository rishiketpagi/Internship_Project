/**
 * Typed application error.
 *
 * Throw an HttpError anywhere in the codebase to signal a
 * known business / request failure (validation, not-found,
 * unauthorized, etc). The error middleware turns it into a
 * proper JSON response with the matching HTTP status.
 */
export class HttpError extends Error {
  /**
   * @param {number} status  HTTP status code (e.g. 400, 404, 500)
   * @param {string} message Human-readable message
   * @param {object} [opts]
   * @param {string} [opts.code]     Stable error code (UPPER_SNAKE)
   * @param {object} [opts.details]  Structured details (validation issues, etc.)
   * @param {boolean} [opts.expose]  Whether to send `details` to the client
   */
  constructor(status, message, { code, details, expose } = {}) {
    super(message);
    this.name = "HttpError";
    this.status = status;
    this.code = code || defaultCodeForStatus(status);
    this.details = details;
    this.expose = expose !== false && status < 500;
  }
}

export const defaultCodeForStatus = (status) => {
  switch (status) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    case 413:
      return "PAYLOAD_TOO_LARGE";
    case 415:
      return "UNSUPPORTED_MEDIA_TYPE";
    case 422:
      return "UNPROCESSABLE_ENTITY";
    case 429:
      return "TOO_MANY_REQUESTS";
    case 500:
      return "INTERNAL_SERVER_ERROR";
    case 502:
      return "BAD_GATEWAY";
    case 503:
      return "SERVICE_UNAVAILABLE";
    case 504:
      return "GATEWAY_TIMEOUT";
    default:
      return status >= 500 ? "INTERNAL_SERVER_ERROR" : "ERROR";
  }
};

/**
 * Asserts a condition; throws an HttpError(400) when false.
 * Useful inside service code to keep the happy path readable.
 */
export const assert = (condition, message, opts) => {
  if (!condition) {
    throw new HttpError(400, message, opts);
  }
};

export const notFound = (resource = "Resource") =>
  new HttpError(404, `${resource} not found`, { code: "NOT_FOUND" });

export const unauthorized = (message = "Authentication required") =>
  new HttpError(401, message, { code: "UNAUTHORIZED" });

export const forbidden = (message = "You do not have permission to perform this action") =>
  new HttpError(403, message, { code: "FORBIDDEN" });

export const badRequest = (message, details) =>
  new HttpError(400, message, { code: "BAD_REQUEST", details });

export const conflict = (message, details) =>
  new HttpError(409, message, { code: "CONFLICT", details });
