const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const Provider = require('../models/Provider');

// Получить предложения для заявки
router.get('/:requestId', async (req, res) => {
  try {
    const quotes = await Quote.find({ requestId: req.params.requestId })
      .populate('providerId')
      .sort({ createdAt: -1 });
    
    const formattedQuotes = quotes.map(quote => ({
      id: quote._id,
      requestId: quote.requestId,
      providerId: quote.providerId._id,
      providerName: quote.providerId.name,
      rating: quote.providerId.rating,
      reviews: quote.providerId.reviews,
      price: quote.price + ' ₽',
      responseTime: quote.estimatedTime,
      description: quote.description,
      status: quote.status,
      createdAt: quote.createdAt
    }));
    
    res.json({ success: true, data: formattedQuotes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создать предложение
router.post('/', async (req, res) => {
  try {
    const newQuote = new Quote(req.body);
    await newQuote.save();
    res.status(201).json({ success: true, data: newQuote });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Принять предложение
router.put('/:id/accept', async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: 'accepted' },
      { new: true }
    );
    
    if (!quote) {
      return res.status(404).json({ success: false, message: 'Предложение не найдено' });
    }
    
    // Отклонить другие предложения для этой заявки
    await Quote.updateMany(
      { 
        requestId: quote.requestId,
        _id: { $ne: quote._id }
      },
      { status: 'rejected' }
    );
    
    res.json({ success: true, data: quote });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;