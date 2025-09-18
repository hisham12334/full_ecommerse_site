import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function Home({ products = [], heroImageUrl, brandLogoUrl }) {
  const topProducts = products.slice(0, 6);
  const { items, addToCart, getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const handleQuickAdd = (product) => {
    // If product has variants, don't quick-add, force navigation to details page
    if (product.sizes && product.sizes.length > 0) {
      // This button should be disabled, but we'll add a check just in case.
      return;
    }
    
    addToCart(product);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 antialiased">
      {/* Top nav */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <button className="p-2 md:hidden" aria-label="open menu">
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-700">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div className="flex items-center gap-3">
                {brandLogoUrl ? (
                  <img src={brandLogoUrl} alt="brand logo" className="h-7 w-auto object-contain" />
                ) : (
                  <Link to="/" className="font-medium text-lg tracking-wide">Brand</Link>
                )}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-sm font-medium hover:underline">Women</Link>
              <Link to="/" className="text-sm font-medium hover:underline">Men</Link>
              <Link to="/" className="text-sm font-medium hover:underline">New</Link>
            </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-md hover:bg-gray-100" aria-label="search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>
              
              {/* User Account */}
              <div className="relative">
                {user ? (
                  <button 
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="p-2 rounded-md hover:bg-gray-100 flex items-center gap-2"
                  >
                    <img src={user.avatar} alt="avatar" className="w-6 h-6 rounded-full" />
                    <span className="hidden md:block text-sm">{user.name}</span>
                  </button>
                ) : (
                  <button 
                    onClick={() => setShowAuthModal(true)}
                    className="p-2 rounded-md hover:bg-gray-100" 
                    aria-label="account"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="1.5" />
                    </svg>
                  </button>
                )}
                
                {/* User Menu Dropdown */}
                {showUserMenu && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      {user.email}
                    </div>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Profile
                    </button>
                    <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                      Orders
                    </button>
                    <button 
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* Shopping Cart */}
              <Link to="/cart" className="p-2 rounded-md hover:bg-gray-100 relative" aria-label="bag">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2h12l1 5H5l1-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7h12v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {getCartItemsCount() > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {getCartItemsCount()}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main className="w-full min-h-screen">
        <section className="relative grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-1 gap-6 p-3">
          <div className="relative overflow-hidden rounded-md">
            <div className="aspect-[3/2] sm:aspect-[3/1] w-full bg-gray-50">
              {heroImageUrl ? (
                <img src={heroImageUrl} alt="hero" className="w-full h-full object-cover object-center" />
              ) : (
                <div className="w-full h-full bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 flex items-center justify-center">
                  <div className="text-center text-white">
                    <h2 className="text-2xl font-bold mb-2">Welcome to Our Store</h2>
                    <p className="text-gray-300">Discover amazing products</p>
                  </div>
                </div>
              )}
            </div>

            {/* Overlay text */}
            <div className="absolute inset-0 flex flex-col justify-end pb-8 px-6 sm:pb-12">
              <motion.h1
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="text-white text-4xl sm:text-6xl font-extrabold leading-tight drop-shadow-lg"
                style={{ textShadow: '0 6px 18px rgba(0,0,0,0.4)' }}
              >
                New Arrivals
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4"
              >
                <Link
                  to="#women"
                  className="inline-block bg-white/95 text-gray-900 px-6 py-3 rounded-sm font-semibold mr-3 shadow-sm hover:opacity-95"
                >
                  Shop Women
                </Link>
                <Link
                  to="#men"
                  className="inline-block bg-white/30 text-white px-6 py-3 rounded-sm font-semibold hover:opacity-95"
                >
                  Shop Men
                </Link>
              </motion.div>
            </div>
          </div>

          {/* Secondary band */}
          <div className="mt-4 sm:mt-0">
            <div className="aspect-[3/1] w-full bg-gray-100 rounded-md overflow-hidden flex items-center justify-center">
              <div className="w-full h-full flex items-center justify-center">
                <div className="max-w-2xl text-center p-6">
                  <p className="text-lg sm:text-xl font-medium text-gray-700">Free delivery on orders above ₹999</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Promo tiles */}
        <section className="mt-8 grid grid-cols-2 gap-4 px-2 sm:px-0">
          <div className="block rounded-md border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md cursor-pointer">
            <h3 className="text-sm font-semibold text-gray-800">New here?</h3>
            <p className="mt-2 text-xs text-gray-500">Get 10% off your first order</p>
          </div>
          <div className="block rounded-md border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md cursor-pointer">
            <h3 className="text-sm font-semibold text-gray-800">Download our app</h3>
            <p className="mt-2 text-xs text-gray-500">For exclusive drops and offers</p>
          </div>
        </section>

        {/* Products Grid */}
        <section id="women" className="mt-10">
          <div className="flex items-center justify-between mb-4 px-2 sm:px-0">
            <h2 className="text-2xl font-semibold">Featured Products</h2>
            <Link to="/" className="text-sm text-gray-600 hover:underline">View all</Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {topProducts.length === 0 ? (
              Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="rounded-md bg-white border border-gray-100 shadow-sm overflow-hidden">
                  <div className="aspect-square bg-gray-50 flex items-center justify-center">Image</div>
                  <div className="p-3">
                    <div className="h-4 bg-gray-100 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-100 rounded w-1/3"></div>
                  </div>
                </div>
              ))
            ) : (
              topProducts.map((product) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: product.id * 0.1 }}
                  className="group relative rounded-md bg-white border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <Link to={`/product/${product.id}`}>
                    <img 
                      src={product.image} 
                      alt={product.title} 
                      className="w-full h-56 object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  </Link>
                  
                  {/* Quick Add Button */}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleQuickAdd(product);
                    }}
                    disabled={!!product.variants.length}
                    className={`absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-opacity duration-200
                      ${!!product.variants.length ? 'opacity-0' : 'opacity-100 group-hover:opacity-100'}`}
                    aria-label="Quick add to cart"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </button>

                  <div className="p-3">
                    <Link to={`/product/${product.id}`}>
                      <div className="font-medium text-sm text-gray-800 group-hover:text-black transition-colors">
                        {product.title}
                      </div>
                      <div className="mt-1 text-xs text-gray-500">₹{product.price.toLocaleString()}</div>
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-100 py-8">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-gray-600">
            <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
              <div>© {new Date().getFullYear()} Brand. All rights reserved.</div>
              <div className="flex gap-4">
                <Link to="/" className="hover:underline">Contact</Link>
                <Link to="/" className="hover:underline">Careers</Link>
                <Link to="/" className="hover:underline">Privacy</Link>
              </div>
            </div>
          </div>
        </footer>
      </main>

      {/* Auth Modal */}
      {showAuthModal && (
        <AuthModal 
          mode={authMode} 
          setMode={setAuthMode}
          onClose={() => setShowAuthModal(false)} 
        />
      )}
    </div>
  );
}

// Auth Modal Component
function AuthModal({ mode, setMode, onClose }) {
  const { login, register, isLoading } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      let result;
      if (mode === 'login') {
        result = await login(formData.email, formData.password);
      } else {
        result = await register(formData.name, formData.email, formData.password);
      }

      if (result.success) {
        onClose();
      } else {
        setError(result.error);
      }
    } catch (err) {
      setError('Something went wrong. Please try again.');
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg max-w-md w-full p-6"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {mode === 'login' ? 'Sign In' : 'Create Account'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                required
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
              required
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm">{error}</div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${
              isLoading
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800'
            }`}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {mode === 'login' ? 'Signing in...' : 'Creating account...'}
              </div>
            ) : (
              mode === 'login' ? 'Sign In' : 'Create Account'
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            {mode === 'login' 
              ? "Don't have an account? Sign up" 
              : 'Already have an account? Sign in'
            }
          </button>
        </div>
      </motion.div>
    </div>
  );
}