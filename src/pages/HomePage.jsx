import React, { useEffect, useState } from 'react';
import { Search, MapPin, Star, CheckCircle, Users, Clock, Shield, Award, ArrowRight, Zap } from 'lucide-react';

const HomePage = ({ onNavigate, categories }) => {
  const [show, setShow] = useState(false);
  const [activeTestimonial, setActiveTestimonial] = useState(0);

  useEffect(() => {
    const t = setTimeout(() => setShow(true), 10);
    return () => clearTimeout(t);
  }, []);

  // Автоматическая смена отзывов
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const testimonials = [
    {
      name: "Александр К.",
      role: "Владелец квартиры",
      text: "Нашёл отличного мастера для ремонта за 2 часа! Работа выполнена качественно и в срок.",
      rating: 5
    },
    {
      name: "Мария П.",
      role: "Предприниматель",
      text: "Использую FindPro для поиска специалистов уже полгода. Всегда профессиональный подход!",
      rating: 5
    },
    {
      name: "Дмитрий С.",
      role: "Частный заказчик",
      text: "Удобная платформа, прозрачные цены. Рекомендую всем, кто ищет надёжных исполнителей.",
      rating: 5
    }
  ];

  const features = [
    {
      icon: Shield,
      title: "Безопасность",
      description: "Все специалисты проходят проверку. Ваши данные защищены.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Zap,
      title: "Быстро",
      description: "Получите предложения от профессионалов в течение часа.",
      color: "from-orange-500 to-orange-600"
    },
    {
      icon: Award,
      title: "Качество",
      description: "Работаем только с проверенными специалистами высокого уровня.",
      color: "from-green-500 to-green-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section-Улучшенный дизайн */}
      <section className={`relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-24 transition-all duration-700 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'} `}>
        {/* Декоративные элементы */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight animate-fade-in">
              Найдите профессионалов
              <br />
              <span className="text-blue-200">для любых задач</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto">
              Быстро, надежно и по выгодной цене. Более 1000 проверенных специалистов готовы помочь вам.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button
                onClick={() => onNavigate('request')}
                className="group px-8 py-4 bg-white text-blue-600 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-all inline-flex items-center gap-2 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
              >
                Создать заявку бесплатно
                <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={() => onNavigate('providers')}
                className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl text-lg font-semibold hover:bg-white hover:text-blue-600 transition-all"
              >
                Найти специалиста
              </button>
            </div>

            {/* Статистика */}
            <div className="grid grid-cols-3 gap-8 mt-16 max-w-2xl mx-auto">
              {[
                { num: "1000+", label: "Специалистов" },
                { num: "5000+", label: "Заказов" },
                { num: "4.8★", label: "Рейтинг" }
              ].map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="text-3xl md:text-4xl font-bold mb-1">{stat.num}</div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section-Новый дизайн */}
      <section className={`py-20 transition-all duration-700 delay-100 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} `}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <div
                  key={idx}
                  className="relative group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                  style={{ transitionDelay: `${idx * 100} ms` }}
                >
                  <div className={`w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover: scale-110 transition-transform`}>
                    <Icon className="text-white" size={32} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Как это работает</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Простой процесс в 3 шага</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                step: "1",
                icon: CheckCircle,
                title: "Создайте заявку",
                description: "Опишите вашу задачу в деталях. Это займёт всего 2 минуты.",
                color: "blue"
              },
              {
                step: "2",
                icon: Users,
                title: "Получите предложения",
                description: "Специалисты пришлют свои предложения с ценами и сроками.",
                color: "green"
              },
              {
                step: "3",
                icon: Star,
                title: "Выберите лучшего",
                description: "Сравните предложения, выберите исполнителя и начните работу.",
                color: "orange"
              }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="relative text-center">
                  {/* Линия связи */}
                  {idx < 2 && (
                    <div className="hidden md:block absolute top-16 left-1/2 w-full h-1 bg-gradient-to-r from-gray-300 to-gray-200 -z-10"></div>
                  )}

                  <div className="relative inline-flex items-center justify-center w-32 h-32 mb-6">
                    <div className={`absolute inset-0 bg-${item.color} -100 rounded-full animate-pulse`}></div>
                    <div className={`relative w-24 h-24 bg-gradient-to-br from-${item.color} -500 to-${item.color} -600 rounded-full flex items-center justify-center shadow-xl`}>
                      <Icon className="text-white" size={40} />
                    </div>
                    <div className="absolute -top-2 -right-2 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center font-bold text-xl text-gray-800">
                      {item.step}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-3 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed max-w-xs mx-auto">{item.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Categories Section-Улучшенный */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-4">Популярные категории</h2>
          <p className="text-xl text-gray-600 text-center mb-16">Более 50 видов услуг</p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((category, idx) => (
              <div
                key={category.id}
                onClick={() => onNavigate('request')}
                className={`group bg-gradient-to-br from-gray-50 to-white border-2 border-gray-100 p-6 rounded-2xl text-center cursor-pointer transition-all duration-300 hover: shadow-2xl hover: border-blue-300 hover: -translate-y-2 ${show ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} `}
                style={{ transitionDelay: `${Math.min(idx, 6) * 50} ms` }}
              >
                <div className="text-5xl mb-4 group-hover:scale-125 transition-transform duration-300">
                  {category.icon}
                </div>
                <h3 className="font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                  {category.name}
                </h3>
                <p className="text-sm text-gray-600">{category.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section-Новый */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-indigo-700 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-bold text-center mb-16">Что говорят наши клиенты</h2>

          <div className="relative">
            {testimonials.map((testimonial, idx) => (
              <div
                key={idx}
                className={`transition-all duration-500 ${idx === activeTestimonial
                  ? 'opacity-100 translate-x-0'
                  : 'opacity-0 absolute top-0 left-0 right-0 translate-x-full'
                  } `}
              >
                <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 md:p-12">
                  <div className="flex gap-1 mb-6 justify-center">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} size={24} className="fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-xl md:text-2xl mb-8 text-center leading-relaxed">
                    "{testimonial.text}"
                  </p>
                  <div className="text-center">
                    <div className="font-bold text-lg mb-1">{testimonial.name}</div>
                    <div className="text-blue-200">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}

            {/* Индикаторы */}
            <div className="flex gap-2 justify-center mt-8">
              {testimonials.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveTestimonial(idx)}
                  className={`w-3 h-3 rounded-full transition-all ${idx === activeTestimonial
                    ? 'bg-white w-8'
                    : 'bg-white/50 hover:bg-white/75'
                    } `}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section-Улучшенный */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-12 md:p-16 text-center text-white shadow-2xl">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Готовы начать?</h2>
            <p className="text-xl mb-8 text-blue-100">
              Создайте заявку прямо сейчас и получите предложения в течение часа
            </p>
            <button
              onClick={() => onNavigate('request')}
              className="group px-10 py-5 bg-white text-blue-600 rounded-xl text-lg font-bold hover:bg-blue-50 transition-all inline-flex items-center gap-3 shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
            >
              Создать заявку бесплатно
              <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
            </button>

            <div className="mt-8 text-blue-100 text-sm">
              <Clock size={16} className="inline mr-2" />
              Регистрация не требуется • Ответы в течение часа
            </div>
          </div>
        </div>
      </section>

      <style jsx>{`
@keyframes fade -in {
  from {
  opacity: 0;
  transform: translateY(20px);
}
          to {
  opacity: 1;
  transform: translateY(0);
}
        }
        
        .animate-fade -in {
  animation: fade -in 1s ease- out;
        }
`}</style>
    </div>
  );
};

export default HomePage;