import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import apiService from './services/api';
import './styles/index.css';

function App() {
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products on app startup
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setIsLoading(true);
        const fetchedProducts = await apiService.getProducts();
        setProducts(fetchedProducts);
        setError(null);
      } catch (error) {
        console.error('Failed to fetch products:', error);
        setError('Failed to load products. Please try again later.');
        
        // Fallback to sample data if API fails
        setProducts([
          { 
            id: 1, 
            title: "Cotton Shirt", 
            price: 799, 
            image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=500&fit=crop",
            description: "A comfortable cotton shirt perfect for casual wear. Made with 100% organic cotton.",
            category: "men",
            sizes: ["S", "M", "L", "XL"],
            colors: ["White", "Blue", "Black"]
          },
          { 
            id: 2, 
            title: "Slim Fit Jeans", 
            price: 1299, 
            image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=500&fit=crop",
            description: "Modern slim fit jeans that offer comfort and style for everyday wear.",
            category: "men",
            sizes: ["28", "30", "32", "34", "36"],
            colors: ["Dark Blue", "Light Blue", "Black"]
          },
          { 
            id: 3, 
            title: "Sneakers", 
            price: 1999, 
            image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=500&fit=crop",
            description: "Comfortable and stylish sneakers perfect for daily activities.",
            category: "shoes",
            sizes: ["7", "8", "9", "10", "11"],
            colors: ["White", "Black", "Grey"]
          }
        ]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            {error && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{error}</p>
                  </div>
                </div>
              </div>
            )}
            
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    products={products}
                    heroImageUrl="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
                    brandLogoUrl=""
                  />
                } 
              />
              <Route 
                path="/product/:id" 
                element={<ProductDetails products={products} />} 
              />
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
            </Routes>
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;