import React, { createContext, useContext, useState, useEffect } from 'react';
import apiService from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);

  // Check for existing token on app startup
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      // In a real app, you'd verify the token with the server
      // For now, we'll assume it's valid and extract user info
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        if (payload.exp * 1000 > Date.now()) {
          setUser({
            id: payload.id,
            email: payload.email,
            name: localStorage.getItem('userName') || 'User',
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${payload.email}`
          });
        } else {
          // Token expired
          localStorage.removeItem('authToken');
          localStorage.removeItem('userName');
        }
      } catch (error) {
        // Invalid token
        localStorage.removeItem('authToken');
        localStorage.removeItem('userName');
      }
    }
    setIsInitializing(false);
  }, []);

  const login = async (email, password) => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });
      
      if (response.success) {
        const userData = {
          ...response.user,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${response.user.email}`
        };
        setUser(userData);
        localStorage.setItem('userName', userData.name);
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
      
      if (response.success) {
        const userData = {
          ...response.user,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${response.user.email}`
        };
        setUser(userData);
        localStorage.setItem('userName', userData.name);
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
    apiService.logout();
    localStorage.removeItem('userName');
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