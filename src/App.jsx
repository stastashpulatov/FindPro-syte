import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { Menu, X, User, LogOut, Bell, Briefcase, Search } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import api from './services/api';
import AuthModal from './components/AuthModal';
import {
  HomePage,
  RequestPage,
  QuotesPage,
  MyRequestsPage,
  ProvidersPage,
  AccountSettingsPage,
  AdminPage,
  WorkerDashboardPage,
  Footer
} from './pages';

// Wrapper to provide navigation prop to legacy pages
const PageWrapper = ({ Component, ...props }) => {
  const navigate = useNavigate();
  return <Component onNavigate={(path) => navigate(path === 'home' ? '/' : `/${path}`)} {...props} />;
};

const Layout = ({ children, isAuthed, setIsAuthed, currentUser, setCurrentUser, setAuthOpen }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const handleLogout = () => {
    api.logout();
    setIsAuthed(false);
    setCurrentUser(null);
    navigate('/');
    setUserMenuOpen(false);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  // Close user menu on click outside
  useEffect(() => {
    const handleClick = () => setUserMenuOpen(false);
    if (userMenuOpen) {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }
  }, [userMenuOpen]);

  const navItems = [
    { key: '/', label: 'Главная' },
    { key: '/worker-dashboard', label: 'Задачи', providerOnly: true },
    { key: '/my-requests', label: 'Мои заявки', authRequired: true },
    { key: '/providers', label: 'Специалисты' },
    { key: '/settings', label: 'Настройки', authRequired: true },
    { key: '/admin', label: 'Админ', adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-md sticky top-0 z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div
              className="flex items-center cursor-pointer group"
              onClick={() => navigate('/')}
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
              {navItems.map((item) => {
                if (item.authRequired && !isAuthed) return null;
                if (item.adminOnly && (!isAuthed || !currentUser?.is_superuser)) return null;
                if (item.providerOnly && (!isAuthed || !currentUser?.is_provider)) return null;

                const isActive = location.pathname === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => navigate(item.key)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${isActive
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
                    onClick={(e) => {
                      e.stopPropagation();
                      setUserMenuOpen(!userMenuOpen);
                    }}
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
                          navigate('/my-requests');
                          setUserMenuOpen(false);
                        }}
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                      >
                        <Bell size={16} />
                        Мои заявки
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
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
              {navItems.map((item) => {
                if (item.authRequired && !isAuthed) return null;
                if (item.adminOnly && (!isAuthed || !currentUser?.is_superuser)) return null;
                if (item.providerOnly && (!isAuthed || !currentUser?.is_provider)) return null;

                const isActive = location.pathname === item.key;
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      navigate(item.key);
                      setMobileMenuOpen(false);
                    }}
                    className={`block w-full text-left px-4 py-3 rounded-lg font-medium transition-all ${isActive
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

      <main className="flex-1">
        {children}
      </main>

      <Footer />
    </div>
  );
};

const App = () => {
  const [quotes, setQuotes] = useState([]);
  const [allRequests, setAllRequests] = useState([]);
  const [authOpen, setAuthOpen] = useState(false);
  const [isAuthed, setIsAuthed] = useState(api.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(api.getStoredUser());
  const [pendingPath, setPendingPath] = useState(null);

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
      return data;
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
        api.logout();
        setIsAuthed(false);
        setCurrentUser(null);
      }
    }
  };

  const handleAuthed = async () => {
    setIsAuthed(true);
    setAuthOpen(false);
    await loadCurrentUser();
  };

  const handleAccountDeleted = () => {
    api.logout();
    setIsAuthed(false);
    setCurrentUser(null);
    alert('Аккаунт и все связанные данные удалены.');
  };

  return (
    <BrowserRouter>
      <Toaster position="top-right" />
      <Layout
        isAuthed={isAuthed}
        setIsAuthed={setIsAuthed}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        setAuthOpen={setAuthOpen}
      >
        <Routes>
          <Route
            path="/"
            element={
              <PageWrapper
                Component={HomePage}
                categories={categories}
              />
            }
          />
          <Route
            path="/request"
            element={
              <PageWrapper
                Component={RequestPage}
                categories={categories}
                setQuotes={setQuotes}
                setAllRequests={setAllRequests}
                allRequests={allRequests}
              />
            }
          />
          <Route
            path="/quotes"
            element={<PageWrapper Component={QuotesPage} />}
          />
          <Route
            path="/my-requests"
            element={
              <PageWrapper
                Component={MyRequestsPage}
                allRequests={allRequests}
                setAllRequests={setAllRequests}
              />
            }
          />
          <Route
            path="/providers"
            element={<PageWrapper Component={ProvidersPage} />}
          />
          <Route
            path="/admin"
            element={
              currentUser?.is_superuser ? (
                <PageWrapper
                  Component={AdminPage}
                  categories={categories}
                />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              <PageWrapper
                Component={AccountSettingsPage}
                currentUser={currentUser}
                onLogout={() => {
                  api.logout();
                  setIsAuthed(false);
                  setCurrentUser(null);
                }}
                onAccountDeleted={handleAccountDeleted}
              />
            }
          />
          <Route
            path="/worker-dashboard"
            element={
              <PageWrapper
                Component={WorkerDashboardPage}
                currentUser={currentUser}
              />
            }
          />
        </Routes>
      </Layout>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onAuthed={handleAuthed}
      />
    </BrowserRouter>
  );
};

export default App;