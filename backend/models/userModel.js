const mongoose = require("mongoose");
const validator = require("validator");
const bycrpt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: [true, "please enter your email"],
    unique: true,
    validate: [validator.isEmail, "please enter correct email address"],
  },
  password: {
    type: String,
    required: [true, "please enter your password"],
    minlength: [6, "password cant not be lesser than 6"],
    select: true,
  },
  role: {
    type: String,
    default: "user",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  resetPasswordToken: String,
  resetPasswordExpire: Date,
  products: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Product",
    },
  ],
});
userSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_TIME,
  });
};
userSchema.methods.comparePassword = async function (enterdPassword) {
  return await bycrpt.compare(enterdPassword, this.password);
};
userSchema.methods.forgetPassword = function () {
  token = crypto.randomBytes(20).toString("hex");
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");
  this.resetPasswordExpire = Date.now() + 30 * 60 * 1000;
  return token;
};
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }
  this.password = await bycrpt.hash(this.password, 10);
});

const userModel = mongoose.model("User", userSchema);
module.exports = userModel;
