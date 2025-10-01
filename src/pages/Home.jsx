import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import HeroSection from "../components/common/HeroSection";

export default function Home({ products = [], heroImages = [], brandLogoUrl }) {
  const topProducts = products.slice(0, 6);
  const marqueeText = "FREE DELIVERY ON ORDERS ABOVE ₹999 • PREMIUM QUALITY • FW24 COLLECTION • ";
  const { items, addToCart, getCartItemsCount } = useCart();
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' or 'register'

  const handleQuickAdd = (product) => {
    if (product.sizes && product.sizes.length > 0) {
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
              <button 
                onClick={() => setShowMobileMenu(!showMobileMenu)}
                className="p-2 md:hidden hover:bg-red-500/20 rounded-md transition-colors" 
                aria-label="open menu"
              >
                <svg width="24" height="24" fill="none" viewBox="0 0 24 24" className="text-gray-900">
                  <path d="M4 6h16M4 12h16M4 18h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              
            </div>

            <div className="flex items-center gap-3">
                {brandLogoUrl ? (
                  <img src={brandLogoUrl} alt="brand logo" className="h-7 w-auto object-contain" />
                ) : (
                  <Link to="/" className="font-medium text-lg tracking-wide">DripKult</Link>
                )}
              </div>

            <div className="flex items-center gap-4">
              <button className="p-2 rounded-md hover:bg-gray-100" aria-label="search">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </button>

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

                {showUserMenu && user && (
                  <div className="absolute right-0 mt-2 w-48 bg-black border border-red-500/30 rounded-md shadow-xl py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-300 border-b border-red-500/20">
                      {user.email}
                    </div>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/20 font-bold uppercase tracking-wider transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link 
                      to="/dashboard" 
                      onClick={() => setShowUserMenu(false)}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/20 font-bold uppercase tracking-wider transition-colors"
                    >
                      Orders
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setShowUserMenu(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-white hover:bg-red-500/20 font-bold uppercase tracking-wider transition-colors"
                    >
                      Sign Out
                    </button>
                  </div>
                )}
              </div>

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

      {/* Mobile Menu */}
      {showMobileMenu && (
        <>
          {/* Overlay */}
          <div 
            className="fixed inset-0 bg-black/50 z-20 md:hidden"
            onClick={() => setShowMobileMenu(false)}
          ></div>
          
          {/* Mobile Menu Content */}
          <div className="md:hidden bg-white border-b border-red-500/30 z-30 relative shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {/* Navigation Links */}
            <div className="space-y-2">
              <Link 
                to="/" 
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
              >
                Home
              </Link>
              <Link 
                to="/" 
                onClick={() => setShowMobileMenu(false)}
                className="block px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
              >
                New Arrivals
              </Link>
            </div>

            {/* User Section */}
            {user ? (
              <div className="border-t border-red-500/20 pt-4 mt-4">
                <div className="px-4 py-2 text-sm text-gray-600 border-b border-red-500/20 mb-2">
                  {user.email}
                </div>
                <Link 
                  to="/dashboard" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
                >
                  Dashboard
                </Link>
                <Link 
                  to="/dashboard" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
                >
                  Orders
                </Link>
                <Link 
                  to="/cart" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
                >
                  Cart ({getCartItemsCount()})
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="border-t border-red-500/20 pt-4 mt-4">
                <button 
                  onClick={() => {
                    setShowAuthModal(true);
                    setShowMobileMenu(false);
                  }}
                  className="block w-full text-left px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
                >
                  Sign In
                </button>
                <Link 
                  to="/cart" 
                  onClick={() => setShowMobileMenu(false)}
                  className="block px-4 py-3 text-gray-900 hover:bg-red-500/10 hover:text-red-600 font-bold uppercase tracking-wider transition-colors rounded-md"
                >
                  Cart ({getCartItemsCount()})
                </Link>
              </div>
            )}
          </div>
        </div>
        </>
      )}

      <main className="w-full min-h-screen bg-gray-50 overflow-hidden">
        <HeroSection heroImages={heroImages} />

        <section className="py-4 bg-gray-50 border-y border-gray-200 overflow-hidden">
          <motion.div
            className="flex whitespace-nowrap"
            initial={{ x: "0%" }}
            animate={{ x: "-100%" }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          >
            <span className="text-xl font-semibold text-gray-900 px-4">{marqueeText}</span>
            <span className="text-xl font-semibold text-gray-900 px-4">{marqueeText}</span>
            <span className="text-xl font-semibold text-gray-900 px-4">{marqueeText}</span>
          </motion.div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-4 px-2  sm:px-0 ">
          <div className="block rounded-md border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md active:shadow-lg active:scale-95 cursor-pointer transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800">New here?</h3>
            <p className="mt-2 text-xs text-gray-500">Get 10% off your first order</p>
          </div>
          <div className="block rounded-md border border-gray-100 p-6 bg-white shadow-sm hover:shadow-md active:shadow-lg active:scale-95 cursor-pointer transition-all duration-200">
            <h3 className="text-sm font-semibold text-gray-800">Download our app</h3>
            <p className="mt-2 text-xs text-gray-500">For exclusive drops and offers</p>
          </div>
        </section>

        <section
          id="featured-products"
          className="relative mt-16 overflow-hidden" // Use overflow-hidden on the container
        >
          {/* This is the new, isolated background element */}
          <div
            className="absolute inset-0 bg-brand-red-light [clip-path:polygon(0_10%,_100%_0,_100%_100%,_0%_100%)] z-0"
            aria-hidden="true"
          ></div>

          {/* The content now sits on top and is not affected by the clip-path */}
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-16 sm:pt-40 sm:pb-24 text-white">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                /Featured Products
              </h2>
              <p className="mt-4 text-xl opacity-80">
                Discover our latest collection of high-quality apparel.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4 lg:gap-y-12">
              {topProducts.length === 0 ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="group relative">
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-red-400">
                      <div className="h-full w-full bg-red-500"></div>
                    </div>
                    <div className="mt-4">
                      <div className="h-4 bg-red-400 rounded w-3/4 mb-2"></div>
                      <div className="h-4 bg-red-400 rounded w-1/3"></div>
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
                    className="group relative transition-transform duration-300 hover:scale-[1.02] active:scale-[1.02] cursor-pointer"
                  >
                    <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-100">
                      <Link to={`/product/${product.id}`}>
                        <img
                          src={(product.images && product.images[0]) || product.image || ''}
                          alt={product.title}
                          className="h-full w-full object-cover object-center transition-transform duration-300 group-hover:scale-110 group-active:scale-110 touch-manipulation"
                        />
                      </Link>
                    </div>
                    <div className="mt-4 flex justify-between">
                      <div>
                        <h3 className="text-sm">
                          <Link to={`/product/${product.id}`}>
                            <span aria-hidden="true" className="absolute inset-0" />
                            {product.title}
                          </Link>
                        </h3>
                      </div>
                      <p className="text-sm font-medium">₹{product.price.toLocaleString()}</p>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </section>

        {/* Red Background Section to Fill Gap */}
        <section className="bg-brand-red py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white uppercase tracking-wider mb-4">
                Join the Movement
              </h3>
              <p className="text-white/80 text-lg">
                Be part of the streetwear revolution
              </p>
            </div>
          </div>
        </section>

        <footer className="border-t bg-brand-red border-brand-red py-8">
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
            className={`w-full py-2 px-4 rounded-md font-semibold transition-colors ${isLoading
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