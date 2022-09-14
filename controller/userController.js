const UserModel = require("./../Model/userModel");
const ApiError = require("./../Utils/ApiErrorClass");
const { catchAsyncError } = require("./../controller/errorHandlerController");
exports.deleteAccount = catchAsyncError(async (req, res, next) => {
  const user = await UserModel.findOne({ email: req.user.email });
  user.active = false;

  res.status(204).json({
    status: "success",
    message: "account has been deleted",
  });
});
exports.getUser = catchAsyncError(async (req, res, next) => {
  console.log("validate");
  const user = await UserModel.findById(req.user._id);
  console.log("save");
  if (!user) {
    next(new ApiError("no user", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
});
const filteredObjects = (options, ...array) => {
  console.log(options);
  let filter = {};
  array.map((el) => delete options[el]);
  filter = options;
  console.log(filter);
  return filter;
};
exports.updateData = catchAsyncError(async (req, res, next) => {
  const data = filteredObjects(req.body, "email", "password");
  const user = await UserModel.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    status: "ssuccess",
    data: { user },
  });
});
