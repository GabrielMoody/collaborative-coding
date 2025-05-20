const CustomError = require("./CustomError");

class NotFoundError extends CustomError {
  constructor(message = "Resource not found") {
    super(message, 404);
  }
}

module.exports = NotFoundError;