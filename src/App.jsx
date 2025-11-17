import React, { useState, useEffect } from 'react';
import { Menu, X, User, LogOut, Bell } from 'lucide-react';
import api from './services/api';
import AuthModal from './components/AuthModal';
import { 
  HomePage, 
  RequestPage, 
  QuotesPage, 
  MyRequestsPage, 
  ProvidersPage, 
  AccountSettingsPage,
  Footer 
} from './pages';

const App = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [quotes, setQuotes] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(api.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(api.getStoredUser());
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [pendingPage, setPendingPage] = useState(null);

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
    if (isAuthed) {
      loadData();
      loadCurrentUser();
    }
  }, [isAuthed]);

  const loadCurrentUser = async () => {
    try {
      const { data } = await api.getCurrentUser();
      setCurrentUser(data);
      api.setStoredUser(data);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadData = async () => {
    try {
      const [requestsRes] = await Promise.all([
        api.getRequests(),
      ]);
      setAllRequests(requestsRes.data);
    } catch (error) {
      console.error('Error loading data:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleLogout = () => {
    api.logout();
    setIsAuthed(false);
    setCurrentUser(null);
    setPendingPage(null);
    setCurrentPage('home');
    setUserMenuOpen(false);
  };

  const handleAccountDeleted = () => {
    handleLogout();
    alert('Аккаунт и все связанные данные удалены.');
  };

  const navigateTo = (page) => {
    const authRequiredPages = ['request', 'my-requests', 'settings'];
    if (authRequiredPages.includes(page) && !isAuthed) {
      alert('Чтобы продолжить, войдите или зарегистрируйтесь.');
      setPendingPage(page);
      setAuthOpen(true);
      return;
    }
    setCurrentPage(page);
  };

  const handleAuthed = () => {
    setIsAuthed(true);
    setAuthOpen(false);
    loadCurrentUser();
    if (pendingPage) {
      setCurrentPage(pendingPage);
      setPendingPage(null);
    }
  };

  const Header = () => (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div 
            className="flex items-center cursor-pointer group" 
            onClick={() => navigateTo('home')}
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all">
              <span className="text-white font-bold text-xl">FP</span>
            </div>
            <span className="ml-3 text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              FindPro
            </span>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-1">
            {[
              { key: 'home', label: 'Главная' },
              { key: 'my-requests', label: 'Мои заявки', authRequired: true },
              { key: 'providers', label: 'Специалисты' },
              { key: 'settings', label: 'Настройки', authRequired: true },
            ].map((item) => {
              if (item.authRequired && !isAuthed) return null;
              return (
                <button
                  key={item.key}
                  onClick={() => navigateTo(item.key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    currentPage === item.key
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthed ? (
              <>
                <button 
                  onClick={() => setAuthOpen(true)} 
                  className="px-4 py-2 text-blue-600 hover:text-blue-700 font-medium transition-colors"
                >
                  Войти
                </button>
                <button 
                  onClick={() => setAuthOpen(true)} 
                  className="px-6 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 font-medium shadow-md hover:shadow-lg transition-all"
                >
                  Регистрация
                </button>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-3 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-all"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                    <User size={18} className="text-white" />
                  </div>
                  <span className="font-medium text-gray-900">
                    {currentUser?.full_name || currentUser?.email || 'Профиль'}
                  </span>
                </button>

                {/* User Dropdown */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50">
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">
                        {currentUser?.full_name || 'Пользователь'}
                      </p>
                      <p className="text-xs text-gray-500">{currentUser?.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        navigateTo('my-requests');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <Bell size={16} />
                      Мои заявки
                    </button>
                    <button
                      onClick={() => {
                        navigateTo('settings');
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User size={16} />
                      Настройки
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <LogOut size={16} />
                      Выйти
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {[
              { key: 'home', label: 'Главная' },
              { key: 'my-requests', label: 'Мои заявки', authRequired: true },
              { key: 'providers', label: 'Специалисты' },
              { key: 'settings', label: 'Настройки', authRequired: true },
            ].map((item) => {
              if (item.authRequired && !isAuthed) return null;
              return (
                <button
                  key={item.key}
                  onClick={() => { 
                    navigateTo(item.key); 
                    setMobileMenuOpen(false); 
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${
                    currentPage === item.key
                      ? 'bg-blue-50 text-blue-600'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {!isAuthed ? (
              <>
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-blue-600 hover:bg-blue-50 rounded-lg font-medium"
                >
                  Войти
                </button>
                <button
                  onClick={() => {
                    setAuthOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium text-center shadow-md"
                >
                  Регистрация
                </button>
              </>
            ) : (
              <>
                <div className="px-4 py-3 border-t border-gray-100">
                  <p className="text-sm font-medium text-gray-900">
                    {currentUser?.full_name || 'Пользователь'}
                  </p>
                  <p className="text-xs text-gray-500">{currentUser?.email}</p>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileMenuOpen(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg font-medium"
                >
                  Выйти
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );

  // Закрываем user menu при клике вне его
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [userMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={navigateTo} 
            categories={categories}
          />
        )}
        {currentPage === 'request' && (
          <RequestPage 
            onNavigate={navigateTo}
            categories={categories}
            setQuotes={setQuotes}
            setAllRequests={setAllRequests}
            allRequests={allRequests}
          />
        )}
        {currentPage === 'quotes' && <QuotesPage />}
        {currentPage === 'my-requests' && (
          <MyRequestsPage 
            onNavigate={navigateTo}
            allRequests={allRequests}
            setAllRequests={setAllRequests}
          />
        )}
        {currentPage === 'providers' && (
          <ProvidersPage 
            onNavigate={navigateTo}
          />
        )}
        {currentPage === 'settings' && (
          <AccountSettingsPage 
            currentUser={currentUser}
            onLogout={handleLogout}
            onAccountDeleted={handleAccountDeleted}
          />
        )}
      </main>
      
      <Footer />
      
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={handleAuthed}
      />
    </div>
  );
};

export default App;