import React, { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import api from '../services/api';

const RequestPage = ({ setCurrentPage, categories, setQuotes, setAllRequests, allRequests }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.category_id) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await api.createRequest({
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
      });

      // Обновляем список заявок
      setAllRequests([...allRequests, response.data]);
      
      // Получаем предложения для новой заявки
      const quotesRes = await api.getQuotes({ request_id: response.data.id });
      setQuotes(quotesRes.data);
      
      // Переходим на страницу с предложениями
      setCurrentPage('my-requests');
      
      // Показываем уведомление
      alert('Заявка успешно создана! Ожидайте предложений от специалистов.');
    } catch (error) {
      console.error('Error creating request:', error);
      if (error.response?.status === 401) {
        setError('Необходимо войти в систему для создания заявки');
      } else {
        setError(error.response?.data?.detail || 'Ошибка при создании заявки');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => setCurrentPage('home')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Назад
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Создать заявку</h1>
          <p className="text-gray-600 mb-8">
            Опишите вашу задачу, и специалисты пришлют вам свои предложения
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Категория услуги *
              </label>
              <select
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              >
                <option value="">Выберите категорию</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.icon} {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Название заявки *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Например: Ремонт квартиры 50 кв.м"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Описание задачи *
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows="6"
                placeholder="Опишите подробно, что нужно сделать, когда и какие у вас требования..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
              <p className="mt-2 text-sm text-gray-500">
                Чем подробнее описание, тем точнее будут предложения специалистов
              </p>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => setCurrentPage('home')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium"
              >
                Отмена
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  'Отправка...'
                ) : (
                  <>
                    Отправить заявку
                    <Send size={18} />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Совет</h3>
          <p className="text-blue-800 text-sm">
            Укажите желаемые сроки выполнения работы и ваш бюджет - это поможет специалистам
            сделать более точные предложения.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RequestPage;
