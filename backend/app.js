const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const middlewareError = require("./middlewares/error");
const product = require("./routes/product");
const user = require("./routes/user");
const bodyParser = require("body-parser");
const morgan = require("morgan");
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use(middlewareError);

module.exports = app;
