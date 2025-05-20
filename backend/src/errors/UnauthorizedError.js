const CustomError = require('./CustomError');

class UnauthorizedError extends CustomError {
  constructor(message = 'Unauthorized access') {
    super(message, 401);
  }
}

module.exports = UnauthorizedError;