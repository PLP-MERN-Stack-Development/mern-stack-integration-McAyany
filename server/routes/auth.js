const express = require('express');
const auth = require('../models/Auth');
const router = express.Router();

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const newUser = new auth(req.body);
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json({ message: 'Error registering user', error });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await auth.findOne({ username, password });
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});

module.exports = router;