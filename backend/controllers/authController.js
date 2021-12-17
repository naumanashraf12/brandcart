const errorHandler = require("../utils/ErrorHandler");
const User = require("../models/userModel");
const catchAsyncErrors = require("../middlewares/CatchAsyncError");
const setCookie = require("../jwtToken");
const ErrorHandler = require("../utils/ErrorHandler");
const sendEmail = require("../utils/forgetpasswordemail");
const setToken = require("../jwtToken");
const crypto = require("crypto");
const _ = require("lodash");

exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {  email, password} = req.body;

  const user = await User.create({
    email,
    password,
  });
  setCookie(user, res, 200);
});

exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return new errorHandler("the credientional are not provided", 401);
  }
  const user = await User.findOne({ email }).select(`+password`);
  if (!user) {
    return next(new errorHandler("the email or password is envalid", 401));
  }
  const isPasswordMatch = await user.comparePassword(password);

  if (!isPasswordMatch) {
    return next(new errorHandler("the email or password is envalid"), 404);
  }
  setCookie(user, res, 200);
});
exports.logout = catchAsyncErrors(async (req, res, next) => {
  return res
    .cookie("token", null, {
      httpOnly: true,
      expires: new Date(),
    })
    .status(200)
    .json({
      success: true,
      message: "user is logged out",
    });
});
exports.forgetPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select(
    `+password`
  );
  if (!user) {
    return next(new ErrorHandler("the user dont exits in this email"), 400);
  }
  const resetToken = user.forgetPassword();
  if (!token) {
    return next(
      new ErrorHandler("the token is not created internal error", 401)
    );
  }
  user.save({
    validateBeforeSave: false,
  });
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/password/reset/${resetToken}`;
  const message = `Your message reset token is as follow :\n\n${resetUrl}\n\nif you have not requested this email ignore it`;
  try {
    sendEmail({
      email: user.email,
      subject: "the recovery email from Pakshopping",
      message,
    });
    res.status(200).json({
      success: true,
      message: `the email sent to: ${user.email}`,
    });
  } catch (error) {
    user.resetPasswordExpire = undefined;
    user.resetPasswordToken = undefined;
    await user.save({ validateBeforeSave: false });
  }
});
exports.setPassword = catchAsyncErrors(async (req, res, next) => {
  const token = crypto
    .createHash("sha256")
    .update(req.params.token)
    .digest("hex");
  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpire: { $gt: Date.now() },
  });
  if (!user) {
    return next(new errorHandler("wrong token"), 400);
  }
  if (!req.body.password === req.body.confirmPassword) {
    return res.next(new errorHandler("confirmPassword dont match"));
  }
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  setToken(user, res, 200);
});
exports.currentUser = catchAsyncErrors(async (req, res, next) => {
  const user = req.user;
  const result = _.omit(user, "password");
  res.status(200).json({
    success: true,
    result,
  });
});
exports.changePassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findById(req.user._id);
  const check = user.comparePassword(user.password);
  if (!check) {
    res.status(400).json({
      success: false,
      message: "the password dont match",
    });
  }
  user.resetPasswordExpire = undefined;
  user.resetPasswordToken = undefined;
  await user.save();
  setToken(user, res, 200);
});
exports.updateProfile = catchAsyncErrors(async (req, res, next) => {
  const data = {
    name: req.body.name,
    email: req.body.email,
  };
  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    useFindandModify: false,
    runValidators: true,
  });
  return res.status(200).json({
    success: true,
    user,
  });
});
