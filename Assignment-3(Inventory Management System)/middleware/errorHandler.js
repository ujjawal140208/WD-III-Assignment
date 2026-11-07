function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === 11000) {
    return res.status(409).json({
      message: "A product with this SKU already exists",
      field: Object.keys(error.keyValue || {})[0] || "sku"
    });
  }

  if (error.name === "ValidationError") {
    const errors = Object.values(error.errors).map((item) => item.message);
    return res.status(400).json({ message: "Validation failed", errors });
  }

  if (error.name === "CastError") {
    return res.status(400).json({ message: "Invalid value supplied" });
  }

  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: statusCode === 500 ? "Internal server error" : error.message
  });
}

module.exports = errorHandler;
