import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = {
  // Requests
  getRequests: () => axios.get(`${API_URL}/requests`),
  createRequest: (data) => axios.post(`${API_URL}/requests`, data),
  getRequestById: (id) => axios.get(`${API_URL}/requests/${id}`),
  updateRequest: (id, data) => axios.put(`${API_URL}/requests/${id}`, data),
  deleteRequest: (id) => axios.delete(`${API_URL}/requests/${id}`),

  // Providers
  getProviders: () => axios.get(`${API_URL}/providers`),
  getProviderById: (id) => axios.get(`${API_URL}/providers/${id}`),
  createProvider: (data) => axios.post(`${API_URL}/providers`, data),

  // Quotes
  getQuotes: (requestId) => axios.get(`${API_URL}/quotes/${requestId}`),
  createQuote: (data) => axios.post(`${API_URL}/quotes`, data),
  acceptQuote: (id) => axios.put(`${API_URL}/quotes/${id}/accept`),

  // Categories
  getCategories: () => axios.get(`${API_URL}/categories`),
};

export default api;