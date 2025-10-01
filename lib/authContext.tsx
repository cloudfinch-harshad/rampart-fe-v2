'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { apiService } from './api';
import { useRouter } from 'next/navigation';

interface User {
  id?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  companyName?: string;
  [key: string]: any;
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

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  isLoading: true,
  login: async () => ({ success: false, message: 'Not implemented' }),
  register: async () => ({ success: false, message: 'Not implemented' }),
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

// Helper function to set a cookie that works with Next.js middleware
type CookieOptions = {
  path?: string;
  domain?: string;
  'max-age'?: number;
  expires?: string;
  SameSite?: 'Strict' | 'Lax' | 'None';
  secure?: boolean;
  [key: string]: string | number | boolean | undefined;
};

const setCookie = (name: string, value: string, options: CookieOptions = {}) => {
  if (typeof window === 'undefined') return;
  
  const cookieOptions = {
    path: '/',
    ...options,
  };
  
  let cookieString = `${name}=${encodeURIComponent(value)}`;
  
  Object.entries(cookieOptions).forEach(([key, val]) => {
    cookieString += `; ${key}`;
    // Only add value if it's not a boolean true or undefined
    if (val !== true && val !== undefined) {
      cookieString += `=${val}`;
    }
  });
  
  document.cookie = cookieString;
};

// Helper function to synchronize token between localStorage and cookies
const syncToken = (token: string | null) => {
  if (typeof window === 'undefined') return; // Only run on client side
  
  if (token) {
    // Set token in localStorage
    localStorage.setItem('authToken', token);
    
    // Set token in cookies with attributes that work with Next.js middleware
    setCookie('authToken', token, {
      path: '/',
      'max-age': 86400,
      SameSite: 'Lax',
      secure: window.location.protocol === 'https:',
    });
  } else {
    // Clear token from localStorage
    localStorage.removeItem('authToken');
    
    // Clear token from cookies
    setCookie('authToken', '', {
      path: '/',
      'max-age': 0,
      expires: 'Thu, 01 Jan 1970 00:00:00 GMT',
      SameSite: 'Lax',
    });
  }
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is authenticated on initial load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Only run on client side
        if (typeof window === 'undefined') {
          setIsLoading(false);
          return;
        }

        // First check if we have a token in localStorage
        const token = localStorage.getItem('authToken');
        
        // If no token in localStorage, clear any potential cookies and exit
        if (!token) {
          syncToken(null);
          setIsLoading(false);
          return;
        }

        // Ensure cookies are set with the token from localStorage
        // This is crucial for middleware to work properly
        syncToken(token);

        // If we have a token, try to get the user data
        const response = await apiService.getUser();
        if (response.success && response.data) {
          setUser(response.data);
        } else {
          // Token is invalid or expired
          console.log('Token invalid or expired, logging out');
          syncToken(null);
          setUser(null);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        syncToken(null);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    // Run the auth check
    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await apiService.login({ email, password });
      if (response.success && response.jwtToken) {
        // Synchronize token between localStorage and cookies
        syncToken(response.jwtToken);
        
        // Only try to get user data if login was successful
        try {
          const userResponse = await apiService.getUser();
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data);
          }
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          // Continue with login success even if user data fetch fails
        }
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false, message: 'Login failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: {
    companyName: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => {
    setIsLoading(true);
    try {
      const response = await apiService.register(data);
      if (response.success && response.jwtToken) {
        // Synchronize token between localStorage and cookies
        syncToken(response.jwtToken);
        
        // Only try to get user data if registration was successful
        try {
          const userResponse = await apiService.getUser();
          if (userResponse.success && userResponse.data) {
            setUser(userResponse.data);
          }
        } catch (userError) {
          console.error('Failed to fetch user data:', userError);
          // Continue with registration success even if user data fetch fails
        }
        return { success: true, message: response.message };
      }
      return { success: false, message: response.message };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false, message: 'Registration failed. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear auth data using syncToken helper
    syncToken(null);
    
    // Reset user state
    setUser(null);
    
    // Redirect to login page
    router.push('/login');
  };

  return (
    <AuthContext.Provider
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
    </AuthContext.Provider>
  );
};
