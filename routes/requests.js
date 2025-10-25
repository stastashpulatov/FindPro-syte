const express = require('express');
const router = express.Router();
const Request = require('../models/Request');
const Provider = require('../models/Provider');
const Quote = require('../models/Quote');

// Получить все заявки
router.get('/', async (req, res) => {
  try {
    const requests = await Request.find().sort({ createdAt: -1 });
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получить заявку по ID
router.get('/:id', async (req, res) => {
  try {
    const request = await Request.findById(req.params.id);
    if (!request) {
      return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создать новую заявку
router.post('/', async (req, res) => {
  try {
    const newRequest = new Request(req.body);
    await newRequest.save();

    // Найти подходящих исполнителей
    const providers = await Provider.find({
      categories: req.body.category
    });

    // Создать автоматические предложения
    const quotes = providers.map(provider => ({
      requestId: newRequest._id,
      providerId: provider._id,
      price: provider.basePrice,
      description: provider.description,
      estimatedTime: provider.responseTime,
      status: 'pending'
    }));

    if (quotes.length > 0) {
      await Quote.insertMany(quotes);
      newRequest.quotesCount = quotes.length;
      await newRequest.save();
    }

    res.status(201).json({ success: true, data: newRequest });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Обновить заявку
router.put('/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
    
    res.json({ success: true, data: request });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Удалить заявку
router.delete('/:id', async (req, res) => {
  try {
    const request = await Request.findByIdAndDelete(req.params.id);
    
    if (!request) {
      return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
    
    // Удалить все связанные предложения
    await Quote.deleteMany({ requestId: req.params.id });
    
    res.json({ success: true, message: 'Заявка удалена' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;