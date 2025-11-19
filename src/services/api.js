import axios from 'axios';

// Умное определение API URL для работы везде
const getApiUrl = () => {
  // 1. Проверяем переменную окружения (для production build)
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  // 2. Если в браузере - используем текущий домен
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname;
    
    // Для локальной разработки
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return 'http://localhost:8000/api/v1';
    }
    
    // Для production (coolbola.uz)
    return `${protocol}//${hostname}/api/v1`;
  }

  // 3. Fallback
  return 'http://localhost:8000/api/v1';
};

const API_URL = getApiUrl();

console.log('🔗 API URL:', API_URL); // Для отладки

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 секунд для медленного хостинга
  withCredentials: false, // Важно для CORS
});

// Request interceptor - добавляем токен
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Логируем для отладки
    console.log('📤 Request:', config.method.toUpperCase(), config.url);
    
    return config;
  },
  (error) => {
    console.error('❌ Request error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('✅ Response:', response.config.url, response.status);
    return response;
  },
  async (error) => {
    console.error('❌ Response error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.message,
      data: error.response?.data
    });

    const originalRequest = error.config;

    // Если 401 и это не запрос на логин/регистрацию
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Если это запрос логина/регистрации - не пытаемся обновить токен
      if (originalRequest.url?.includes('/auth/login') || 
          originalRequest.url?.includes('/auth/register')) {
        return Promise.reject(error);
      }

      // Очищаем токен и редиректим
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      return Promise.reject(error);
    }

    return Promise.reject(error);
  }
);

const api = {
  // ==================== Auth ====================
  
  login: (data) => {
    const headers = {};
    if (typeof URLSearchParams !== 'undefined' && data instanceof URLSearchParams) {
      headers['Content-Type'] = 'application/x-www-form-urlencoded';
    }
    return axiosInstance.post('/auth/login', data, { headers });
  },

  register: (data) => axiosInstance.post('/auth/register', data),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return Promise.resolve();
  },

  recoverPassword: (email) => 
    axiosInstance.post(`/auth/password-recovery/${email}`),

  // ==================== Users ====================
  
  getCurrentUser: () => axiosInstance.get('/users/me'),

  updateCurrentUser: (data) => axiosInstance.put('/users/me', data),
  
  deleteAccount: () => axiosInstance.delete('/users/me'),

  getAllUsers: (params) => axiosInstance.get('/users', { params }),

  getUserById: (id) => axiosInstance.get(`/users/${id}`),

  // ==================== Requests ====================
  
  getRequests: (params) => axiosInstance.get('/requests', { params }),

  createRequest: (data) => axiosInstance.post('/requests', data),

  getRequestById: (id) => axiosInstance.get(`/requests/${id}`),

  updateRequest: (id, data) => axiosInstance.put(`/requests/${id}`, data),

  deleteRequest: (id) => axiosInstance.delete(`/requests/${id}`),

  // ==================== Providers ====================
  
  getProviders: (params) => axiosInstance.get('/providers', { params }),

  getProviderById: (id) => axiosInstance.get(`/providers/${id}`),

  getMyProvider: () => axiosInstance.get('/providers/me'),

  createProvider: (data) => axiosInstance.post('/providers', data),

  updateProvider: (id, data) => axiosInstance.put(`/providers/${id}`, data),

  deleteProvider: (id) => axiosInstance.delete(`/providers/${id}`),

  // ==================== Quotes ====================
  
  getQuotes: (params) => axiosInstance.get('/quotes', { params }),

  createQuote: (data) => axiosInstance.post('/quotes', data),

  getQuoteById: (id) => axiosInstance.get(`/quotes/${id}`),

  updateQuote: (id, data) => axiosInstance.put(`/quotes/${id}`, data),

  acceptQuote: (id) => axiosInstance.post(`/quotes/${id}/accept`),

  rejectQuote: (id) => axiosInstance.post(`/quotes/${id}/reject`),

  // ==================== Categories ====================
  
  getCategories: (params) => axiosInstance.get('/categories', { params }),

  getCategoryById: (id) => axiosInstance.get(`/categories/${id}`),

  createCategory: (data) => axiosInstance.post('/categories', data),

  updateCategory: (id, data) => axiosInstance.put(`/categories/${id}`, data),

  deleteCategory: (id) => axiosInstance.delete(`/categories/${id}`),

  // ==================== Helpers ====================
  
  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },

  getStoredUser: () => {
    try {
      const user = localStorage.getItem('user');
      return user ? JSON.parse(user) : null;
    } catch {
      return null;
    }
  },

  setStoredUser: (user) => {
    localStorage.setItem('user', JSON.stringify(user));
  },

  // ==================== Health Check ====================
  
  healthCheck: () => axiosInstance.get('/health').catch(() => 
    axios.get(`${API_URL.replace('/api/v1', '')}/health`)
  ),
};

export default api;
export { axiosInstance, API_URL };