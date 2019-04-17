const express = require("express");
const { getPosts, createPost, getpostsBy, deletePost } = require("../controllers/post");
const { createPostValidator } = require("../validator");
const { requireSignin, userById, postById,isPoster } = require("../middleware/auth");
const upload = require("../middleware/fileUploadMiddleware")();

const router = express.Router();

router.get("/", getPosts);
router.post("/post/new/:usserId", requireSignin, upload.single("file"), createPost, createPostValidator);
router.get("/post/by/:userId", getpostsBy)
router.delete("/post/:postId", requireSignin, isPoster, deletePost);

router.param("userId", userById);
router.param("postId", postById);
module.exports = router;
