const multer = require("multer");

// Catches errors thrown anywhere in the route handlers (including Multer upload errors)
// and returns a consistent JSON response instead of an HTML stack trace.
function errorHandler(err, req, res, next) {
  console.error(err.message);

  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({ message: "Each photo must be under 2MB" });
    }
    return res.status(400).json({ message: err.message });
  }

  if (err.name === "ValidationError") {
    const messages = Object.values(err.errors).map((e) => e.message);
    return res.status(400).json({ message: messages.join(", ") });
  }

  if (err.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }

  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  res.status(statusCode).json({ message: err.message || "Something went wrong on the server" });
}

module.exports = errorHandler;
