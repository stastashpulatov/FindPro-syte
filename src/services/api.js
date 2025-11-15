import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Request interceptor - добавляем токен
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - обработка ошибок
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Если 401 и это не запрос на логин/регистрацию
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      // Пытаемся обновить токен
      try {
        const response = await axiosInstance.post('/auth/refresh-token');
        const { access_token } = response.data;
        
        localStorage.setItem('token', access_token);
        axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
        originalRequest.headers['Authorization'] = `Bearer ${access_token}`;
        
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        // Если обновление не удалось, удаляем токен и редиректим на логин
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/';
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

const api = {
  // ==================== Auth ====================

  login: (data) => {
    // FastAPI OAuth2PasswordRequestForm expects form-data with username and password
    const formData = new URLSearchParams();
    formData.append('username', data.email || data.username);
    formData.append('password', data.password);

    return axiosInstance.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });
  },

  register: (data) => axiosInstance.post('/auth/register', data),

  verifyToken: () => axiosInstance.post('/auth/verify-token'),

  refreshToken: () => axiosInstance.post('/auth/refresh-token'),

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return axiosInstance.post('/auth/logout').catch(() => {});
  },

  recoverPassword: (email) => 
    axiosInstance.post(`/auth/password-recovery/${email}`),

  resetPassword: (data) => 
    axiosInstance.post('/auth/reset-password', data),

  // ==================== Users ====================
  
  getCurrentUser: () => axiosInstance.get('/users/me'),

  updateCurrentUser: (data) => axiosInstance.put('/users/me', data),

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
};

// Экспорт для использования в компонентах
export default api;

// Дополнительный экспорт инстанса для прямого использования
export { axiosInstance };