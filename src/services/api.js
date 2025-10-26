import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests if available
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

const api = {
  // Auth
  login: (email, password) => {
    const body = new URLSearchParams({ username: email, password }).toString();
    return axiosInstance.post('/auth/login', body, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
  },
  register: (data) => axiosInstance.post('/auth/register', data),
  
  // Requests
  getRequests: (params) => axiosInstance.get('/requests', { params }),
  createRequest: (data) => axiosInstance.post('/requests', data),
  getRequestById: (id) => axiosInstance.get(`/requests/${id}`),
  updateRequest: (id, data) => axiosInstance.put(`/requests/${id}`, data),
  deleteRequest: (id) => axiosInstance.delete(`/requests/${id}`),

  // Providers
  getProviders: (params) => axiosInstance.get('/providers', { params }),
  getProviderById: (id) => axiosInstance.get(`/providers/${id}`),
  createProvider: (data) => axiosInstance.post('/providers', data),
  updateProvider: (id, data) => axiosInstance.put(`/providers/${id}`, data),

  // Quotes
  getQuotes: (params) => axiosInstance.get('/quotes', { params }),
  createQuote: (data) => axiosInstance.post('/quotes', data),
  acceptQuote: (id) => axiosInstance.post(`/quotes/${id}/accept`),
  rejectQuote: (id) => axiosInstance.post(`/quotes/${id}/reject`),

  // Categories
  getCategories: (params) => axiosInstance.get('/categories', { params }),
  getCategoryById: (id) => axiosInstance.get(`/categories/${id}`),
};

export default api;