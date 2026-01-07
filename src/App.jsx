import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ProductProvider } from './context/ProductContext';
import AdminRoute from './components/common/AdminRoute';
import './styles/index.css';

// Lazy Imports (Keeps the initial load fast)
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login')); 
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const AdminPanel = lazy(() => import('./pages/admin/AdminPanel'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const RefundPolicy = lazy(() => import('./pages/RefundPolicy'));
const Contact = lazy(() => import('./pages/Contact'));
const ShippingPolicy = lazy(() => import('./pages/ShippingPolicy'));

function App() {
  // Note: We removed the global "isLoading" check here.
  // Why? So the website loads instantly. The 'PurchaseSection' 
  // handles its own loading state internally now.

  return (
    <AuthProvider>
      <CartProvider>
        <ProductProvider> {/* Provides product data to the whole app */}
          <Router>
            <div className="min-h-screen bg-warm-white">
              
              {/* This handles the loading of the page files themselves */}
              <Suspense fallback={
                <div className="min-h-screen flex items-center justify-center">
                  <div className="w-16 h-16 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                </div>
              }>
                <Routes>
                  {/* --- Public Routes --- */}
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/privacy-policy" element={<PrivacyPolicy />} />
                  <Route path="/terms-of-service" element={<TermsOfService />} />
                  <Route path="/refund-policy" element={<RefundPolicy />} />
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/shipping-policy" element={<ShippingPolicy />} />
                  
                  {/* --- Protected Routes --- */}
                  <Route path="/dashboard" element={<UserDashboard />} />
                  
                  {/* Admin Route */}
                  <Route 
                    path="/admin"
                    element={
                      <AdminRoute>
                        <AdminPanel />
                      </AdminRoute>
                    } 
                  />
                </Routes>
              </Suspense>
            </div>
          </Router>
        </ProductProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;