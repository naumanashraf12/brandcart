module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  // return res.status(err.statusCode).json({
  //   success: false,
  //   message: err.message,
  //   error: err.stack,
  // });
  if (process.env.NODE_ENV === "DEVELOPMENT") {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.stack,
    });
  }
  if (check === "PRODUCTION") {
    const error = { ...err };
    error.message = err.message || "internal server error";
    return res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
  }
};
