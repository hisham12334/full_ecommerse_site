import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import ProductDetails from './pages/ProductDetails';
import './styles/index.css';

function App() {
  const sampleProducts = [
    { 
      id: 1, 
      title: "Cotton Shirt", 
      price: 799, 
      image: "https://via.placeholder.com/300x400",
      description: "A comfortable cotton shirt perfect for casual wear. Made with 100% organic cotton.",
      category: "men",
      sizes: ["S", "M", "L", "XL"],
      colors: ["White", "Blue", "Black"]
    },
    { 
      id: 2, 
      title: "Slim Fit Jeans", 
      price: 1299, 
      image: "https://via.placeholder.com/300x400",
      description: "Modern slim fit jeans that offer comfort and style for everyday wear.",
      category: "men",
      sizes: ["28", "30", "32", "34", "36"],
      colors: ["Dark Blue", "Light Blue", "Black"]
    },
    { 
      id: 3, 
      title: "Sneakers", 
      price: 1999, 
      image: "https://via.placeholder.com/300x400",
      description: "Comfortable and stylish sneakers perfect for daily activities.",
      category: "shoes",
      sizes: ["7", "8", "9", "10", "11"],
      colors: ["White", "Black", "Grey"]
    },
    { 
      id: 4, 
      title: "Summer Dress", 
      price: 1499, 
      image: "https://via.placeholder.com/300x400",
      description: "Light and airy summer dress perfect for warm weather occasions.",
      category: "women",
      sizes: ["XS", "S", "M", "L", "XL"],
      colors: ["Floral", "Solid Blue", "White"]
    },
    { 
      id: 5, 
      title: "Casual T-Shirt", 
      price: 599, 
      image: "https://via.placeholder.com/300x400",
      description: "Basic cotton t-shirt that's perfect for layering or wearing alone.",
      category: "unisex",
      sizes: ["S", "M", "L", "XL", "XXL"],
      colors: ["White", "Black", "Grey", "Navy"]
    },
    { 
      id: 6, 
      title: "Denim Jacket", 
      price: 2999, 
      image: "https://via.placeholder.com/300x400",
      description: "Classic denim jacket that never goes out of style. Perfect for layering.",
      category: "unisex",
      sizes: ["S", "M", "L", "XL"],
      colors: ["Light Denim", "Dark Denim", "Black"]
    }
  ];

  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="min-h-screen bg-white">
            <Routes>
              <Route 
                path="/" 
                element={
                  <Home 
                    products={sampleProducts}
                    heroImageUrl="https://via.placeholder.com/1200x600"
                    brandLogoUrl=""
                  />
                } 
              />
              <Route 
                path="/product/:id" 
                element={<ProductDetails products={sampleProducts} />} 
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