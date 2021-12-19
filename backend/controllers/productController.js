const Product = require("../models/productModel");
const User = require("../models/userModel");
const ErrorHandler = require("../utils/ErrorHandler");
const catchPromise = require("../middlewares/CatchAsyncError");
const QuerySearch = require("../utils/apiFeatures");

exports.getProducts = catchPromise(async (req, res, next) => {
  const resperpage = 25;
  const size = 25;
  const productsCount = await Product.countDocuments();

  let querySearch = new QuerySearch(Product, req.query)
    .search()
    .filterLive()
    .pagination(resperpage);

  const page = parseInt(req.query.page) || 1;

  let items = await querySearch.query;
  let pages = 1;
  if (!page === 1) {
    pages = productsCount / 25;
  }

  const total = {
    items: productsCount,
    pages,
  };
  let prev = false;
  if (page > 1) {
    prev = `http://brandcart.herokuapp.com/api/items/search?page=${
      page - 1
    }&size=25`;
  }
  const pagination = {
    next: `http://brandcart.herokuapp.com/api/items/search?page=${
      page + 1
    }&size=25`,
    prev,
  };

  return res.status(200).json({
    success: true,
    page,
    size,
    total,
    pagination,
    items,
  });
});

exports.Products = catchPromise(async (req, res, next) => {
  const { items } = req.body;

  let products = [];
  for (let index = 0; index < items.length; index++) {
    const element = items[index];
    const prod = await Product.findById(element._id);

    if (prod) {
      products.push(await Product.findByIdAndUpdate(element._id, element));
      continue;
    }

    products.push(await Product.create(element));
  }

  res.status(200).json({
    success: true,
  });
});

exports.bid = catchPromise(async (req, res, next) => {
  const { bid } = req.body;

  if (!bid || isNaN(bid))
    return next(new ErrorHandler("Please enter bid as number", 400));

  const product = await Product.findById(req.params.id);

  if (!product) return next(new ErrorHandler("Product does not exist", 404));

  const { startBid, currentBid, active } = product;

  if (!active)
    return next(new ErrorHandler("Product has been sold already", 404));

  if (bid < startBid || bid < currentBid.bid)
    return next(
      new ErrorHandler(
        `The current bid is ${
          currentBid.bid > startBid ? currentBid.bid : startBid
        }`,
        400
      )
    );

  product.currentBid = { user: req.user.id, bid };

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ product });
});

exports.endExpiredBids = catchPromise(async (req, res, next) => {
  let querySearch = new QuerySearch(Product, req.query).filterExpired();

  const products = await querySearch.query;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];

    if (!product.currentBid.bid) {
      product.dateAuction.setDate(product.dateAuction.getDate() + 1);
      await product.save({ validateBeforeSave: false });
      continue;
    }

    product.active = false;
    product.endBid = product.currentBid.bid;

    await User.updateOne(
      { _id: product.currentBid.user },
      { $push: { products: product._id } }
    );
    await product.save({ validateBeforeSave: false });
  }

  return res.status(200).json({
    success: true,
    results: products.length,
    products,
  });
});
