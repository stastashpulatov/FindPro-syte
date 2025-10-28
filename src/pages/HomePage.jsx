import React, { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle, Users, Star, Clock } from 'lucide-react';

const HomePage = ({ setCurrentPage, categories }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(t);
  }, []);
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className={`bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-6">
              Найдите профессионалов для любых задач
            </h1>
            <p className="text-xl mb-8 text-blue-100">
              Быстро, надежно и по выгодной цене
            </p>
            <button
              onClick={() => setCurrentPage('request')}
              className="px-8 py-4 bg-white text-blue-600 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center gap-2 active:scale-[0.98] shadow-sm hover:shadow"
            >
              Создать заявку
              <ArrowRight size={20} />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={`py-16 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Как это работает</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">1. Создайте заявку</h3>
              <p className="text-gray-600">
                Опишите вашу задачу и получите предложения от специалистов
              </p>
            </div>
            <div className="text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">2. Выберите исполнителя</h3>
              <p className="text-gray-600">
                Сравните предложения и выберите лучшего специалиста
              </p>
            </div>
            <div className="text-center transition-transform duration-200 hover:-translate-y-1">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="text-blue-600" size={32} />
              </div>
              <h3 className="text-xl font-semibold mb-2">3. Получите результат</h3>
              <p className="text-gray-600">
                Работайте с профессионалом и оцените качество работы
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">Популярные категории</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div
                key={category.id}
                onClick={() => setCurrentPage('request')}
                className={`bg-gray-50 p-6 rounded-lg text-center cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}
                style={{ transitionDelay: `${Math.min(idx, 6) * 40}ms` }}
              >
                <div className="text-4xl mb-3">{category.icon}</div>
                <h3 className="font-semibold text-gray-900">{category.name}</h3>
                <p className="text-sm text-gray-600 mt-2">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={`py-16 bg-blue-600 text-white transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">1000+</div>
              <div className="text-blue-100">Проверенных специалистов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5000+</div>
              <div className="text-blue-100">Выполненных заказов</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">4.8</div>
              <div className="text-blue-100">Средний рейтинг</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={`py-16 transition-all duration-300 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Готовы начать?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Создайте заявку прямо сейчас и получите предложения от профессионалов
          </p>
          <button
            onClick={() => setCurrentPage('request')}
            className="px-8 py-4 bg-blue-600 text-white rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all inline-flex items-center gap-2 active:scale-[0.98] shadow-sm hover:shadow"
          >
            Создать заявку бесплатно
            <ArrowRight size={20} />
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
