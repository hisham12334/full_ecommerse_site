import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

export default function ProductDetails({ products = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const product = products.find(p => p.id === parseInt(id));

  // Extract unique sizes and colors from the variants array
  const availableSizes = product?.variants ? [...new Set(product.variants.map(v => v.size))] : [];
  const availableColors = product?.colors || [];

  useEffect(() => {
    if (product) {
      if (availableSizes.length > 0 && !selectedSize) {
        setSelectedSize(availableSizes[0]);
      }
      if (availableColors.length > 0 && !selectedColor) {
        setSelectedColor(availableColors[0]);
      }
    }
  }, [product, selectedSize, selectedColor, availableSizes, availableColors]);

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/" className="text-blue-600 hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAdding(true);
    
    // Find the correct variant with the selected size and color
    const selectedVariant = product.variants.find(v => 
      v.size === selectedSize
    );

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      variant_id: selectedVariant?.id,
    };
    
    addToCart(cartItem);
    
    // Simulate loading
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAdding(false);
  };

  const isInCart = items.some(item => 
    item.id === product.id &&
    item.selectedSize === selectedSize &&
    item.selectedColor === selectedColor
  );

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3">
              <span className="font-medium text-lg tracking-wide">Brand</span>
            </Link>
            <div className="flex items-center gap-4">
              <button 
                onClick={() => navigate(-1)}
                className="p-2 rounded-md hover:bg-gray-100" 
                aria-label="go back"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
              <Link to="/cart" className="p-2 rounded-md hover:bg-gray-100 relative" aria-label="cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M6 2h12l1 5H5l1-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M6 7h12v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="aspect-square bg-gray-100 rounded-lg overflow-hidden"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>

          {/* Product Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.title}</h1>
              <p className="text-2xl font-semibold text-gray-900">₹{product.price.toLocaleString()}</p>
            </div>

            <div>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Size Selection */}
            {availableSizes.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Size</h3>
                <div className="grid grid-cols-4 gap-2">
                  {availableSizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`py-2 px-4 border rounded-sm font-medium transition-colors ${
                        selectedSize === size
                          ? 'border-black bg-black text-white'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Color Selection */}
            {availableColors.length > 0 && (
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-3">Color</h3>
                <div className="space-y-2">
                  {availableColors.map((color) => (
                    <label key={color} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="color"
                        value={color}
                        checked={selectedColor === color}
                        onChange={() => setSelectedColor(color)}
                        className="text-black focus:ring-black"
                      />
                      <span className="text-gray-700">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Add to Cart Button */}
            <div className="space-y-4">
              <button
                onClick={handleAddToCart}
                disabled={isAdding || (availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor)}
                className={`w-full py-3 px-6 rounded-sm font-semibold transition-colors ${
                  isAdding || (availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor)
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : isInCart
                    ? 'bg-green-600 text-white hover:bg-green-700'
                    : 'bg-black text-white hover:bg-gray-800'
                }`}
              >
                {isAdding ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Adding...
                  </div>
                ) : isInCart ? (
                  'Added to Cart ✓'
                ) : (
                  'Add to Cart'
                )}
              </button>

              {(availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor) ? (
                <p className="text-sm text-red-600">
                  Please select {!selectedSize && availableSizes.length > 0 ? 'size' : ''} 
                  {!selectedSize && !selectedColor && availableSizes.length > 0 && availableColors.length > 0 ? ' and ' : ''}
                  {!selectedColor && availableColors.length > 0 ? 'color' : ''}
                </p>
              ) : null}

              <Link
                to="/cart"
                className="block w-full text-center py-3 px-6 border border-gray-300 rounded-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                View Cart
              </Link>
            </div>

            {/* Product Features */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Product Details</h3>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>• Free delivery on orders above ₹999</li>
                <li>• 30-day return policy</li>
                <li>• Secure payment options</li>
                <li>• Customer support available 24/7</li>
              </ul>
            </div>
          </motion.div>
        </div>

        
      </div>
    </div>
  );
}