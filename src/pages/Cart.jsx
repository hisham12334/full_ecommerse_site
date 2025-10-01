import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Button from '../components/common/Button';

export default function Cart() {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, getCartTotal, clearCart } = useCart();
  const navigate = useNavigate();
  
  const subtotal = getCartTotal();
  const shipping = subtotal >= 999 ? 0 : 99;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               <Link to="/" className="font-bold text-xl tracking-wide text-action-black">Brand</Link>
            </div>
          </div>
        </header>

        {/* Empty cart */}
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Basket is Empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything to your basket yet.</p>
          <Button onClick={() => navigate('/')} size="lg">Continue Shopping</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
               <Link to="/" className="font-bold text-xl tracking-wide text-action-black">Brand</Link>
            </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-extrabold text-action-black">Your Basket</h1>
          <button
            onClick={clearCart}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Clear Basket
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Cart Items */}
          <div className="md:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.key}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0, x: -50 }}
                className="flex gap-4 p-4 bg-white border border-gray-200"
              >
                <img
                  src={(item.images && item.images[0]) || item.image}
                  alt={item.title}
                  className="w-24 h-24 object-cover"
                />
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900">{item.title}</h3>
                    <p className="text-sm text-gray-500">
                      {item.selectedSize && `Size: ${item.selectedSize}`} 
                      {item.selectedSize && item.selectedColor && ` / `}
                      {item.selectedColor && `Color: ${item.selectedColor}`}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center border border-gray-300">
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity - 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.key, item.quantity + 1)}
                        className="px-2 py-1 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(item.key)}
                      className="text-red-600 hover:underline text-sm font-medium"
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-md">₹{(item.price * item.quantity).toLocaleString()}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="md:col-span-1 sticky top-24">
            <div className="bg-white p-6 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4 border-b pb-2">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Shipping</span>
                  <span>₹{shipping}</span>
                </div>
                <div className="border-t border-gray-200 pt-3 mt-3">
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <Button
                  onClick={() => {
                      if (!user) {
                        alert('Please sign in to proceed to checkout');
                        return;
                      }
                      navigate('/checkout');
                  }}
                  className="w-full"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
