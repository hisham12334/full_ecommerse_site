import React, { createContext, useContext, useReducer, useEffect } from 'react';
const CartContext = createContext();

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'ADD_TO_CART':
      const itemKey = `${action.payload.id}-${action.payload.selectedSize}-${action.payload.selectedColor}`;
      const existingItem = state.items.find(item => item.key === itemKey);

      if (existingItem) {
        return {
          ...state,
          items: state.items.map(item =>
            item.key === itemKey
              ? { ...item, quantity: item.quantity + 1 }
              : item
          ),
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.payload, quantity: 1, key: itemKey }],
      };

    case 'REMOVE_FROM_CART':
      return {
        ...state,
        items: state.items.filter(item => item.key !== action.payload),
      };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        items: state.items.map(item =>
          item.key === action.payload.key
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

  const removeFromCart = (productKey) => {
    dispatch({ type: 'REMOVE_FROM_CART', payload: productKey });
  };

  const updateQuantity = (productKey, quantity) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { key: productKey, quantity } });
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