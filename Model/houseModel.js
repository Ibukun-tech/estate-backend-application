const mongoose = require("mongoose");
// const UserModel = require("./userModel");
const houseSchema = new mongoose.Schema(
  {
    street: {
      type: String,
      required: [true, "The street of the house is required "],
      enum: ["Rose of sharon", "Balm of gilead", "lily of sharon"],
    },
    rooms: {
      type: Number,
      min: [1, "it must be in a minimum of 1 room"],
      max: [3, "i must be a maximum of 3 rooms"],
    },
    ratingAverage: {
      type: Number,
      max: [5, "we want a maximum of 1 rating"],
    },
    comment: {
      type: String,
      required: [true, "Comment is required for our rooms"],
    },
    description: {
      type: String,
      required: [true, "Description of the room is required"],
    },
    maxNoOfPeople: Number,
    price: Number,
    ratingsQuantity: { type: Number, max: [100, "A maximum rating of 5"] },
    // locations: {
    //   type: {
    //     type: String,
    //     enum: ["Point"],
    //     required: true,
    //   },
    //   coordinates: {
    //     type: Number,
    //     required: true,
    //   },
    // },
    adminUser: [{ type: mongoose.Schema.ObjectId, ref: "UserModel" }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
houseSchema.virtual("review", {
  ref: "ReviewModel",
  foreignField: "house",
  localField: "_id",
});
houseSchema.pre(/^find/, function (next) {
  this.populate({
    path: "adminUser",
    select: " -v -password -active",
  });
  next();
});
const HouseModel = new mongoose.model("HouseModel", houseSchema);

module.exports = HouseModel;
