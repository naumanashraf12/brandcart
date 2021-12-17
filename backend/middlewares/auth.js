const ErrorHandler = require("../utils/ErrorHandler");
const CatchAsyncError = require("./CatchAsyncError");
const jwt = require("jsonwebtoken");
const userModel = require("../models/userModel");

exports.isAuth = CatchAsyncError(async (req, res, next) => {
  const { token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("the token is not provided", 401));
  }
  const id = await jwt.verify(token, process.env.JWT_SECRET);
  if (!id) {
    return next(new ErrorHandler("the token is not valid", 401));
  }
  const data = await userModel.findById(id.id);

  req.user = data;
  next();
});
exports.authorization = CatchAsyncError(async (req, res, next) => {
  console.log("in auth");
  const { role } = req.user;
  if (role === "user") {
    return next(new ErrorHandler("the user is not admin ", 401));
  }
  next();
});
