import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (product) => {
    // Support both old signature (product, size, color) and new signature (product object with all fields)
    const isNewFormat = product.variant_id !== undefined;
    
    const key = isNewFormat 
      ? `${product.id}-${product.selectedSize}-${product.selectedColor}`
      : `${product.id}-${arguments[1]}-${arguments[2]}`;
    
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.key === key);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.key === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
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
          quantity: product.quantity || 1
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
  };

  const removeFromCart = (key) => {
    setItems(prevItems => prevItems.filter(item => item.key !== key));
  };

  const updateQuantity = (key, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(key);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.key === key
          ? { ...item, quantity: newQuantity }
          : item
      )
    );
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
