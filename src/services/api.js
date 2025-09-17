// src/services/api.js

// Import the new modular API services
import { authAPI } from './api/auth';
import { productsAPI } from './api/products';
import { ordersAPI } from './api/orders';

const API_BASE_URL = '/api'; // Use the proxy

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth token without content-type
  getAuthHeader() {
    const token = localStorage.getItem('authToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    // Set default headers for JSON, but allow them to be overridden
    const headers = {
      'Content-Type': 'application/json',
      ...this.getAuthHeader(),
      ...options.headers,
    };

    const config = {
      ...options,
      headers,
    };
    
    // If body is FormData, let the browser set the Content-Type
    if (options.body instanceof FormData) {
      delete config.headers['Content-Type'];
    }

    try {
      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      return data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(userData) {
    return this.request('/auth/register', { method: 'POST', body: JSON.stringify(userData) });
  }

  async login(credentials) {
    return this.request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) });
  }
  
  // Public product methods
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  // Order methods
  async createOrder(orderData) {
    return this.request('/orders', { method: 'POST', body: JSON.stringify(orderData) });
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;