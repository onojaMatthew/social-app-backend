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
    })
  })
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
    })
  })
}