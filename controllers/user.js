const _ = require("lodash");
const { User } = require("../models/user");
const fs = require("fs");
const formidable = require("formidable");

exports.allUser = (req, res, next) => {
  User.find((err, user) => {
    if (err || !user) {
      return res.status(400).json({
        error: ""
      });
    }

    res.json(user);
  }).select("name email created updated");
};

exports.getUser = (req, res, next) => {
  req.profile.hashed_password = undefined;
  req.profile.salt = undefined;
  return res.status(200).json(req.profile);
}

exports.userById = (req, res, next, id) => {
  User.findById(id)
    .populate("following", "_id name")
    .populate("followers", "_id name")
    .exec((err, user) => {
      if (err || !user) {
        return res.status(400).json({
          error: "User not found"
        });
      }

    req.profile = user;
    next();
  });
}

exports.userPhoto = (req, res, next) => {
  if (req.profile.photo.data) {
    res.set("Content-Type", req.profile.photo.contentType);
    return res.send(req.profile.photo.data);
  }
  next();
}

exports.updateUser = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json(400).json({
        error: "Failed to upload photo"
      });
    }
    
    let user = req.profile;
    user = _.extend(user, fields);
    user.updated = Date.now();

    if (files.photo) {
      user.photo.data = fs.readFileSync(files.photo.path);
      user.photo.contentType = files.photo.type;
    }
    user.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      user.hashed_password = undefined;
      user.salt = undefined;
      res.json(user);
    });
  });
}

exports.deleteUser = (req, res, next) => {
  let user = req.profile;
  user.remove((err, user) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
  
    res.json({
      message: "User deleted successfully"
    });
  });
}

exports.addFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, {$push:  { following: req.body.followId} }, (err, result) => {
    if (err) return res.status(400).json({
      error: err
    });
    next();
  });
}

exports.addFollower = (req, res, next) => {
  User.findByIdAndUpdate(req.body.followId, { $push: { followers: req.body.userId }}, {
    new: true
  })
    .populate("followers", "_id name")
    .populate("following", "_id name")
    .exec((err, result) => {
      if (err) return res.status(400).json({
        error: err
      });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
}

exports.removeFollowing = (req, res, next) => {
  User.findByIdAndUpdate(req.body.userId, { $pull: { following: req.body.unfollowId }}, (err, result) => {
    if (err) return res.status(400).json({
      error: err
    });
    next();
  });
}

exports.removeFollower = (req, res, next) => {
  User.findByIdAndUpdate(req.body.unfollowId, {$pull: { followers: req.body.userId}}, { new: true })
    .populate("followers", "_id name")
    .populate("following", "_id name")
    .exec((err, result) => {
      if (err) return res.status(400).json({
        error: err
      });
      result.hashed_password = undefined;
      result.salt = undefined;
      res.json(result);
    });
}

exports.findPeople = (req, res, next) => {
  let following = req.profile.following;
  following.push(req.profile._id);
  User.find({ _id: { $nin: following }}, (err, users) => {
    if (err) return res.status(400).json({
      error: err
    });
    res.json(users);
  }).select("name");
}