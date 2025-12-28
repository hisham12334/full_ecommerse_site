import { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { user } = useAuth();
  
  // Get cart key based on user (user-specific cart or guest cart)
  const getCartKey = () => {
    return user ? `cart_user_${user.id}` : 'cart_guest';
  };

  const [items, setItems] = useState(() => {
    const cartKey = user ? `cart_user_${user.id}` : 'cart_guest';
    const saved = localStorage.getItem(cartKey);
    return saved ? JSON.parse(saved) : [];
  });

  // Update cart in localStorage whenever items change
  useEffect(() => {
    const cartKey = getCartKey();
    localStorage.setItem(cartKey, JSON.stringify(items));
  }, [items, user]);

  // Clear cart when user changes (login/logout)
  useEffect(() => {
    const cartKey = getCartKey();
    const saved = localStorage.getItem(cartKey);
    setItems(saved ? JSON.parse(saved) : []);
  }, [user?.id]);

  const addToCart = (product, stockLimit = null) => {
    // Support both old signature (product, size, color) and new signature (product object with all fields)
    const isNewFormat = product.variant_id !== undefined;
    
    const key = isNewFormat 
      ? `${product.id}-${product.selectedSize}-${product.selectedColor}`
      : `${product.id}-${arguments[1]}-${arguments[2]}`;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.key === key);
      
      if (existingItem) {
        const newQuantity = existingItem.quantity + 1;
        
        // Check stock limit if provided
        if (stockLimit !== null && newQuantity > stockLimit) {
          return prevItems; // Don't add if it would exceed stock
        }
        
        return prevItems.map(item =>
          item.key === key
            ? { ...item, quantity: newQuantity }
            : item
        );
      }
      
      // For new items, check if initial quantity exceeds stock
      const initialQuantity = product.quantity || 1;
      if (stockLimit !== null && initialQuantity > stockLimit) {
        return prevItems; // Don't add if initial quantity exceeds stock
      }
      
      // New format: product object already has all fields
      if (isNewFormat) {
        return [...prevItems, {
          key,
          id: product.id,
          title: product.title,
          price: product.price,
          image: product.image,
          variant_id: product.variant_id,
          selectedSize: product.selectedSize,
          selectedColor: product.selectedColor,
          quantity: initialQuantity
        }];
      }
      
      // Old format: separate parameters
      return [...prevItems, {
        key,
        id: product.id,
        title: product.title,
        price: product.price,
        image: product.image,
        selectedSize: arguments[1],
        selectedColor: arguments[2],
        quantity: 1
      }];
    });
    
    return { success: true, message: 'Item added to cart' };
  };

  const removeFromCart = (key) => {
    setItems(prevItems => prevItems.filter(item => item.key !== key));
  };

  const updateQuantity = (key, newQuantity, stockLimit = null) => {
    if (newQuantity < 1) {
      removeFromCart(key);
      return { success: true, message: 'Item removed from cart' };
    }
    
    // If stock limit is provided, validate against it
    if (stockLimit !== null && newQuantity > stockLimit) {
      return { 
        success: false, 
        message: `Only ${stockLimit} items available in stock`,
        availableStock: stockLimit
      };
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.key === key
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
    
    return { success: true, message: 'Quantity updated successfully' };
  };

  const getCartTotal = () => {
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getCartCount = () => {
    return items.reduce((count, item) => count + item.quantity, 0);
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      removeFromCart,
      updateQuantity,
      getCartTotal,
      getCartCount,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
