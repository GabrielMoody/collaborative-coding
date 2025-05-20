const errorHandler = (err, req, res, next) => {
  console.error("Error:", err.message || err);

  return res.status(err.statusCode).json({ errors: err.message || "Internal Server Error" });
}

module.exports = {errorHandler};