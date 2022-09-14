const ApiError = require("./../Utils/ApiErrorClass");
exports.catchAsyncError = (fn) => {
  return (req, res, next) => {
    fn(req, res,next).catch(next);
  };
};
const developmentError = (err, res) => {
  res.status(err.statusCode || 500).json({
    status: err.status,
    message: err.message,
    stack: err.stack,
    operational: err.isOperational,
    err: err,
  });
};
const handleCastError = (err, res) => {
  const message = `inavlid ${err.path}:${err.value}`;
  return new ApiError(message, 500);
};
const productionError = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode || 500).json({
      err: err,
      status: err.status,
      message: err.message,
      stack: err.stack,
      operational: err.isOperational,
    });
  }
  if (!err.isOperational) {
    res.status(500).json({
      status: "fail",
      message: "not successful at all",
    });
  }
};
exports.errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV === "development") {
    developmentError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    productionError(err, res);
    let error = { ...err };

    if (error.name === "CastError") {
      error = handleCastError(error, res);
    }
  }
};
