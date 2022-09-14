const mongoose = require("mongoose");
const HouseModel = require("./../Model/houseModel");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config({ path: `${__dirname}/config.env` });
console.log(process.env);
mongoose
  .connect("mongodb://localhost:27017")
  .then(() => {
    console.log("connected");
  })
  .catch((err) => {
    console.log(err);
  });
const houseData = JSON.parse(
  fs.readFileSync(`${__dirname}/houses.json`, "utf8")
);

console.log(process.argv);
(async () => {
  if (process.argv[2] === "--import") {
    await HouseModel.create(houseData);
    console.log("sent to the database");
  }
  if (process.argv[2] === "--delete") {
    await HouseModel.deleteMany({});
    console.log("deleted from the database");
  }
})();
