const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const Schema = mongoose.Schema;

const postSchema = new Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  photo: { data: Buffer, ContentType: String },
  postedBy: { type: ObjectId, ref: "User"},
  created: { type: Date, default: Date.now },
  updated: Date,
  likes: [{ type: ObjectId, ref: "User"}]
});

const Post = mongoose.model("Post", postSchema);

exports.Post = Post;
