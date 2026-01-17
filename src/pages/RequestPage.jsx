import React, { useState, useEffect } from 'react';
import { ArrowLeft, Send, Upload, X, Image as ImageIcon } from 'lucide-react';
import api from '../services/api';

const RequestPage = ({ onNavigate, categories, setQuotes, setAllRequests, allRequests, initialProviderId }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category_id: '',
    price: '',
    provider_id: initialProviderId || '',
    latitude: '',
    longitude: '',
    photos: [],
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!api.isAuthenticated()) {
      alert('Для создания заявки необходимо войти в систему');
      onNavigate('home');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.title || !formData.description || !formData.category_id) {
      setError('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const requestData = {
        title: formData.title,
        description: formData.description,
        category_id: parseInt(formData.category_id),
        provider_id: formData.provider_id ? parseInt(formData.provider_id) : null,
        price: formData.price ? parseFloat(formData.price) : null,
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        photos: formData.photos || [],
      };

      const response = await api.createRequest(requestData);

      // Обновляем список заявок
      setAllRequests([...allRequests, response.data]);

      // Переходим на страницу с моими заявками
      onNavigate('my-requests');

      // Показываем уведомление
      alert('Заявка успешно создана!');
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
          onClick={() => onNavigate('home')}
          className="flex items-center text-blue-600 hover:text-blue-700 mb-6"
        >
          <ArrowLeft size={20} className="mr-2" />
          Назад
        </button>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Создать заявку</h1>
          <p className="text-gray-600 mb-8">
            {initialProviderId ? 'Заполните детали заявки для выбранного специалиста' : 'Опишите вашу задачу, и специалисты пришлют вам свои предложения'}
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Фотографии (опционально)
              </label>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                {formData.photos?.map((photo, idx) => (
                  <div key={idx} className="relative group aspect-square bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                    <img
                      src={photo.startsWith('http') ? photo : `${api.defaults?.baseURL?.replace('/api/v1', '') || ''}${photo}`}
                      alt={`Photo ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newPhotos = [...formData.photos];
                        newPhotos.splice(idx, 1);
                        setFormData({ ...formData, photos: newPhotos });
                      }}
                      className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ))}

                <label className="cursor-pointer border-2 border-dashed border-gray-300 rounded-lg aspect-square flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50 hover:bg-white">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={async (e) => {
                      const files = Array.from(e.target.files);
                      if (files.length === 0) return;

                      setIsLoading(true);
                      try {
                        const newPhotos = [...(formData.photos || [])];
                        // Upload each file
                        for (const file of files) {
                          const res = await api.uploadFile(file);
                          newPhotos.push(res.data.msg);
                        }
                        setFormData({ ...formData, photos: newPhotos });
                      } catch (err) {
                        console.error("Upload error", err);
                        alert("Ошибка загрузки фото");
                      } finally {
                        setIsLoading(false);
                      }
                    }}
                  />
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-current"></div>
                  ) : (
                    <>
                      <Upload size={24} className="mb-2" />
                      <span className="text-xs">Загрузить</span>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Бюджет (сум)
                </label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  placeholder="Например: 1000000"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Местоположение (координаты для демо)
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="latitude"
                    value={formData.latitude}
                    onChange={handleChange}
                    placeholder="Lat"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    name="longitude"
                    value={formData.longitude}
                    onChange={handleChange}
                    placeholder="Lon"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="button"
                onClick={() => onNavigate('home')}
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
      </div>
    </div>
  );
};

export default RequestPage;
