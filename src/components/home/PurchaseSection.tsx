import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check } from 'lucide-react';
import hoodieImage from '@/assets/images/hoodie-hanger.jpg';

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

const PurchaseSection = () => {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <section className="relative min-h-screen bg-cool-white py-24">
      <div className="container mx-auto px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="mx-auto max-w-2xl text-center"
        >
          {/* Product Image */}
          <motion.div
            className="relative mx-auto mb-12 max-w-md"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
          >
            <img 
              src={hoodieImage} 
              alt="Premium hoodie on hanger"
              className="w-full rounded-sm shadow-2xl"
            />
            
            {/* Size Tags */}
            <div className="absolute -right-8 top-1/4 flex flex-col gap-2">
              {sizes.map((size, index) => (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`relative flex h-12 w-12 items-center justify-center border-2 bg-cool-white font-mono text-sm transition-all ${
                    selectedSize === size 
                      ? 'border-charcoal bg-charcoal text-cool-white scale-110' 
                      : 'border-warm-grey text-warm-grey hover:border-charcoal hover:text-charcoal'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedSize === size ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    size
                  )}
                  
                  {/* Tag String */}
                  <div className="absolute -top-3 right-1/2 h-3 w-0.5 bg-warm-grey" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <h2 className="font-serif text-4xl font-semibold text-charcoal md:text-5xl">
              The Essential Hoodie
            </h2>
            <p className="mt-4 font-sans text-lg text-warm-grey">
              500GSM heavyweight cotton. Made in Portugal.
            </p>
            
            {/* Temperature Range */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-1 w-32 rounded-full bg-gradient-to-r from-blue-200 via-warm-grey to-orange-200" />
              <p className="font-mono text-xs text-warm-grey">
                Comfort Range: 45°F - 65°F
              </p>
            </div>
          </motion.div>

          {/* Price */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            viewport={{ once: true }}
            className="mb-8"
          >
            <p className="font-serif text-5xl font-semibold text-charcoal">$248</p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-warm-grey">
              One time investment
            </p>
          </motion.div>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            viewport={{ once: true }}
            disabled={!selectedSize}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative overflow-hidden border-2 px-12 py-4 font-sans text-lg uppercase tracking-widest transition-all duration-500 ${
              selectedSize
                ? 'border-charcoal bg-charcoal text-cool-white hover:bg-cool-white hover:text-charcoal'
                : 'border-warm-grey bg-warm-grey text-cool-white cursor-not-allowed opacity-50'
            }`}
          >
            <motion.span
              className="relative z-10"
              animate={isHovered && selectedSize ? { y: -2 } : { y: 0 }}
            >
              {selectedSize ? 'Reserve Yours' : 'Select Size'}
            </motion.span>
            
            {/* Hover Effect */}
            {selectedSize && (
              <motion.div
                className="absolute inset-0 bg-cool-white"
                initial={{ y: '100%' }}
                animate={isHovered ? { y: 0 } : { y: '100%' }}
                transition={{ duration: 0.3 }}
              />
            )}
          </motion.button>

          {/* Small Badge */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            viewport={{ once: true }}
            className="mt-8"
          >
            <p className="font-mono text-xs text-warm-grey">Est. 2024</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default PurchaseSection;
