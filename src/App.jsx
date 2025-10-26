import React, { useState, useEffect } from 'react';
import { Users, Star, ArrowRight, Menu, X, MapPin, Phone, Mail, Clock, Briefcase } from 'lucide-react';
import api from './services/api';
import AuthModal from './components/AuthModal';
import { 
  HomePage, 
  RequestPage, 
  QuotesPage, 
  MyRequestsPage, 
  ProvidersPage, 
  Footer 
} from './pages';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    category: '',
    description: '',
    location: '',
    name: '',
    email: '',
    phone: ''
  });
  const [quotes, setQuotes] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [providers, setProviders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(!!localStorage.getItem('token'));

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

  useEffect(() => {
    loadData();
  }, [isAuthed]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [requestsRes, providersRes] = await Promise.all([
        api.getRequests(),
        api.getProviders()
      ]);
      setAllRequests(requestsRes.data);
      setProviders(providersRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async () => {
    if (!formData.category || !formData.description || !formData.location || 
        !formData.name || !formData.email || !formData.phone) {
      alert('Пожалуйста, заполните все поля');
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.createRequest(formData);
      const quotesRes = await api.getQuotes(response.data.id);
      setQuotes(quotesRes.data);
      setAllRequests([...allRequests, response.data]);
      setCurrentPage('quotes');
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Ошибка при создании заявки');
    }
    setIsLoading(false);
  };

  const Header = () => (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center cursor-pointer" onClick={() => setCurrentPage('home')}>
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">FP</span>
            </div>
            <span className="ml-3 text-2xl font-bold text-gray-900">FindPro</span>
          </div>
          
          <nav className="hidden md:flex space-x-8">
            <a onClick={() => setCurrentPage('home')} className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium">Главная</a>
            <a onClick={() => setCurrentPage('my-requests')} className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium">Мои заявки</a>
            <a onClick={() => setCurrentPage('providers')} className="text-gray-700 hover:text-blue-600 cursor-pointer font-medium">Специалисты</a>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            {!isAuthed ? (
              <>
                <button onClick={() => setAuthOpen(true)} className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium">Войти</button>
                <button onClick={() => setAuthOpen(true)} className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                  Регистрация
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  setIsAuthed(false);
                }}
                className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-medium"
              >
                Выйти
              </button>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <a onClick={() => { setCurrentPage('home'); setMobileMenuOpen(false); }} className="block text-gray-700">Главная</a>
            <a onClick={() => { setCurrentPage('my-requests'); setMobileMenuOpen(false); }} className="block text-gray-700">Мои заявки</a>
            <a onClick={() => { setCurrentPage('providers'); setMobileMenuOpen(false); }} className="block text-gray-700">Специалисты</a>
          </div>
        </div>
      )}
    </header>
  );

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      {/* Страницы - HomePage, RequestPage, QuotesPage, MyRequestsPage, ProvidersPage */}
      {currentPage === 'home' && (
        <HomePage 
          setCurrentPage={setCurrentPage} 
          categories={categories}
        />
      )}
      {currentPage === 'request' && (
        <RequestPage 
          setCurrentPage={setCurrentPage}
          categories={categories}
          setQuotes={setQuotes}
          setAllRequests={setAllRequests}
          allRequests={allRequests}
        />
      )}
      {currentPage === 'quotes' && <QuotesPage />}
      {currentPage === 'my-requests' && (
        <MyRequestsPage 
          setCurrentPage={setCurrentPage}
          allRequests={allRequests}
          setAllRequests={setAllRequests}
        />
      )}
      {currentPage === 'providers' && (
        <ProvidersPage 
          setCurrentPage={setCurrentPage}
        />
      )}
      
      <Footer />
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={() => { setIsAuthed(true); setAuthOpen(false); }}
      />
    </div>
  );
};

export default App;