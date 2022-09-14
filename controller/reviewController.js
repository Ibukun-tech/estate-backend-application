const { catchAsyncError } = require("./errorHandlerController");
const ApiError = require("./../Utils/ApiErrorClass");
const ReviewModel = require("./../Model/reviewModel");
// const HouseModel = require("./../Model/houseModel");
exports.getAllReview = catchAsyncError(async (req, res, next) => {
  const allReview = await ReviewModel.find();
  res.status(200).json({
    status: "success",
    length: allReview.length,
    data: { allReview },
  });
});
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  await ReviewModel.deleteOne({ id: req.params._id });
  res.status(204).json({
    status: "success",
    data: null,
  });
});
exports.getReview = catchAsyncError(async (req, res, next) => {
  console.log("getting review", req.params.houseId);
  let filter = {};
  if (req.params.houseId) filter = { house: req.params.houseId };
  const reviewData = await ReviewModel.find(filter);
  console.log("sitting here");
  if (!reviewData) {
    next(new ApiError("nothing for review", 404));
  }
  res.status(200).json({
    status: "succes",
    data: {
      reviewData,
    },
  });
});
exports.updateReview = catchAsyncError(async (req, res, next) => {
  const data = ReviewModel.findOneAndUpdate(
    { house: req.params.houseId },
    req.body
  );
  res.status(200).json({
    status: "success",
    data: { data },
  });
});
exports.commentReview = catchAsyncError(async (req, res, next) => {
  if (!req.body.house) req.body.house = req.params.houseId;
  if (!req.body.user) req.body.user = req.user._id;
  const dataReview = await ReviewModel.create(req.body);
  res.status(200).json({
    status: "success",
    data: { dataReview },
  });
});
exports.deleteReview = catchAsyncError(async (req, res, next) => {
  await ReviewModel.deleteOne({
    _id: req.params.reviewId,
  });
  res.status(204).json({ status: "success", data: null });
});
