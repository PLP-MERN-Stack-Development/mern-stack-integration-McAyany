const express = require('express');
const post = require('../models/Post');
const router = express.Router();
import { validatePost } from "../middleware/validateMiddleware.js";

router.route("/").post(validatePost, createPost);

// Create a new post
router.post('/', async (req, res) => {
  try {
    const newPost = new post(req.body);
    const savedPost = await newPost.save();
    res.status(201).json(savedPost);
  } catch (error) {
    res.status(500).json({ message: 'Error creating post', error });
  }
});

// Get all posts
router.get('/', async (req, res) => {
  try {
    const posts = await post.find();
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching posts', error });
  }
});

module.exports = router;