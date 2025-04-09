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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Set up the unauthorized callback
    apiClient.setOnUnauthorized(() => {
      setUser(null);
      setToken(null);
      setIsAuthenticated(false);
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