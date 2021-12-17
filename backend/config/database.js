const mongoose = require("mongoose");

const databaseConnection = () => {
  mongoose
    .connect(process.env.CLUSTER_DB, {
      useNewURLParser: true,
      useUnifiedTopology: true,
    })
    .then((con) => {
      console.log(`the database connent with host ${con.connection.host} `);
    })
    .catch((err) => {
      console.log(err);
    });
};
module.exports = databaseConnection;
