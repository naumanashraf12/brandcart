const express = require("express");
const router = express.Router();

const {
  Products,
  getProducts,
  bid,
  endExpiredBids,
} = require("../controllers/productController");

const { isAuth } = require("../middlewares/auth");

router.route("/items/search").get(getProducts);
router.route("/items").post(Products);
router.route("/items/expired").get(endExpiredBids);
router.route("/items/:id").patch(isAuth, bid);

module.exports = router;
