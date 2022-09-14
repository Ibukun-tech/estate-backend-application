const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const validator = require("validator");
const crypto = require("crypto");
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    validate: validator.isEmail,
    unique: true,
  },
  roles: {
    type: String,
    enum: ["user", "admin", "manager"],
    default: "user",
  },
  password: {
    type: String,
  },
  passwordConfirm: {
    type: String,
    validate: [
      function (val) {
        return this.password === val;
      },
    ],
  },
  active: { type: Boolean, default: true },
  passwordChangedTime: Date,
  passwordResetToken: String,
  passwordResetDateExpires: Date,
});
userSchema.pre(/^find/, function () {
  this.find({ active: { $ne: false } });
});
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) next();
  this.password = await bcrypt.hash(this.password, 12);
  console.log(this.password);
  // this.passwordChangedTime = Date.now() + 1000;
  this.passwordConfirm = undefined;
  next();
});
userSchema.pre("save", function (next) {
  console.log("new stuff");
  if (!this.isModified("password") || this.isNew) return next();

  this.passwordChangedTime = Date.now() - 1000;
  next();
});
userSchema.methods.checkPassword = async function (password, passwordDatabase) {
  return await bcrypt.compare(password, passwordDatabase);
};
userSchema.methods.changePassword = function (jwtTime) {
  if (this.passwordChangedTime) {
    const passwordTime = parseInt(
      this.passwordChangedTime.getTime() / 1000,
      10
    );
    console.log(jwtTime, passwordTime);
    return jwtTime < passwordTime;
  }
  return false;
};
userSchema.methods.resetTokenForPasswordChange = function () {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  this.passwordResetDateExpires = Date.now() + 5 * 60 * 1000;
  return resetToken;
};
const UserModel = new mongoose.model("UserModel", userSchema);
module.exports = UserModel;

// validate: {
//   validate: function (val) {
//     return this.password === val;
//   },
