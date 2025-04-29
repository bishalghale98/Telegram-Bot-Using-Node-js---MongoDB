const express = require('express');
const router = express.Router();
const Data = require('../models/dataModel');
const logger = require('../utils/logger');
const { isAdmin } = require('../utils/helpers');

// POST endpoint to add new data
router.post('/data', async (req, res) => {
  try {
    const { name, value, username } = req.body;
    
    if (!name || !value || !username) {
      return res.status(400).json({ error: 'Name, value, and username are required' });
    }

    const existing = await Data.findOne({ name });
    
    if (existing) {
      existing.value = value;
      existing.updatedAt = Date.now();
      await existing.save();
      return res.json({ message: 'Data updated', data: existing });
    } else {
      const newData = await Data.create({ name, value, createdBy: username });
      return res.status(201).json({ message: 'Data created', data: newData });
    }
  } catch (error) {
    logger.error(`API Error: ${error.message}`);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

// GET endpoint to search data
router.get('/data/:name', async (req, res) => {
  try {
    const data = await Data.findOne({ name: req.params.name });
    if (!data) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.json(data);
  } catch (error) {
    logger.error(`API Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET all data (admin only)
router.get('/data', async (req, res) => {
  try {
    if (!isAdmin(req.query.username)) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    
    const allData = await Data.find({});
    res.json(allData);
  } catch (error) {
    logger.error(`API Error: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;