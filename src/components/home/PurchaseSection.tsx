import { motion } from 'framer-motion';
import { useState } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useProductsContext } from '@/context/ProductContext';
import { useNavigate } from 'react-router-dom';
import hoodieImage from '@/assets/images/hoodie-hanger.jpg';

const PurchaseSection = () => {
  const { addToCart } = useCart();
  const { products, isLoading, error } = useProductsContext();
  const navigate = useNavigate(); // Hook for redirection
  
  const [selectedSize, setSelectedSize] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // ✅ GET THE LATEST PRODUCT
  // We sort by ID descending to ensure we get the absolutely newest product you added
  const product = products?.length > 0 
    ? [...products].sort((a, b) => b.id - a.id)[0] 
    : null;

  // Dynamic Sizes from DB
  const availableSizes = product?.variants?.map(v => v.size) || [];
  const sortedSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'].filter(s => 
    availableSizes.includes(s)
  );

  // ✅ Handle Image Logic
  // If DB has images, use the first one. Otherwise, use fallback.
  const displayImage = (product?.images && product.images.length > 0) 
    ? product.images[0] 
    : hoodieImage;

  const handleAddToCart = async () => {
    if (!selectedSize || !product) return;
    
    setIsAdding(true);

    const selectedVariant = product.variants.find(v => v.size === selectedSize);

    if (!selectedVariant) {
        alert("Selected size is out of stock or unavailable.");
        setIsAdding(false);
        return;
    }

    // Simulate "Reserve" processing delay
    await new Promise(resolve => setTimeout(resolve, 800));

    addToCart({
      id: product.id,
      title: product.title,
      price: parseFloat(product.price),
      image: displayImage,
      variant_id: selectedVariant.id,
      selectedSize: selectedSize,
      selectedColor: product.colors?.[0] || "Standard",
      quantity: 1
    });

    setIsAdding(false);
    
    // ✅ NAVIGATION FIX: Go to Cart immediately
    navigate('/cart'); 
  };

  if (isLoading) return <div className="py-24 text-center">Loading collection...</div>;
  if (error) return <div className="py-24 text-center text-red-500">Unable to load product.</div>;
  if (!product) return <div className="py-24 text-center">No active products found in Admin.</div>;

  return (
    <section className="relative min-h-screen bg-cool-white py-24" id="shop">
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
              src={displayImage} 
              alt={product.title}
              className="w-full rounded-sm shadow-2xl object-cover aspect-[4/5]"
            />
            
            {/* Size Tags */}
            <div className="absolute -right-8 top-1/4 flex flex-col gap-2">
              {sortedSizes.map((size, index) => (
                <motion.button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`relative flex h-12 w-12 items-center justify-center border-2 font-mono text-sm transition-all ${
                    selectedSize === size 
                      ? 'border-charcoal bg-charcoal text-white scale-110' 
                      : 'border-warm-grey bg-white text-warm-grey hover:border-charcoal hover:text-charcoal'
                  }`}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {selectedSize === size ? <Check className="h-4 w-4" /> : size}
                  <div className="absolute -top-3 right-1/2 h-3 w-0.5 bg-warm-grey" />
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Details */}
          <div className="mb-8">
            <h2 className="font-serif text-4xl text-charcoal md:text-5xl">
              {product.title}
            </h2>
            <p className="mt-4 font-sans text-lg text-warm-grey">
              {product.description || "Premium quality. Limited edition."}
            </p>
          </div>

          {/* Temperature Range */}
            <div className="mt-6 flex items-center justify-center gap-4">
              <div className="h-1 w-32 rounded-full bg-gradient-to-r from-blue-200 via-warm-grey to-orange-200" />
              <p className="font-mono text-xs text-warm-grey">
                Comfort Range: 45°F - 65°F
              </p>
            </div>

          {/* Price */}
          <div className="mb-8">
            <p className="font-serif text-5xl text-charcoal">
              ₹{parseFloat(product.price).toLocaleString()}
            </p>
            <p className="mt-2 font-mono text-xs uppercase tracking-widest text-warm-grey">
              One time investment
            </p>
          </div>

          {/* CTA Button */}
          <button
            disabled={!selectedSize || isAdding}
            onClick={handleAddToCart}
            className={`group relative w-full max-w-md overflow-hidden border-2 px-12 py-4 font-sans text-lg uppercase tracking-widest transition-all duration-500 ${
              selectedSize
                ? 'border-charcoal bg-charcoal text-white hover:bg-white hover:text-charcoal'
                : 'border-warm-grey bg-warm-grey text-white cursor-not-allowed opacity-50'
            }`}
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {isAdding ? (
                <>Processing <Loader2 className="animate-spin h-5 w-5" /></>
              ) : selectedSize ? (
                'Reserve Yours'
              ) : (
                'Select Size'
              )}
            </span>
          </button>

          <div className="mt-8">
            <p className="font-mono text-xs text-warm-grey">Est. 2025</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PurchaseSection;