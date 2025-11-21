import { motion } from 'framer-motion';
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/images/hero-hoodie.jpg';

const HeroSection = () => {
  return (
    <section className="relative h-screen w-full overflow-hidden bg-warm-white">
      {/* Background Image */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <img
          src={heroImage}
          alt="Premium heavyweight hoodie fabric detail"
          className="h-full w-full object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-warm-white/10 via-transparent to-warm-white/30" />
      </motion.div>

      {/* Brand Name - Top Left */}
      <motion.div
        className="absolute left-8 top-8 z-10"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
      >
        <h2 className="font-serif text-2xl tracking-wider text-charcoal">Qadr.fits</h2>
      </motion.div>

      {/* Login / Account Link - Top Right */}
      <div className="absolute right-8 top-8 z-20">
        <Link // <--- 2. Change 'a' to 'Link'
          to="/login" // <--- 3. Change 'href' to 'to'
          className="font-sans text-sm tracking-widest uppercase text-charcoal hover:text-black transition-colors border-b border-transparent hover:border-charcoal pb-1"
        >
          Account
        </Link>
      </div>
      
      {/* Center Statement */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 1.2, ease: [0.6, 0.05, 0.01, 0.9] }}
          className="text-center"
        >
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl font-bold tracking-tight text-charcoal">
            The Last Hoodie
            <br />
            You'll Need.
          </h1>
        </motion.div>
      </div>

      {/* Scroll Indicator - Bottom Center */}
      <motion.div
        className="absolute bottom-12 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <span className="font-mono text-xs uppercase tracking-widest text-warm-grey">Discover</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
        >
          <ChevronDown className="h-6 w-6 text-charcoal" />
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HeroSection;
