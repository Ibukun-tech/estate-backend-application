const { Console } = require("console");
const fs = require("fs");
const HouseModel = require("./../Model/houseModel");
const { catchAsyncError } = require("./errorHandlerController");
// console.log(allEstateHouse);
const ApiError = require("./../Utils/ApiErrorClass");
exports.balmOfGilead = (req, res, next) => {
  req.query = { street: "Balm of gilead", ratingAverage: { $gte: 4.5 } };
  next();
};
exports.allHouse = catchAsyncError(async (req, res, next) => {
  // console.log(req);

  let query = HouseModel.find();
  const filteredQuery = { ...req.query };
  const fields = ["page", "sort", "limit", "fields"];
  fields.forEach((el) => {
    delete filteredQuery[el];
  });
  query = query.find(filteredQuery);
  if (req.query.sort) {
    const sortRequest = req.query.sort.split(",").join(" ");
    query = query.sort(sortRequest);
  }
  if (req.query.fields) {
    const fieldRequest = req.query.split(",").join(" ");
    query = query.sort(fieldRequest);
  }
  query = await query;
  if (!query) {
    next(
      new ApiError("something went wrong with the internet connection", 400)
    );
  }
  res.status(200).json({
    status: "success",
    length: query.length,
    data: {
      query,
    },
  });
});
exports.newHouse = catchAsyncError(async (req, res, next) => {
  const sendNewHouseToDatabase = await HouseModel.create(req.body);
  if (!sendNewHouseToDatabase) {
    next(
      new ApiError("something went wrong with the internet connection", 400)
    );
  }
  res.status(200).json({
    status: "success",
    data: {
      sendNewHouseToDatabase,
    },
  });
});
exports.getParticularHouse = catchAsyncError(async (req, res, next) => {
  // console.log();
  const getHouseData = await HouseModel.findById(req.params.id).populate({
    path: "review",
  });
  if (!getHouseData) {
    next(
      new ApiError("something went wrong with the interenet connection", 400)
    );
  }
  // console.log(house);

  res.status(200).json({
    status: "success",
    data: {
      getHouseData,
    },
  });
});
exports.updatingHouse = catchAsyncError(async (req, res, next) => {
  const data = await HouseModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!data) {
    next(new ApiError("INTERNAL SERVER ERROR", 400));
  }
  res.status(200).json({
    status: "success",
    data: {
      data,
    },
  });
});
exports.deleteHouse = catchAsyncError(async (req, res, next) => {
  await HouseModel.deleteOne({ _id: req.params.id });
  res.status(204).json({
    status: "succes",
    data: null,
  });
});
