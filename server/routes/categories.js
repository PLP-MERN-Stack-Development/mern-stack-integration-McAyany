const express = require('express');
const category = require('../models/Category');
const router = express.Router();

// Create a new category
router.post('/', async (req, res) => {
  try {
    const newCategory = new category(req.body);
    const savedCategory = await newCategory.save();
    res.status(201).json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
});

// Get all categories
router.get('/', async (req, res) => {
  try {
    const categories = await category.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
});

module.exports = router;
