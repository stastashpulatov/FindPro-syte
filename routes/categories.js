 const express = require('express');
 const router = express.Router();

 // Статичный список категорий (как в фронтенде)
 const categories = [
   { id: 1, name: 'Строительство', icon: '🏗️', description: 'Строительные работы любой сложности' },
   { id: 2, name: 'Ремонт', icon: '🔧', description: 'Ремонт квартир и домов' },
   { id: 3, name: 'Сантехника', icon: '🚰', description: 'Сантехнические услуги' },
   { id: 4, name: 'Электрика', icon: '⚡', description: 'Электромонтажные работы' },
   { id: 5, name: 'Уборка', icon: '🧹', description: 'Клининговые услуги' },
   { id: 6, name: 'Ландшафт', icon: '🌳', description: 'Ландшафтный дизайн' },
   { id: 7, name: 'IT-услуги', icon: '💻', description: 'Компьютерная помощь' },
   { id: 8, name: 'Перевозки', icon: '🚚', description: 'Грузоперевозки' }
 ];

 // Получить все категории
 router.get('/', (req, res) => {
   res.json({ success: true, data: categories });
 });

 module.exports = router;
