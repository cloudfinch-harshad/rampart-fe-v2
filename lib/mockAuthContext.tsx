'use client';

import React, { createContext, useContext, useState } from 'react';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  companyName: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  register: (data: {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
}

// Mock user for development
const mockUser: User = {
  id: 'mock-user-id',
  email: 'user@example.com',
  firstName: 'James',
  lastName: 'Mayert',
  companyName: 'Mayert Inc',
};

const MockAuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
});

export const useMockAuth = () => useContext(MockAuthContext);

export const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(mockUser);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    setUser(mockUser);
    setIsLoading(false);
    
    return { success: true, message: 'Logged in successfully' };
  };

  const register = async (data: {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const newUser = {
      ...mockUser,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      companyName: data.companyName,
    };
    
    setUser(newUser);
    setIsLoading(false);
    
    return { success: true, message: 'Registered successfully' };
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <MockAuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </MockAuthContext.Provider>
  );
};
