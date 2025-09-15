// Legacy api.js - now using modular structure
// Import the new modular API services
import { authAPI } from './api/auth';
import { productsAPI } from './api/products';
import { ordersAPI } from './api/orders';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  // Helper method to get auth headers
  getAuthHeaders() {
    const token = localStorage.getItem('authToken');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

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

  // Auth methods - now using modular auth API
  async register(userData) {
    const response = await authAPI.register(userData);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  }

  async login(credentials) {
    const response = await authAPI.login(credentials);
    if (response.success && response.token) {
      localStorage.setItem('authToken', response.token);
    }
    return response;
  }

  logout() {
    authAPI.logout();
    localStorage.removeItem('authToken');
  }

  // Product methods - now using modular products API
  async getProducts() {
    return await productsAPI.getAll();
  }

  async getProduct(id) {
    return await productsAPI.getById(id);
  }

  // Order methods - now using modular orders API
  async createOrder(orderData) {
    const token = localStorage.getItem('authToken');
    return await ordersAPI.create(orderData, token);
  }

  async getOrders() {
    const token = localStorage.getItem('authToken');
    return await ordersAPI.getUserOrders(token);
  }

  // Health check
  async healthCheck() {
    return await this.request('/health');
  }
}

// Create singleton instance
const apiService = new ApiService();

export default apiService;

// Export the new modular APIs for direct use
export { authAPI, productsAPI, ordersAPI };