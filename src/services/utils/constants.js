// Application constants
export const ORDER_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled'
};

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded'
};

export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

export const PRODUCT_CATEGORIES = {
  MEN: 'men',
  WOMEN: 'women',
  UNISEX: 'unisex',
  SHOES: 'shoes',
  ACCESSORIES: 'accessories'
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout'
  },
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
    CREATE: '/products',
    UPDATE: '/products/:id',
    DELETE: '/products/:id'
  },
  ORDERS: {
    CREATE: '/orders',
    GET_USER_ORDERS: '/orders',
    GET_ALL_ORDERS: '/orders/admin/all',
    UPDATE_STATUS: '/orders/:id/status'
  }
};

export const LOCAL_STORAGE_KEYS = {
  AUTH_TOKEN: 'authToken',
  USER: 'user',
  CART: 'cart'
};