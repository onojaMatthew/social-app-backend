const express = require("express");
const morgan = require("morgan");
const database = require("./models/database");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const validator = require("express-validator");
require("dotenv").config();

// Instantiate express
const app = express();

//database
database();

// middleware
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(validator());
app.use(cors());

// Routes
require("./middleware/routes")(app);
app.use((err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    res.status(401).json({
      error: "Unauthorized!"
    })
  }
})


const port = process.env.PORT || 8080;

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});