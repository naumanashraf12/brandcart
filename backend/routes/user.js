const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  logout,
  forgetPassword,
  setPassword,
  changePassword,
  updateProfile,
} = require("../controllers/authController");
const { isAuth } = require("../middlewares/auth");
router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/logout", logout);
router.post("/password/reset", forgetPassword);
router.post("/password/reset/:token", setPassword);
router.post("/password/change", isAuth, changePassword);
router.post("/profile/update", isAuth, updateProfile);
module.exports = router;
