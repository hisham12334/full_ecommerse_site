import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const fetchedProducts = await apiService.getProducts();
      setProducts(fetchedProducts);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('Failed to load products. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const value = { products, isLoading, error, refreshProducts: fetchProducts };

  return (
    <ProductContext.Provider value={value}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductsContext = () => {
  return useContext(ProductContext);
};