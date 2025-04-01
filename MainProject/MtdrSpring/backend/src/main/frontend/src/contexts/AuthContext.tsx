import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiClient } from '../api/client';

interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
  isAuthenticated: boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('auth_token');
    return storedToken;
  });

  useEffect(() => {
    if (token) {
      localStorage.setItem('auth_token', token);
      apiClient.setToken(token);
    } else {
      localStorage.removeItem('auth_token');
      apiClient.setToken(null);
    }
  }, [token]);

  const logout = () => {
    setToken(null);
    localStorage.removeItem('user');
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        setToken,
        isAuthenticated,
        logout,
      }}
    >
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