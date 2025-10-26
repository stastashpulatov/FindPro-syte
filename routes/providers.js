const express = require('express');
const router = express.Router();
const providersRepo = require('../repositories/providersRepo');

// Получить всех исполнителей
router.get('/', async (req, res) => {
  try {
    const { category, minRating } = req.query;
    const providers = providersRepo.find({
      category: category || undefined,
      minRating: minRating ? parseFloat(minRating) : undefined,
    });
    res.json({ success: true, data: providers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Получить исполнителя по ID
router.get('/:id', async (req, res) => {
  try {
    const provider = providersRepo.findById(req.params.id);
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
    const created = providersRepo.create(req.body);
    res.status(201).json({ success: true, data: created });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Обновить исполнителя
router.put('/:id', async (req, res) => {
  try {
    const updated = providersRepo.update(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Исполнитель не найден' });
    }
    res.json({ success: true, data: updated });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Удалить исполнителя
router.delete('/:id', async (req, res) => {
  try {
    const ok = providersRepo.delete(req.params.id);
    if (!ok) {
      return res.status(404).json({ success: false, message: 'Исполнитель не найден' });
    }
    res.json({ success: true, message: 'Исполнитель удален' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;