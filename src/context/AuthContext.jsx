import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing user session on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        const payload = JSON.parse(atob(token.split('.')[1]));
        
        // Verify token is not expired
        if (payload.exp * 1000 > Date.now()) {
          setUser(parsedUser);
        } else {
          // Token expired, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      } catch (error) {
        // Invalid data in storage, clear it
        console.error("Failed to parse user session:", error);
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success && response.user) {
        const userData = {
          ...response.user,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${response.user.email}`
        };
        
        setUser(userData);
        // Store the complete user object and token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', response.token);

        return { success: true, user: userData };
      } else {
        throw new Error(response.error || 'Login failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name, email, password) => {
    setIsLoading(true);
    try {
      const response = await apiService.register({ name, email, password });
      
      if (response.success && response.user) {
        const userData = {
          ...response.user,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${response.user.email}`
        };
        
        setUser(userData);
        // Store the complete user object and token
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('authToken', response.token);

        return { success: true, user: userData };
      } else {
        throw new Error(response.error || 'Registration failed');
      }
    } catch (error) {
      return { success: false, error: error.message };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear everything from storage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    isLoading,
    isInitializing,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};