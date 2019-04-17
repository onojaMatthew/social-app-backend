const mongoose = require("mongoose");
require("dotenv").config();

module.exports = () => {
  mongoose.Promise = global.Promise;
  mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true })
    .then(() => console.log("Connection to database esterblished"))
    .catch(err => console.log(err.message));
}