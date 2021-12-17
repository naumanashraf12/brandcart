const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  site: {
    type: Number,
    required: [true, "please enter site"],
  },

  active: {
    type: Boolean,
    required: [true, "please enter the price of the product"],
    default: false,
  },

  rating: {
    type: Number,
    default: 0,
  },
  image: [
    {
      type: String,
    },
  ],
  flow: {
    type: Boolean,
  },

  batch: {
    type: Number,
  },
  dateAuction: {
    type: Date,
    required: [true, "please enter the date"],
    default: Date.now(),
  },
  endBid: {
    type: Number,
  },
  evaluation: {
    type: String,
  },
  maker: {
    type: String,
  },
  name: {
    type: String,
    required: true,
  },
  order: {
    type: Number,
    required: true,
  },
  receiptNumber: {
    type: String,
    required: true,
  },
  referencePrice: {
    type: String,
  },
  shape: {
    type: String,
  },
  startBid: {
    type: Number,
  },
  type: {
    type: String,
  },
  dateAdded: {
    type: String,
  },
  completeEvaluation: {
    type: String,
  },
  youbi: {
    type: Number,
  },
  currentBid: {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
    },
    bid: Number,
  },
});
const productModel = mongoose.model("Product", productSchema);
module.exports = productModel;
