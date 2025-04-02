export class ApiError extends Error {
  constructor(message, code = "UNKNOWN", status = 500) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }

  static fromResponse(res, data) {
    return new ApiError(
      data?.error || res.statusText || "API request failed",
      data?.code || res.statusText,
      res.status
    );
  }
}