import React, { createContext, useContext, useReducer, useEffect } from 'react';
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      // Create a unique key for variant-based items (product_id + size + color)
      const itemKey = `${action.payload.id}_${action.payload.selectedSize || ''}_${action.payload.selectedColor || ''}`;
      const existingItem = state.items.find(item => {
        const existingKey = `${item.id}_${item.selectedSize || ''}_${item.selectedColor || ''}`;
        return existingKey === itemKey;
      });
      
      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item => {
            const existingKey = `${item.id}_${item.selectedSize || ''}_${item.selectedColor || ''}`;
            return existingKey === itemKey
              ? { ...item, quantity: item.quantity + 1 }
              : item;
          }),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1 }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter((item, index) => index !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map((item, index) =>
          index === action.payload.index
            ? { ...item, quantity: Math.max(0, action.payload.quantity) }
            : item
        ).filter(item => item.quantity > 0),
      };

    case 'CLEAR_CART':
      return {
        ...state,
        items: [],
      };

    default:
      return state;
  }
};

export const CartProvider = ({ children }) => {
    const [state, dispatch] = useReducer(cartReducer, {
    items: JSON.parse(sessionStorage.getItem('cart') || '[]')
    });

  const addToCart = (product) => {
    dispatch({ type: 'ADD_TO_CART', payload: product });
  };

  const removeFromCart = (itemIndex) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: itemIndex });
  };

  const updateQuantity = (itemIndex, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { index: itemIndex, quantity } });
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
  };
    useEffect(() => {
    sessionStorage.setItem('cart', JSON.stringify(state.items));
    }, [state.items]);

  const getCartTotal = () => {
    return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartItemsCount = () => {
    return state.items.reduce((total, item) => total + item.quantity, 0);
  };

  const value = {
    items: state.items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};