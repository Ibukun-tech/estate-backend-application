const express = require("express");
const morgan = require("morgan");
const app = express();
const rateLimit = require("express-rate-limit");
const reviewRouter = require("./Router/reviewRoute");
const houseRouter = require("./Router/houseRoute");
const userRouter = require("./Router/userRoute");
const helmet = require("helmet");
const { errorHandler } = require("./controller/errorHandlerController");
const ApiError = require("./Utils/ApiErrorClass");
const xss = require("xss-clean");
const hpp = require("hpp");
const mongoSanitize = require("express-mongo-sanitize");
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());
app.use(hpp());
// IMPLEMENTING RATE LIMITING
const limiter = rateLimit({
  max: 200,
  windowMs: 20 * 60 * 100,
  message: "too many request you have to wait for the next 20 minutes",
});
app.use("/api/v1", limiter);
app.use((req, res, next) => {
  console.log(req.params);
  next();
});
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));
app.use("/api/v1/houses", houseRouter);
app.use("/api/v1/newusers", userRouter);
app.use("/api/v1/reviews", reviewRouter);
app.all("*", (req, res, next) => {
  console.log("error");
  next(new ApiError("something is wrong with your internet connection", 400));
});
app.use(errorHandler);
module.exports = app;
