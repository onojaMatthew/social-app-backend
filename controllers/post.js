const { Post } = require("../models/post");
const fs = require("fs");
const { isPoster } = require("../middleware/auth");
const formidable = require("formidable");

exports.createPost = (req, res, next) => {
  console.log(req.file)
  
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;
  let post = new Post(req.body);
  post.postedBy = req.profile;
  // post.photo = req.file.path;
  post.save((err, result) => {
    if (err) {
      return next(err);
    }
    res.json(result);
  });

  // form.parse(req, (err, fields, files) => {
  //   if (err) {
  //     console.log(err.message);
  //     return res.status(400).json({
  //       error: "Image could not be uploaded"
  //     })
  //   }
  //   let post = new Post(fields);
  //   post.postedBy = req.profile;
  //   if (files.photo) {
  //     post.photo.data = fs.readFileSync(files.photo.path);
  //     post.photo.contentType = files.photo.type;
  //   }
  //   post.save((err, result) => {
  //     if (err) {

  //       return res.status(400).json({
  //         err: err
  //       })
  //     }
  //     res.json(result);
  //   });
  // });
};

exports.getPosts =  (req, res) => {
  const posts = Post.find()
  .populate("postedBy", "_id name")
  .select("_id title body")
    .then((posts) => {
      res.json({
        posts
      });
    })
    .catch(err => console.log(err.message));
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
