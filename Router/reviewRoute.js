const express = require("express");
const {
  editingHouse,
  getAllReview,
  getReview,
  commentReview,
  deleteReview,
} = require("./../controller/reviewController");
const { protect } = require("./../controller/authContoller");
const reviewRouter = express.Router({ mergeParams: true });
reviewRouter.route("/").get(protect, editingHouse("admin"), getAllReview);
reviewRouter.route("/getreviewforeachestate").get(protect, getReview);
reviewRouter.route("/reviews").post(protect, commentReview);
reviewRouter.route("/review/:reviewId").delete(protect, deleteReview);
module.exports = reviewRouter;
