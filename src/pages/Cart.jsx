import React, { useEffect, useState, useMemo, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useProductsContext } from '../context/ProductContext';
import { Trash2, ArrowRight, Minus, Plus, ShoppingBag, AlertCircle } from 'lucide-react';

export default function Cart() {
  const { user } = useAuth();
  const { items, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { products, refreshProducts } = useProductsContext();
  const navigate = useNavigate();
  const [stockErrors, setStockErrors] = useState([]);
  const [checkingStock, setCheckingStock] = useState(false);
  const [stockLimitFeedback, setStockLimitFeedback] = useState(null);

  // Memoize safety check for items
  const safeItems = useMemo(() => Array.isArray(items) ? items : [], [items]);

  // Memoize validation parameters to prevent unnecessary effect triggers
  const cartItemsFingerprint = useMemo(() =>
    JSON.stringify(safeItems.map(item => ({ id: item.id, variant_id: item.variant_id, quantity: item.quantity }))),
    [safeItems]
  );

  // Use a ref to track the last validated fingerprint to avoid redundant runs
  const lastValidatedFingerprint = useRef(null);

  // Check stock availability whenever cart items or products change
  useEffect(() => {
    // If fingerprint hasn't changed, don't run validation
    if (cartItemsFingerprint === lastValidatedFingerprint.current) {
      return;
    }

    let retryCount = 0;
    const maxRetries = 2;
    const retryDelay = 1000; // 1 second
    const debounceDelay = 500; // 500ms debounce

    const checkStockAvailability = async () => {
      // Early return conditions with proper logging
      if (!Array.isArray(safeItems) || safeItems.length === 0) {
        // console.log('[Stock Validation] No items in cart, clearing stock errors');
        setStockErrors([]);
        setCheckingStock(false);
        lastValidatedFingerprint.current = cartItemsFingerprint;
        return;
      }

      if (!Array.isArray(products) || products.length === 0) {
        // console.log('[Stock Validation] Products not loaded yet, waiting...');
        setCheckingStock(true);
        return;
      }

      // console.log(`[Stock Validation] Starting validation for ${safeItems.length} cart items (attempt ${retryCount + 1}/${maxRetries + 1})`);
      setCheckingStock(true);

      try {
        const stockIssues = [];
        let validationErrors = [];

        for (const item of safeItems) {
          // Validate cart item structure
          if (!item?.id || !item?.variant_id) {
            // console.error('[Stock Validation] Cart item missing required fields:', item);
            validationErrors.push(`Item "${item.title || 'Unknown'}" missing required data`);
            continue;
          }

          // console.log(`[Stock Validation] Checking stock for: ${item.title} (ID: ${item.id}, Variant: ${item.variant_id})`);

          // Find the product with null/undefined safety
          const product = products.find(p => p && p.id === item.id);

          if (!product) {
            // console.warn(`[Stock Validation] Product not found for "${item.title}" (ID: ${item.id})`);
            stockIssues.push({
              key: item.key,
              title: item.title,
              requested: item.quantity || 0,
              available: 0
            });
            continue;
          }

          // console.log(`[Stock Validation] Found product: ${product.title} with ${product.variants?.length || 0} variants`);

          // Validate product variants structure
          if (!Array.isArray(product.variants)) {
            // console.error(`[Stock Validation] Product "${product.title}" has invalid variants structure:`, product.variants);
            stockIssues.push({
              key: item.key,
              title: item.title,
              requested: item.quantity || 0,
              available: 0
            });
            continue;
          }

          // Find the variant with proper validation
          const variant = product.variants.find(v => {
            if (!v || typeof v !== 'object') {
              // console.warn(`[Stock Validation] Invalid variant structure in product "${product.title}":`, v);
              return false;
            }
            return v.id === item.variant_id;
          });

          if (!variant) {
            // console.warn(`[Stock Validation] Variant not found for "${item.title}" (Variant ID: ${item.variant_id})`);
            // console.log(`[Stock Validation] Available variants:`, product.variants.map(v => ({ id: v?.id, size: v?.size, stock: v?.quantity || v?.stock })));
            stockIssues.push({
              key: item.key,
              title: item.title,
              requested: item.quantity || 0,
              available: 0
            });
            continue;
          }

          // Validate variant stock data (handle both 'stock' and 'quantity' fields)
          const availableStock = variant.stock ?? variant.quantity ?? 0;
          const requestedQuantity = item.quantity || 0;

          if (typeof availableStock !== 'number' || availableStock < 0) {
            // console.error(`[Stock Validation] Invalid stock data for "${item.title}":`, { variant, availableStock });
            validationErrors.push(`Invalid stock data for "${item.title}"`);
            continue;
          }

          if (availableStock < requestedQuantity) {
            // console.warn(`[Stock Validation] Insufficient stock for "${item.title}": requested ${requestedQuantity}, available ${availableStock}`);
            stockIssues.push({
              key: item.key,
              title: item.title,
              requested: requestedQuantity,
              available: availableStock
            });
          } else {
            // console.log(`[Stock Validation] ✓ Stock OK for "${item.title}": requested ${requestedQuantity}, available ${availableStock}`);
          }
        }

        // Handle validation errors
        if (validationErrors.length > 0) {
          // console.error(`[Stock Validation] Validation errors encountered:`, validationErrors);

          // If we have retries left and encountered errors, retry
          if (retryCount < maxRetries) {
            retryCount++;
            // console.log(`[Stock Validation] Retrying validation in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries + 1})`);
            setTimeout(() => checkStockAvailability(), retryDelay);
            return;
          } else {
            // console.error(`[Stock Validation] Max retries reached, proceeding with partial results`);
          }
        }

        // console.log(`[Stock Validation] Validation complete. Found ${stockIssues.length} stock issues:`, stockIssues);
        setStockErrors(stockIssues);
        setCheckingStock(false);
        lastValidatedFingerprint.current = cartItemsFingerprint;
        retryCount = 0; // Reset retry count on success

      } catch (error) {
        console.error('[Stock Validation] Unexpected error during stock validation:', error);

        // Retry on unexpected errors
        if (retryCount < maxRetries) {
          retryCount++;
          // console.log(`[Stock Validation] Retrying after error in ${retryDelay}ms (attempt ${retryCount + 1}/${maxRetries + 1})`);
          setTimeout(() => checkStockAvailability(), retryDelay);
          return;
        } else {
          // console.error(`[Stock Validation] Max retries reached after error, stopping validation`);
          setCheckingStock(false);
          // Keep existing stock errors rather than clearing them
        }
      }
    };

    // Implement debouncing
    const timer = setTimeout(() => {
      checkStockAvailability();
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [cartItemsFingerprint, products, safeItems]);

  // Handle quantity increase with stock validation
  const handleQuantityIncrease = async (item) => {
    // Refresh products to get latest stock from server
    await refreshProducts?.();

    // Find the product and variant to check available stock
    const product = products.find(p => p && p.id === item.id);
    if (!product) {
      console.warn(`[Quantity Update] Product not found for "${item.title}" (ID: ${item.id})`);
      setStockLimitFeedback({
        key: item.key,
        message: 'Product information not available',
        type: 'error'
      });
      setTimeout(() => setStockLimitFeedback(null), 3000);
      return;
    }

    const variant = product.variants?.find(v => v?.id === item.variant_id);
    if (!variant) {
      console.warn(`[Quantity Update] Variant not found for "${item.title}" (Variant ID: ${item.variant_id})`);
      setStockLimitFeedback({
        key: item.key,
        message: 'Product variant not available',
        type: 'error'
      });
      setTimeout(() => setStockLimitFeedback(null), 3000);
      return;
    }

    const availableStock = variant.stock ?? variant.quantity ?? 0;
    const currentQuantity = item.quantity || 1;
    const newQuantity = currentQuantity + 1;

    // Check if the increase would exceed available stock
    if (newQuantity > availableStock) {
      console.log(`[Quantity Update] Cannot increase quantity for "${item.title}": requested ${newQuantity}, available ${availableStock}`);

      // Show feedback about stock limit
      setStockLimitFeedback({
        key: item.key,
        message: availableStock === 0
          ? 'This item is out of stock'
          : `Only ${availableStock} available in stock`,
        type: 'warning',
        availableStock
      });

      // Clear feedback after 3 seconds
      setTimeout(() => setStockLimitFeedback(null), 3000);
      return;
    }

    // Proceed with quantity update
    console.log(`[Quantity Update] Increasing quantity for "${item.title}": ${currentQuantity} → ${newQuantity} (available: ${availableStock})`);
    updateQuantity(item.key, newQuantity);

    // Clear any existing feedback for this item
    if (stockLimitFeedback?.key === item.key) {
      setStockLimitFeedback(null);
    }
  };

  // Handle quantity decrease with real-time validation
  const handleQuantityDecrease = async (item) => {
    const currentQuantity = item.quantity || 1;
    if (currentQuantity <= 1) {
      removeFromCart(item.key);
      return;
    }

    const newQuantity = currentQuantity - 1;
    console.log(`[Quantity Update] Decreasing quantity for "${item.title}": ${currentQuantity} → ${newQuantity}`);

    // Proceed with update
    updateQuantity(item.key, newQuantity);

    // Refresh products to ensure validation stays in sync with backend
    await refreshProducts?.();

    // Clear any existing limit feedback when decreasing
    if (stockLimitFeedback?.key === item.key) {
      setStockLimitFeedback(null);
    }
  };

  // Memoize summary calculations for performance
  const summary = useMemo(() => {
    const subtotal = getCartTotal ? getCartTotal() : 0;
    const shipping = 0;
    const total = subtotal + shipping;
    return { subtotal, shipping, total };
  }, [items, getCartTotal]);

  const { subtotal, shipping, total } = summary;

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
            className="mb-8"
          >
            {/* Categorize stock errors */}
            {(() => {
              const outOfStock = stockErrors.filter(error => error.available === 0);
              const limitedStock = stockErrors.filter(error => error.available > 0);

              return (
                <div className="space-y-4">
                  {/* Out of Stock Items */}
                  {outOfStock.length > 0 && (
                    <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-sm">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-serif text-lg text-red-900 mb-2">Out of Stock</h3>
                          <p className="font-sans text-sm text-red-800 mb-3">
                            The following items are currently unavailable:
                          </p>
                          <ul className="space-y-2 mb-4">
                            {outOfStock.map((error, index) => (
                              <li key={index} className="font-sans text-sm text-red-800 flex items-start gap-3">
                                <span className="w-2 h-2 bg-red-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                <div>
                                  <span className="font-semibold">{error.title}</span>
                                  <div className="text-xs text-red-700 mt-1">
                                    Requested: {error.requested} • Available: None
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="bg-red-100 p-3 rounded border border-red-200">
                            <p className="font-sans text-sm text-red-900 font-medium mb-1">
                              Action Required:
                            </p>
                            <p className="font-sans text-xs text-red-800">
                              Remove these items from your cart to proceed with checkout.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Limited Stock Items */}
                  {limitedStock.length > 0 && (
                    <div className="bg-amber-50 border-l-4 border-amber-500 p-6 rounded-sm">
                      <div className="flex items-start gap-4">
                        <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="font-serif text-lg text-amber-900 mb-2">Limited Stock Available</h3>
                          <p className="font-sans text-sm text-amber-800 mb-3">
                            These items have limited quantities available:
                          </p>
                          <ul className="space-y-3 mb-4">
                            {limitedStock.map((error, index) => (
                              <li key={index} className="font-sans text-sm text-amber-800">
                                <div className="flex items-start gap-3">
                                  <span className="w-2 h-2 bg-amber-600 rounded-full mt-1.5 flex-shrink-0"></span>
                                  <div className="flex-1">
                                    <span className="font-semibold">{error.title}</span>
                                    <div className="flex items-center gap-4 mt-2">
                                      <div className="text-xs">
                                        <span className="text-amber-700">Requested:</span>
                                        <span className="font-mono ml-1 bg-amber-100 px-2 py-0.5 rounded">
                                          {error.requested}
                                        </span>
                                      </div>
                                      <div className="text-xs">
                                        <span className="text-amber-700">Available:</span>
                                        <span className="font-mono ml-1 bg-green-100 text-green-800 px-2 py-0.5 rounded">
                                          {error.available}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </li>
                            ))}
                          </ul>
                          <div className="bg-amber-100 p-3 rounded border border-amber-200">
                            <p className="font-sans text-sm text-amber-900 font-medium mb-1">
                              Action Required:
                            </p>
                            <p className="font-sans text-xs text-amber-800">
                              Reduce quantities to match available stock or remove items to proceed with checkout.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })()}
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
                const stockError = stockErrors.find(error => error.key === item.key);
                const hasStockIssue = !!stockError;
                const isOutOfStock = stockError && stockError.available === 0;
                const isLimitedStock = stockError && stockError.available > 0;

                return (
                  <motion.div
                    key={item.key || `cart-item-${index}`}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`flex gap-6 border-b pb-8 ${isOutOfStock
                      ? 'border-red-300 bg-red-50/30'
                      : isLimitedStock
                        ? 'border-amber-300 bg-amber-50/30'
                        : 'border-warm-grey/20'
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
                            {hasStockIssue && (() => {
                              const stockError = stockErrors.find(error => error.key === item.key);
                              const isOutOfStock = stockError && stockError.available === 0;

                              return (
                                <div className="mt-2 space-y-1">
                                  {isOutOfStock ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded">
                                      <AlertCircle className="w-3 h-3" />
                                      Out of Stock
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 bg-amber-100 text-amber-800 text-xs font-medium rounded">
                                      <AlertCircle className="w-3 h-3" />
                                      Limited Stock
                                    </span>
                                  )}
                                  {stockError && !isOutOfStock && (
                                    <div className="text-xs text-amber-700">
                                      Only {stockError.available} available
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
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
                            onClick={() => handleQuantityDecrease(item)}
                            className="text-charcoal hover:text-warm-grey transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="font-mono text-sm w-4 text-center">{item.quantity || 1}</span>
                          <button
                            onClick={() => handleQuantityIncrease(item)}
                            className={`transition-colors ${(() => {
                              // Find available stock for this item
                              const product = products.find(p => p && p.id === item.id);
                              const variant = product?.variants?.find(v => v?.id === item.variant_id);
                              const availableStock = variant?.stock ?? variant?.quantity ?? 0;
                              const currentQuantity = item.quantity || 1;
                              const wouldExceedStock = currentQuantity >= availableStock;

                              return wouldExceedStock
                                ? 'text-warm-grey/50 cursor-not-allowed'
                                : 'text-charcoal hover:text-warm-grey';
                            })()
                              }`}
                            disabled={(() => {
                              // Find available stock for this item
                              const product = products.find(p => p && p.id === item.id);
                              const variant = product?.variants?.find(v => v?.id === item.variant_id);
                              const availableStock = variant?.stock ?? variant?.quantity ?? 0;
                              const currentQuantity = item.quantity || 1;
                              return currentQuantity >= availableStock;
                            })()}
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Stock limit feedback */}
                        {stockLimitFeedback?.key === item.key && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className={`mt-2 px-3 py-2 rounded-sm text-xs font-medium ${stockLimitFeedback.type === 'error'
                              ? 'bg-red-100 text-red-800 border border-red-200'
                              : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                          >
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-3 h-3 flex-shrink-0" />
                              <span>{stockLimitFeedback.message}</span>
                            </div>
                          </motion.div>
                        )}

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
                className={`w-full py-4 uppercase tracking-widest transition-colors flex items-center justify-center gap-2 group text-sm font-medium ${stockErrors.length > 0 || checkingStock
                  ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                  : 'bg-charcoal text-white hover:bg-black'
                  }`}
              >
                {checkingStock ? 'Checking Stock...' : (() => {
                  if (stockErrors.length === 0) {
                    return (
                      <>
                        Proceed to Checkout
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </>
                    );
                  }

                  const outOfStock = stockErrors.filter(error => error.available === 0);
                  const limitedStock = stockErrors.filter(error => error.available > 0);

                  if (outOfStock.length > 0 && limitedStock.length > 0) {
                    return 'Resolve Stock Issues';
                  } else if (outOfStock.length > 0) {
                    return 'Remove Out of Stock Items';
                  } else {
                    return 'Adjust Quantities';
                  }
                })()}
              </button>

              {stockErrors.length > 0 && (() => {
                const outOfStock = stockErrors.filter(error => error.available === 0);
                const limitedStock = stockErrors.filter(error => error.available > 0);

                return (
                  <div className="font-sans text-xs text-center mt-3 space-y-1">
                    {outOfStock.length > 0 && (
                      <p className="text-red-600">
                        {outOfStock.length} item{outOfStock.length > 1 ? 's' : ''} out of stock
                      </p>
                    )}
                    {limitedStock.length > 0 && (
                      <p className="text-amber-600">
                        {limitedStock.length} item{limitedStock.length > 1 ? 's' : ''} with limited stock
                      </p>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}