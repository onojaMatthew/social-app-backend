const { User } = require("../models/user");
const { Post } = require("../models/post");
const expressJwt = require("express-jwt");
require("dotenv").config();

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res.status(401).json({
      error: "User not allowed to perform this operation. Please sign in."
    });
  }
}

exports.isPoster = (req, res, next) => {
  const isPoster = req.post && req.auth && req.post.postedBy._id == req.auth._id;
  if (!isPoster) {
    return res.status(403).json({
      error: "User is not authorized"
    });
  }

  next();
}