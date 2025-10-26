import React, { useState, useEffect } from 'react';
import { Star, MapPin, Briefcase, CheckCircle } from 'lucide-react';
import api from '../services/api';

const ProvidersPage = ({ setCurrentPage }) => {
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    loadProviders();
  }, [selectedCategory]);

  const loadProviders = async () => {
    setIsLoading(true);
    try {
      const params = selectedCategory ? { category_id: selectedCategory } : {};
      const response = await api.getProviders(params);
      setProviders(response.data);
    } catch (error) {
      console.error('Error loading providers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderRating = (rating) => {
    return (
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            size={16}
            className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
          />
        ))}
        <span className="ml-1 text-sm text-gray-600">({rating})</span>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Загрузка специалистов...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Наши специалисты</h1>
          <p className="text-gray-600">
            Проверенные профессионалы готовы помочь вам с вашими задачами
          </p>
        </div>

        {providers.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-12 text-center">
            <p className="text-gray-600 mb-4">
              Специалисты пока не зарегистрированы в системе
            </p>
            <button
              onClick={() => setCurrentPage('request')}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Создать заявку
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {providers.map((provider) => (
              <div
                key={provider.id}
                className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">
                      {provider.company_name || provider.user?.full_name || 'Специалист'}
                    </h3>
                    {provider.is_verified && (
                      <div className="flex items-center gap-1 text-green-600 text-sm">
                        <CheckCircle size={16} />
                        <span>Проверен</span>
                      </div>
                    )}
                  </div>
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-700 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {(provider.company_name || provider.user?.full_name || 'S')[0].toUpperCase()}
                  </div>
                </div>

                {provider.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {provider.description}
                  </p>
                )}

                <div className="space-y-2 mb-4">
                  {provider.service_area && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{provider.service_area}</span>
                    </div>
                  )}
                  {provider.services && provider.services.length > 0 && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Briefcase size={16} />
                      <span>{provider.services.length} услуг</span>
                    </div>
                  )}
                </div>

                {renderRating(provider.rating || 0)}

                <button
                  onClick={() => setCurrentPage('request')}
                  className="w-full mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
                >
                  Отправить заявку
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProvidersPage;
