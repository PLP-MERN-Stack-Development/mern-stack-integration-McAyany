const express = require("express");
const Post = require("../models/Post");
const { validatePost } = require("../middleware/validateMiddleware");

const router = express.Router();

// 🟩 Create a new post
router.post("/", validatePost, async (req, res) => {
  try {
    const newPost = new Post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (err) {
    res.status(500).json({ message: "Error creating post", error: err.message });
  }
});

// 🟨 Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find().populate("category");
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: "Error fetching posts", error: err.message });
  }
});

// 🟦 Get single post
router.get("/:id", async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate("category");
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: "Error fetching post", error: err.message });
  }
});

// 🟧 Update post
router.put("/:id", async (req, res) => {
  try {
    const updatedPost = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPost) return res.status(404).json({ message: "Post not found" });
    res.json(updatedPost);
  } catch (err) {
    res.status(500).json({ message: "Error updating post", error: err.message });
  }
});

// 🟥 Delete post
router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Post.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Post not found" });
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Error deleting post", error: err.message });
  }
});

module.exports = router;
