import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';
import { User } from '../interfaces/user';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  user: User | null;
  setUser: (user: User | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state from localStorage
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token');
  });

  const [isAuthenticated, setIsAuthenticated] = useState(!!token && !!user);

  // Persist user data to localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  // Persist token to localStorage
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    // Set up the unauthorized callback
    apiClient.setOnUnauthorized(() => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('token');
    });
  }, []);

  useEffect(() => {
    setIsAuthenticated(!!user && !!token);
    if (token) {
      apiClient.setToken(token);
    } else {
      apiClient.setToken(null);
    }
  }, [user, token]);

  const logout = () => {
    setUser(null);
    setToken(null);
    setIsAuthenticated(false);
    apiClient.setToken(null);
    // Clear localStorage
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, token, setToken, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 