const fs = require("fs");
const express = require("express");
const { protect, editingHouse } = require("./../controller/authController");
const {
  allHouse,
  newHouse,
  updatingHouse,
  deleteHouse,
  getParticularHouse,
  balmOfGilead,
} = require("./../controller/houseController");
const houseRouter = express.Router();
const reviewRouter = require("./reviewRoute");
houseRouter.use("/:houseId", reviewRouter);
houseRouter
  .route("/balm-of-gilead/rating-above-4.5")
  .get(balmOfGilead, allHouse);
houseRouter.route("/").get(allHouse).post(newHouse);
houseRouter
  .route("/:id")
  .get(getParticularHouse)
  .patch(protect, editingHouse("estate admin", "manager"), updatingHouse)
  .delete(deleteHouse);

module.exports = houseRouter;
