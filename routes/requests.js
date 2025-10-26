const express = require('express');
const router = express.Router();
const requestsRepo = require('../repositories/requestsRepo');
const providersRepo = require('../repositories/providersRepo');
const quotesRepo = require('../repositories/quotesRepo');

// Получить все заявки
router.get('/', async (req, res) => {
  try {
    const requests = requestsRepo.findAll();
    res.json({ success: true, data: requests });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получить заявку по ID
router.get('/:id', async (req, res) => {
  try {
    const request = requestsRepo.findById(req.params.id);
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
    const newRequest = requestsRepo.create(req.body);

    // Найти подходящих исполнителей
    const providers = providersRepo.find({ category: req.body.category });

    // Создать автоматические предложения
    const quotes = providers.map((provider) => ({
      requestId: newRequest.id,
      providerId: provider.id,
      price: provider.basePrice,
      description: provider.description,
      estimatedTime: provider.responseTime,
      status: 'pending',
    }));

    if (quotes.length > 0) {
      quotesRepo.createMany(quotes);
      requestsRepo.incrementQuotesCount(newRequest.id, quotes.length);
    }

    const created = requestsRepo.findById(newRequest.id);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Обновить заявку
router.put('/:id', async (req, res) => {
  try {
    const updated = requestsRepo.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Удалить заявку
router.delete('/:id', async (req, res) => {
  try {
    // Удалить все связанные предложения
    quotesRepo.deleteByRequestId(req.params.id);
    const ok = requestsRepo.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Заявка не найдена' });
    }
    res.json({ success: true, message: 'Заявка удалена' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;