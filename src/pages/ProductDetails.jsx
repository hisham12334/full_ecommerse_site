import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';
import Button from '../components/common/Button';

export default function ProductDetails({ products = [] }) {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart, items } = useCart();
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const product = products.find(p => p.id === parseInt(id));

  const availableSizes = product?.variants ? [...new Set(product.variants.map(v => v.size))] : [];
  const availableColors = product?.colors || [];
  
  // Handle multiple images - memoized to prevent recreation on every render
  const productImages = useMemo(() => {
    let images = [];
    
    if (product?.images && product.images.length > 0) {
      // Use actual images array if available from backend
      images = product.images.filter(img => img);
    } else if (product?.image) {
      // Check localStorage for additional images (temporary demo solution)
      const storedImages = localStorage.getItem(`product_images_${product.title}`);
      if (storedImages) {
        try {
          const parsedImages = JSON.parse(storedImages);
          images = parsedImages;
        } catch (e) {
          // Fallback to single image if parsing fails
          images = [product.image];
        }
      } else {
        // Fallback to single image
        images = [product.image];
      }
    }
    
    return images;
  }, [product?.images, product?.image, product?.title]);

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

  // Separate useEffect for resetting image index when product changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [product?.id]);

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % productImages.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + productImages.length) % productImages.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  // Touch/Swipe support for mobile
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);

  const minSwipeDistance = 50;

  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;

    if (isLeftSwipe && productImages.length > 1) {
      nextImage();
    }
    if (isRightSwipe && productImages.length > 1) {
      prevImage();
    }
  };

  const isInCart = items.some(item => 
    item.id === product?.id &&
    item.selectedSize === selectedSize &&
    item.selectedColor === selectedColor
  );

  if (!product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Product not found</h1>
          <Link to="/" className="text-action-black hover:underline">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = async () => {
    setIsAdding(true);
    const selectedVariant = product.variants.find(v => v.size === selectedSize);

    const cartItem = {
      ...product,
      selectedSize,
      selectedColor,
      variant_id: selectedVariant?.id,
    };
    
    addToCart(cartItem);
    await new Promise(resolve => setTimeout(resolve, 500));
    setIsAdding(false);
  };

  return (
    <div className="min-h-screen bg-white">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="font-bold text-xl tracking-wide text-action-black">Qadr.fits</Link>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100" aria-label="go back">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M19 12H5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M12 19l-7-7 7-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </button>
              <Link to="/cart" className="p-2 hover:bg-gray-100 relative" aria-label="cart">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M6 2h12l1 5H5l1-5z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /><path d="M6 7h12v13a2 2 0 01-2 2H8a2 2 0 01-2-2V7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" /></svg>
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-brand-red text-white text-xs h-5 w-5 flex items-center justify-center">
                    {items.reduce((total, item) => total + item.quantity, 0)}
                  </span>
                )}
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
          {/* Enhanced Image Gallery with Swipe Support */}
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ duration: 0.5 }} 
            className="w-full"
          >
            {productImages.length > 0 ? (
              <div className="relative">
                {/* Main Image Display */}
                <div 
                  className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden relative group cursor-pointer"
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                  onClick={(e) => {
                    if (productImages.length > 1 && !e.target.closest('button')) {
                      nextImage();
                    }
                  }}
                >
                  <div className="relative w-full h-full">
                    <img 
                      key={`image-${currentImageIndex}`}
                      src={productImages[currentImageIndex]} 
                      alt={`${product.title} - Image ${currentImageIndex + 1}`} 
                      className="w-full h-full object-cover transition-all duration-500 ease-in-out" 

                    />

                  </div>
                  
                  {/* Navigation Arrows - Only show if multiple images */}
                  {productImages.length > 1 && (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          prevImage();
                        }}
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center hover:scale-110 active:scale-95"
                        aria-label="Previous image"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          nextImage();
                        }}
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-all duration-200 min-h-[44px] min-w-[44px] flex items-center justify-center hover:scale-110 active:scale-95"
                        aria-label="Next image"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </button>
                    </>
                  )}
                  
                  {/* Image Counter */}
                  {productImages.length > 1 && (
                    <div className="absolute bottom-4 right-4 bg-black/60 text-white px-3 py-1 rounded-full text-sm font-medium">
                      {currentImageIndex + 1} / {productImages.length}
                    </div>
                  )}
                </div>
                
                {/* Thumbnail Navigation - Only show if multiple images */}
                {productImages.length > 1 && (
                  <div className="flex gap-2 mt-4 overflow-x-auto pb-2">
                    {productImages.map((image, index) => (
                      <button
                        key={index}
                        onClick={() => goToImage(index)}
                        className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                          currentImageIndex === index 
                            ? 'border-action-black shadow-md' 
                            : 'border-gray-200 hover:border-gray-400'
                        }`}
                      >
                        <img 
                          src={image} 
                          alt={`${product.title} thumbnail ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                <span className="text-gray-400">No image available</span>
              </div>
            )}
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }} className="flex flex-col justify-center">
            <div>
              <h1 className="text-3xl lg:text-4xl font-extrabold text-action-black mb-2">{product.title}</h1>
              <p className="text-2xl font-semibold text-gray-800 mb-4">₹{product.price.toLocaleString()}</p>
              <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>
            </div>

            {availableSizes.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {availableSizes.map((size) => (
                    <button key={size} onClick={() => setSelectedSize(size)} className={`py-2 px-4 border font-medium transition-colors text-sm ${selectedSize === size ? 'border-action-black bg-action-black text-white' : 'border-gray-300 hover:border-gray-500'}`}>
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {availableColors.length > 0 && (
              <div className="mb-6">
                <h3 className="text-md font-semibold text-gray-900 mb-3">Color</h3>
                <div className="flex flex-wrap gap-3">
                  {availableColors.map((color) => (
                    <label key={color} className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="color" value={color} checked={selectedColor === color} onChange={() => setSelectedColor(color)} className="h-4 w-4 text-action-black focus:ring-action-black" />
                      <span className="text-gray-700 text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="mt-4 space-y-3">
              <Button
                onClick={handleAddToCart}
                disabled={isAdding || isInCart || (availableSizes.length > 0 && !selectedSize) || (availableColors.length > 0 && !selectedColor)}
                className="w-full"
                size="lg"
                variant={isInCart ? 'success' : 'primary'}
              >
                {isAdding ? 'Adding...' : isInCart ? 'Added to Basket ✓' : 'Add to Basket'}
              </Button>
              {isInCart && (
                <Button onClick={() => navigate('/cart')} className="w-full" size="lg" variant="outline">
                  View Basket
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}