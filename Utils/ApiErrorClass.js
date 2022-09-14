class ApiError extends Error {
  constructor(message, statusCode) {
    super(message);
    console.log("working from APICLASS");

    this.isOperational = true;

    this.message = message;
    console.log(this.message);
    this.statusCode = statusCode;
    this.status = String(statusCode).startsWith("4")
      ? "fail"
      : "failed woefully";
    Error.captureStackTrace(this, this.constructor);
  }
}
module.exports = ApiError;
