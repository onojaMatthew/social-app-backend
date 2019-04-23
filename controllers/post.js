const { Post } = require("../models/post");
const fs = require("fs");
const _ = require("lodash");
const { isPoster } = require("../middleware/auth");
const formidable = require("formidable");

exports.createPost = (req, res, next) => {
  
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json(400).json({
        error: "Failed to upload photo"
      });
    }

    let post = new Post(fields);
    post.postedBy = req.profile;

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      
      res.json(result);
    });
  });
};

exports.getPosts =  (req, res) => {
  const posts = Post.find()
    .populate("postedBy", "_id name")
    .select("_id title body created")
    .sort({ created: -1 })
    .then((posts) => {
      res.json(posts);
    })
    .catch(err => console.log(err.message));
}

exports.postById = (req, res, next, id) => {
  Post.findById(id)
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

exports.getpostsBy = (req, res, next) => {
  Post.find({postedBy: req.profile._id})
    .populate("postedBy", "_id name")
    .sort("_created")
    .exec((err, posts) => {
      if (err) {
        return res.status(400).json({
          error: err
        });
      }
      res.json(posts);
    });
}

exports.deletePost = (req, res, next) => {
  const post = req.post;
  post.remove((err) => {
    if (err) {
      return res.status(400).json({
        error: err
      });
    }
    res.json({
      message: "Post successfully deleted"
    });
  });
}

exports.photo = (req, res, next) => {
  res.set("Content-Type", res.post.photo.contentType);
  return res.send(req.post.photo.data);
}

exports.singlePost = (req, res, next) => {
  return res.json(req.post);
}

exports.updatePost = (req, res, next) => {
  const form = new formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.json(400).json({
        error: "Failed to upload photo"
      });
    }

    let post = req.post;
    post = _.extend(post, fields);
    post.updated = Date.now();

    if (files.photo) {
      post.photo.data = fs.readFileSync(files.photo.path);
      post.photo.contentType = files.photo.type;
    }
    post.save((err, result) => {
      if (err) {
        return res.status(400).json({
          error: err
        })
      }
      res.json(post);
    });
  });
}
