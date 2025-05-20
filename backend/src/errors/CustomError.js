class CustomError extends Error {
  constructor(message = "Internal server error", statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}

module.exports = CustomError;