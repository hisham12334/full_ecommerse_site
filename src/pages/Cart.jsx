import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProductsContext } from '../context/ProductContext';
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, AlertCircle } from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { products } = useProductsContext();
  const navigate = useNavigate();
  const [stockErrors, setStockErrors] = useState([]);
  const [checkingStock, setCheckingStock] = useState(false);
  
  // Check stock availability whenever cart items or products change
  useEffect(() => {
    const checkStockAvailability = () => {
      if (items.length === 0 || products.length === 0) {
        setStockErrors([]);
        setCheckingStock(false);
        return;
      }

      setCheckingStock(true);
      const stockIssues = [];

      for (const item of items) {
        console.log('Checking stock for cart item:', item);
        
        // Find the product from the products context
        const product = products.find(p => p.id === item.id);
        console.log('Found product:', product);
        
        if (!product) {
          console.warn(`Product not found for ${item.title}`);
          continue;
        }
        
        // Find the variant
        const variant = product.variants?.find(v => v.id === item.variant_id);
        console.log('Found variant:', variant, 'for variant_id:', item.variant_id);
        
        if (!variant) {
          console.warn(`No variant found for ${item.title}`);
          stockIssues.push({
            key: item.key,
            title: item.title,
            requested: item.quantity,
            available: 0
          });
        } else if (variant.stock < item.quantity) {
          console.warn(`Insufficient stock for ${item.title}: requested ${item.quantity}, available ${variant.stock}`);
          stockIssues.push({
            key: item.key,
            title: item.title,
            requested: item.quantity,
            available: variant.stock
          });
        } else {
          console.log(`Stock OK for ${item.title}: requested ${item.quantity}, available ${variant.stock}`);
        }
      }
      
      console.log('Final stock issues:', stockIssues);
      setStockErrors(stockIssues);
      setCheckingStock(false);
    };

    checkStockAvailability();
  }, [items, products]);

  // Safety: Ensure calculations don't crash
  const subtotal = getCartTotal ? getCartTotal() : 0;
  const shipping = 0;
  const total = subtotal + shipping;

  // Safety: Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  if (safeItems.length === 0) {
    return (
      <div className="min-h-screen bg-warm-white flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <ShoppingBag className="w-16 h-16 text-warm-grey mx-auto mb-6 opacity-50" />
          <h1 className="font-serif text-3xl text-charcoal mb-4">Your Cart is Empty</h1>
          <p className="font-sans text-warm-grey mb-8">The collection awaits.</p>
          <button 
            onClick={() => navigate('/')} 
            className="border-b border-charcoal text-charcoal pb-1 hover:opacity-70 transition-opacity uppercase tracking-widest text-sm"
          >
            Return to Collection
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-warm-white pt-24 pb-12 px-4 sm:px-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="font-serif text-4xl text-charcoal mb-12">Your Selection</h1>

        {/* Stock Availability Warning */}
        {!checkingStock && stockErrors.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 bg-red-50 border-l-4 border-red-500 p-6 rounded-sm"
          >
            <div className="flex items-start gap-4">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-serif text-lg text-red-900 mb-2">Stock Unavailable</h3>
                <p className="font-sans text-sm text-red-800 mb-3">
                  Some items in your cart are out of stock or have insufficient quantity:
                </p>
                <ul className="space-y-2">
                  {stockErrors.map((error, index) => (
                    <li key={index} className="font-sans text-sm text-red-800 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                      <span>
                        <span className="font-semibold">{error.title}</span> - 
                        You requested {error.requested}, but only {error.available} available
                      </span>
                    </li>
                  ))}
                </ul>
                <p className="font-sans text-sm text-red-800 mt-3">
                  Please adjust quantities or remove unavailable items to proceed with checkout.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-8">
            <AnimatePresence>
              {safeItems.map((item, index) => {
                // Defensive Check: Skip bad items without crashing
                if (!item || !item.id) return null;

                // Safe Values
                const title = item.title || "Product";
                const price = parseFloat(item.price) || 0;
                const size = item.selectedSize || "N/A";
                const color = item.selectedColor || "Standard";
                const imgUrl = item.image || "/placeholder.svg";
                
                // Check if this item has stock issues
                const hasStockIssue = stockErrors.some(error => error.key === item.key);

                return (
                  <motion.div
                    key={item.key || `cart-item-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex gap-6 border-b pb-8 ${
                      hasStockIssue ? 'border-red-300 bg-red-50/30' : 'border-warm-grey/20'
                    }`}
                  >
                    <div className="w-24 h-32 bg-cool-white overflow-hidden rounded-sm flex-shrink-0">
                      <img
                        src={imgUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        onError={(e) => { e.target.style.display = 'none'; }}
                      />
                    </div>
                    
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start">
                          <div className="flex-1 pr-4">
                            <h3 className="font-serif text-xl text-charcoal leading-tight">{title}</h3>
                            {hasStockIssue && (
                              <span className="inline-flex items-center gap-1 mt-2 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                <AlertCircle className="w-3 h-3" />
                                Limited Stock
                              </span>
                            )}
                          </div>
                          <p className="font-mono text-sm text-charcoal whitespace-nowrap">
                            ₹{price.toLocaleString()}
                          </p>
                        </div>
                        <p className="font-sans text-sm text-warm-grey mt-2">
                          Size: {size} | {color}
                        </p>
                      </div>

                      <div className="flex justify-between items-end mt-4">
                        <div className="flex items-center gap-4 border border-warm-grey/30 px-3 py-1 bg-white">
                          <button 
                            onClick={() => updateQuantity(item.key, (item.quantity || 1) - 1)}
                            className="text-charcoal hover:text-warm-grey transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-sm w-4 text-center">{item.quantity || 1}</span>
                          <button 
                            onClick={() => updateQuantity(item.key, (item.quantity || 1) + 1)}
                            className="text-charcoal hover:text-warm-grey transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                        
                        <button
                          onClick={() => removeFromCart(item.key)}
                          className="text-warm-grey hover:text-red-400 transition-colors p-2"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-cool-white p-8 sticky top-24 border border-warm-grey/10 rounded-sm">
              <h2 className="font-serif text-2xl text-charcoal mb-6">Summary</h2>
              
              <div className="space-y-4 mb-8 font-sans text-sm">
                <div className="flex justify-between text-warm-grey">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-warm-grey">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Complimentary' : `₹${shipping}`}</span>
                </div>
                <div className="border-t border-warm-grey/20 pt-4 flex justify-between text-charcoal font-medium text-base">
                  <span>Total</span>
                  <span>₹{total.toLocaleString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                    if (stockErrors.length > 0) {
                      return;
                    }
                    if (!user) {
                      alert('Please sign in to complete your reservation.');
                      navigate('/login');
                      return;
                    }
                    navigate('/checkout');
                }}
                disabled={stockErrors.length > 0 || checkingStock}
                className={`w-full py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group text-sm font-medium ${
                  stockErrors.length > 0 || checkingStock
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                    : 'bg-charcoal text-white hover:bg-black'
                }`}
              >
                {checkingStock ? 'Checking Stock...' : stockErrors.length > 0 ? 'Resolve Stock Issues' : 'Proceed to Checkout'}
                {!checkingStock && stockErrors.length === 0 && (
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                )}
              </button>
              
              {stockErrors.length > 0 && (
                <p className="font-sans text-xs text-red-600 text-center mt-3">
                  Please update item quantities before checkout
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}