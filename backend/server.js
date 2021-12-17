const app = require("./app");
const dotenv = require("dotenv");
const cron = require("node-cron");

const databaseConnection = require("./config/database");
const { endExpiredBids } = require("./controllers/productController");

dotenv.config({ path: "backend/config/config.env" });

process.on("uncaughtException", (err) => {
  console.log(`error:${err.stack}`);
  console.log("shutting dOWN THE SERVER");
  process.exit(1);
});

databaseConnection();

const server = app.listen(process.env.PORT, () => {
  console.log(
    `the server is running on port ${process.env.PORT} on ${process.env.NODE_ENV}`
  );
});

cron.schedule("15 19 * * *", async function () {
  console.log("Cleaning Expired Products...");
  await endExpiredBids();
});

//handle unhandle promise reJECTION
process.on("unhandledRejection", (err) => {
  console.log(`error :${err.message}`);
  console.log(`shutting down the server due to Unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
