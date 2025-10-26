const express = require('express');
const router = express.Router();
const quotesRepo = require('../repositories/quotesRepo');
const providersRepo = require('../repositories/providersRepo');

// Получить предложения для заявки
router.get('/:requestId', async (req, res) => {
  try {
    const quotes = quotesRepo.findByRequestId(req.params.requestId);
    const formatted = quotes.map((q) => {
      const provider = providersRepo.findById(q.providerId);
      return {
        id: q.id,
        requestId: q.requestId,
        providerId: provider ? provider.id : q.providerId,
        providerName: provider ? provider.name : undefined,
        rating: provider ? provider.rating : undefined,
        reviews: provider ? provider.reviews : undefined,
        price: q.price + ' ₽',
        responseTime: q.estimatedTime,
        description: q.description,
        status: q.status,
        createdAt: q.createdAt,
      };
    });
    res.json({ success: true, data: formatted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Создать предложение
router.post('/', async (req, res) => {
  try {
    const created = quotesRepo.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Принять предложение
router.put('/:id/accept', async (req, res) => {
  try {
    const updated = quotesRepo.accept(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Предложение не найдено' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;