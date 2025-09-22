import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import heroImage from '../../../assets/images/hero-image.jpg';
import abstractModel from '../../../assets/images/abstract-model.jpg';
import maroonModel from '../../../assets/images/maroon-model.jpg';

const HeroSection = ({ heroImages = [] }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Default images using your uploaded model photos
  const defaultImages = [
    {
      src: heroImage,
      fallbackSrc: '',
      alt: 'Tokyo Streetwear Collection',
      product: 'Tokyo Edition Tee',
      price: 2450,
      description: 'Premium streetwear with authentic Tokyo typography and bold red graphics'
    },
    {
      src: abstractModel,
      fallbackSrc: '',
      alt: 'Abstract Art Collection',
      product: 'Abstract Design Tee',
      price: 1850,
      description: 'Artistic expression with colorful abstract prints and contemporary design'
    },
    {
      src: maroonModel,
      fallbackSrc: '', 
      alt: 'Maroon Edition Collection',
      product: 'Maroon Edition Hoodie',
      price: 3200,
      description: 'Owners Club collection - premium maroon hoodie for enthusiasts'
    }
  ];

  const images = heroImages.length > 0 ? heroImages : defaultImages;
  const currentImage = images[currentImageIndex];

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToImage = (index) => {
    setCurrentImageIndex(index);
  };

  return (
    <section className="relative h-screen bg-gradient-to-br from-red-500 to-red-600 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-96 h-96 bg-white rounded-full"></div>
        <div className="absolute bottom-20 right-20 w-64 h-64 bg-white rounded-full"></div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            
            {/* Left Side - Product Info */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="text-white space-y-8"
            >
              {/* Brand */}
              <div className="space-y-2">
                <div className="text-sm font-medium tracking-wider uppercase opacity-90">Supreme</div>
                <div className="text-xs opacity-70">FW24</div>
              </div>

              {/* Product Name */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentImageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-4"
                >
                  <h1 className="text-5xl lg:text-7xl font-bold leading-tight">
                    {currentImage.product?.split(' ').map((word, index) => (
                      <span key={index}>
                        {index === 0 ? '/' : ''}{word}
                        {index === 0 ? <br /> : ' '}
                      </span>
                    ))}
                  </h1>
                  <div className="flex items-center gap-4">
                    <span className="text-sm opacity-70">Size:</span>
                    <span className="text-2xl font-bold">XL</span>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* Price */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`price-${currentImageIndex}`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="space-y-2"
                >
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm opacity-70">₹</span>
                    <span className="text-6xl font-bold">{currentImage.price}</span>
                    <span className="text-lg opacity-70">.00</span>
                  </div>
                  <p className="text-sm opacity-80 max-w-md">
                    {currentImage.description}
                  </p>
                </motion.div>
              </AnimatePresence>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <button className="bg-black text-white px-8 py-3 font-semibold hover:bg-gray-800 transition-colors">
                  View Collections
                </button>
              </motion.div>
            </motion.div>

            {/* Right Side - Model Image Carousel */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center lg:justify-end"
            >
              {/* Product Card Background */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-96 bg-white/10 backdrop-blur-sm rounded-lg"></div>
              
              {/* Model Image */}
              <div className="relative z-10 w-80 h-96 bg-white/20 backdrop-blur-sm rounded-lg overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0, scale: 1.1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full"
                  >
                    <img 
                      src={currentImage.src} 
                      alt={currentImage.alt} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Try fallback image if main image fails
                        if (currentImage.fallbackSrc && e.target.src !== currentImage.fallbackSrc) {
                          e.target.src = currentImage.fallbackSrc;
                        } else {
                          // Show placeholder if both images fail
                          e.target.style.display = 'none';
                          e.target.nextSibling.style.display = 'flex';
                        }
                      }}
                    />
                    <div className="w-full h-full flex items-center justify-center text-white/80" style={{ display: 'none' }}>
                      <div className="text-center">
                        <div className="w-32 h-32 bg-white/30 rounded-full mx-auto mb-4 flex items-center justify-center">
                          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                            <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                        </div>
                        <p className="text-sm">{currentImage.product}</p>
                        <p className="text-xs opacity-70">Add your image to /public/images/hero/</p>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Arrows */}
              <div className="absolute top-1/2 -left-12 transform -translate-y-1/3">
                <button 
                  onClick={prevImage}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                </button>
              </div>
              <div className="absolute top-1/2 -right-12 transform -translate-y-1/2">
                <button 
                  onClick={nextImage}
                  className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white hover:bg-white/30 transition-colors"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation Dots */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => goToImage(index)}
            className={`w-2 h-2 rounded-full transition-colors ${
              index === currentImageIndex ? 'bg-white' : 'bg-white/50'
            }`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;