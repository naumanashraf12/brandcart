const express = require("express");
const router = express.Router();

const {
  Products,
  getProducts,
  bid,
  endExpiredBids,
} = require("../controllers/productController");

const { isAuth } = require("../middlewares/auth");

router.route("/products").get(getProducts).post(Products);
router.route("/products/expired").get(endExpiredBids);
router.route("/products/:id").patch(isAuth, bid);

module.exports = router;
