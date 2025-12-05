import { motion } from 'framer-motion';
import React from 'react';
import { ChevronDown, User, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const HeroSection = () => {
  const { user, logout } = useAuth();
  const [showDropdown, setShowDropdown] = React.useState(false);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  // Ensure video plays immediately
  React.useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(error => {
        console.log('Video autoplay failed:', error);
      });
    }
  }, []);

  return (
    <section className="relative h-screen w-full overflow-hidden bg-warm-white">
      {/* Background Video */}
      <motion.div
        className="absolute inset-0"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.5, ease: [0.6, 0.05, 0.01, 0.9] }}
      >
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          className="h-full w-full object-cover"
          poster="/hero-poster.jpg"
        >
          <source src="/hero-video.mp4" type="video/mp4" />
          <source src="/hero-video.webm" type="video/webm" />
          {/* Fallback message for browsers that don't support video */}
          Your browser does not support the video tag.
        </video>
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
        {user ? (
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 font-sans text-sm tracking-widest uppercase text-charcoal hover:text-black transition-colors"
            >
              <User className="w-4 h-4" />
              {user.name}
            </button>
            
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-warm-grey/20 py-2">
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="block px-4 py-2 text-sm text-charcoal hover:bg-warm-white transition-colors"
                    onClick={() => setShowDropdown(false)}
                  >
                    Admin Panel
                  </Link>
                )}
                <Link
                  to="/dashboard"
                  className="block px-4 py-2 text-sm text-charcoal hover:bg-warm-white transition-colors"
                  onClick={() => setShowDropdown(false)}
                >
                  My Orders
                </Link>
                <button
                  onClick={() => {
                    setShowDropdown(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            to="/login"
            className="font-sans text-sm tracking-widest uppercase text-charcoal hover:text-black transition-colors border-b border-transparent hover:border-charcoal pb-1"
          >
            Account
          </Link>
        )}
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
