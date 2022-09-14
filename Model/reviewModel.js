const mongoose = require("mongoose");
const HouseModel = require("./houseModel");
const reviewSchema = new mongoose.Schema({
  comments: {
    type: String,
  },
  rating: {
    type: Number,
    max: 5,
    min: 1,
  },
  user: [{ type: mongoose.Schema.ObjectId, ref: "UserModel" }],
  house: [{ type: mongoose.Schema.ObjectId, ref: "HouseModel" }],
});
reviewSchema.statics.calcAverage = async function (houseId) {
  const data = await this.aggregate([
    {
      $match: { house: houseId },
    },
    {
      $group: {
        _id: "$house",
        nRating: { $sum: 1 },
        avgRating: { $avg: "$rating" },
      },
    },
  ]);
  console.log(data);
  if (data.length > 1) {
    await HouseModel.findByIdAndUpdate(houseId, {
      ratingAverage: Math.trunc(data[0].avgRating),
    });
  } else {
    await HouseModel.findByIdAndUpdate(houseId, {
      ratingAverage: 3.5,
    });
  }
};
reviewSchema.pre(/^findOneAnd/, async function (next) {
  this.r = await this.findOne();
  console.log(this.r);
  next();
});
reviewSchema.post(/^findOneAnd/, async function () {
  await this.r.constructor.calcAverage(this.r.house);
});
reviewSchema.index({ house: 1, user: 1 }, { unique: true });
reviewSchema.post("save", async function () {
  this.constructor.calcAverage(this.house);
});
reviewSchema.pre(/^find/, function (next) {
  this.populate({
    path: "user",
    ref: "UserModel",
    select: "-v, -_id, -password",
  });
  next();
});
const ReviewModel = new mongoose.model("ReviewModel", reviewSchema);
module.exports = ReviewModel;
