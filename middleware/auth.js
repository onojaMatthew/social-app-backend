const { User } = require("../models/user");
const { Post } = require("../models/post");
const expressJwt = require("express-jwt");
require("dotenv").config();

exports.requireSignin = expressJwt({
  secret: process.env.JWT_SECRET,
  userProperty: "auth"
});

exports.userById = (req, res, next, id) => {
  User.findById(id).exec((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: "User not found"
      });
    }

    req.profile = user;
    next();
  });
}

exports.hasAuthorization = (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id === req.auth._id;
  if (!authorized) {
    return res.status(401).json({
      error: "User not allowed to perform this operation. Please sign in."
    });
  }
}

exports.postById = (req, res, next, id) => {
  Post.find(id)
    .populate("postedBy", "_id name")
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).json({
          error: err
        });
      }
      req.post = post;
      next();
    });
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