const express = require("express");
const { getUser, updateData } = require("./../controller/userController");
const {
  signUp,
  logIn,
  protect,
  forgetPassword,
  // updateData,
  resetPassword,
} = require("./../controller/authController");
const userRouter = express.Router();
userRouter.use("/getMe", protect, getUser);
userRouter.route("/signup").post(signUp);
userRouter.route("/login").post(logIn);
userRouter.route("/forgetpassword").post(forgetPassword);
userRouter.route("/resetpassword/:resetToken").post(resetPassword);
userRouter.route("/updatedata").post(protect, updateData);
// userRouter.route("/protect").post(protect);
userRouter.route("/:id");
module.exports = userRouter;
