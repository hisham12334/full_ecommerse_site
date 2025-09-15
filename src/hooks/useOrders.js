import { useState, useEffect } from 'react';
import { ordersAPI } from '../services/api/orders';
import { useAuth } from './useAuth';

export const useOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('authToken');
      const data = await ordersAPI.getUserOrders(token);
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const createOrder = async (orderData) => {
    try {
      const token = localStorage.getItem('authToken');
      const result = await ordersAPI.create(orderData, token);
      await fetchOrders(); // Refresh orders list
      return result;
    } catch (err) {
      throw new Error(err.message);
    }
  };

  return {
    orders,
    loading,
    error,
    createOrder,
    refetch: fetchOrders
  };
};