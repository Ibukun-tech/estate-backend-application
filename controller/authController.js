const UserModel = require("./../Model/userModel");
const crypto = require("crypto");
const sendEmail = require("./../Utils/email");
const jwt = require("jsonwebtoken");
const ApiError = require("./../Utils/ApiErrorClass");
const { catchAsyncError } = require("./errorHandlerController");
const createSendToken = (code, message, res) => {
  res.cookie("token", message, {
    httpOnly: true,
    secure: true,
    expires: new Date(Date.now() + 900000),
  });
  res.status(code).json({
    status: "success",
    token: message,
  });
};
exports.signUp = catchAsyncError(async (req, res, next) => {
  // CREATING THE USER FIRST
  console.log("sign up");
  const user = await UserModel.create(req.body);
  // CHECKING THE USER FOR THE
  if (!user) {
    return next(new ApiError("you have not yet created your account", 404));
  }
  // CREATING THE TOKEN TO LOGIN
  const token = jwt.sign({ id: user._id }, process.env.PRIVATEKEY, {
    expiresIn: "90 days",
  });
  // SENDIN THE RESPONSE
  createSendToken(202, token, res);
});
exports.logIn = catchAsyncError(async (req, res, next) => {
  // GETTING THE EMAIL AND PASSWORD FROM THE USER
  const { email, password } = req.body;
  // FIND EMAIL IN THE DATABASE
  if (!email || !password) {
    return next(new ApiError("no inputted password or email", 400));
  }
  const user = await UserModel.findOne({ email });
  console.log(user, user.password);
  if (!user || !(await user.checkPassword(password, user.password))) {
    return next(new ApiError("incorrect password or email", 404));
  }
  const token = jwt.sign({ id: user._id }, process.env.PRIVATEKEY, {
    expiresIn: "90 days",
  });
  createSendToken(202, token, res);
});
exports.protect = catchAsyncError(async (req, res, next) => {
  if (
    !req.headers.authorization ||
    !req.headers.authorization.startsWith("bearer")
  ) {
    return next(new ApiError("you are not yet logged in", 403));
  }
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.PRIVATEKEY);
  const user = await UserModel.findOne({ _id: decoded.id });
  console.log(user);
  if (!user) {
    return next(new ApiError("you are not yet in the database", 403));
  }
  const timeStamp = user.changePassword(decoded.iat);
  if (timeStamp) {
    return next(new ApiError("Your password has been changed", 403));
  }
  req.user = user;
  next();
});
// ALLOWING AUTHORISED USER
exports.editingHouse = (...array) => {
  return (req, res, next) => {
    if (!array.includes(req.user.role)) {
      next(new ApiError("you dont have access to this page", 403));
    }
    next();
  };
};
// PASSWORD RESET FUNCTIONALITY
exports.forgetPassword = catchAsyncError(async (req, res, next) => {
  const { email } = req.body;
  const user = await UserModel.findOne({ email: email });
  const resetToken = user.resetTokenForPasswordChange();
  user.save({ validateBeforeSave: false });
  const message = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/newusers/resetPassword/${resetToken}`;
  await sendEmail({
    email: email,
    subject: "TO REST YOUR PASSWORD IN THE NEXT FIVE MINUTES",
    message: message,
  });
  createSendToken(202, "its been sent to your mail successfully", res);
});
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  const checkToken = crypto
    .createHash("sha256")
    .update(req.params.resetToken)
    .digest("hex");
  const user = await UserModel.find({
    passwordResetToken: checkToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    next(new ApiError("time expired", 403));
  }
  user.password = req.body.password;
  user.passwordConfirmed = req.body.passwordConfirmed;
  user.passwordResetToken = undefined;
  user.passwordResetDateExpires = undefined;
  await user.save();
  const token = jwt.sign({ id: user._id }, provess.env.PRIVATEKEY, {
    expiresIn: "90 days",
  });
  createSendToken(200, token, res);
  res.status(200).json({
    status: "success",
    token: token,
  });
});
exports.updateCurrentUser = catchAsyncError(async (req, res, next) => {
  const { password } = req.body;
  if (!password) {
    return next(new ApiError("you have not inputed your password", 400));
  }
  const user = await UserModel.findOne({ _id: req.user._id });
  if (!user) {
    return next(new ApiError("you were not logged in before", 403));
  }

  const correctPassword = user.checkPassword(password, user.password);
  if (!correctPassword) {
    return next(new ApiError("you pressed the wrong password", 400));
  }
  const token = jwt.sign({ id: user._id }, process.env.PRIVATEKEY, {
    expiresIn: "4 days",
  });
  createSendToken(200, token, res);
});
// exports.deleteAccount = catchAsyncError(async (req, res, next) => {});
