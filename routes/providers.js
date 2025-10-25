const express = require('express');
const router = express.Router();
const Provider = require('../models/Provider');

// Получить всех исполнителей
router.get('/', async (req, res) => {
  try {
    const { category, minRating } = req.query;
    const query = {};
    
    if (category) {
      query.categories = category;
    }
    
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) };
    }
    
    const providers = await Provider.find(query).sort({ rating: -1 });
    res.json({ success: true, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получить исполнителя по ID
router.get('/:id', async (req, res) => {
  try {
    const provider = await Provider.findById(req.params.id);
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Исполнитель не найден' });
    }
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создать исполнителя
router.post('/', async (req, res) => {
  try {
    const newProvider = new Provider(req.body);
    await newProvider.save();
    res.status(201).json({ success: true, data: newProvider });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Обновить исполнителя
router.put('/:id', async (req, res) => {
  try {
    const provider = await Provider.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Исполнитель не найден' });
    }
    
    res.json({ success: true, data: provider });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Удалить исполнителя
router.delete('/:id', async (req, res) => {
  try {
    const provider = await Provider.findByIdAndDelete(req.params.id);
    
    if (!provider) {
      return res.status(404).json({ success: false, message: 'Исполнитель не найден' });
    }
    
    res.json({ success: true, message: 'Исполнитель удален' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;