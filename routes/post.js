const express = require("express");
const { 
  getPosts, 
  createPost, 
  getpostsBy, 
  deletePost, 
  postById, 
  photo, 
  singlePost,
  updatePost, 
} = require("../controllers/post");
const { createPostValidator } = require("../validator");
const { requireSignin, isPoster } = require("../middleware/auth");
const { userById } = require("../controllers/user");

const router = express.Router();

router.get("/", getPosts);
router.post("/post/new/:userId", requireSignin, createPost, createPostValidator);
router.get("/post/:postId", singlePost);
router.put("/post/:postId", requireSignin, updatePost);
router.get("/post/by/:userId", getpostsBy)
router.delete("/post/:postId", requireSignin, isPoster, deletePost);
router.get("/post/photo/postId", photo);

router.param("userId", userById);
router.param("postId", postById);
module.exports = router;
