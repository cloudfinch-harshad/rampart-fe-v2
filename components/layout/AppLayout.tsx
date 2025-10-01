'use client';

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/authContext';
import { AppSidebar } from '@/components/ui/AppSidebar';
import { Navbar } from '@/components/ui/Navbar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  // For development purposes, we'll check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  // Use the real auth hook
  const { isAuthenticated, isLoading } = useAuth();
  
  const router = useRouter();
  const pathname = usePathname();
  
  // State for sidebar collapse
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  // Load sidebar state from localStorage
  useEffect(() => {
    const storedState = localStorage.getItem('sidebarCollapsed');
    if (storedState) {
      setIsSidebarCollapsed(storedState === 'true');
    }
  }, []);
  
  // Toggle sidebar collapsed state
  const toggleSidebar = () => {
    const newState = !isSidebarCollapsed;
    setIsSidebarCollapsed(newState);
    localStorage.setItem('sidebarCollapsed', String(newState));
  };
  
  // List of routes where we don't want to show the layout
  const authRoutes = ['/login', '/register', '/forgot-password'];
  
  // Check if current path is in the auth routes
  const isAuthRoute = authRoutes.includes(pathname);
  
  // Debug logs
  console.log('AppLayout rendering with:', {
    pathname,
    isAuthenticated,
    isLoading,
    isAuthRoute,
    isDevelopment
  });

  // Authentication check - always call hooks at the top level
  React.useEffect(() => {
    // Only redirect in production or when explicitly testing auth flow
    if (!isDevelopment && !isLoading && !isAuthenticated && !isAuthRoute) {
      router.push('/login');
    }
  }, [isAuthenticated, isLoading, router, isAuthRoute, isDevelopment]);
  
  // Determine what to render based on conditions
  // If we're on an auth route, just render the children without the layout
  if (isAuthRoute) {
    return <>{children}</>;
  }
  
  // Show loading spinner while checking authentication
  if (isLoading && !isDevelopment) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // In development, we'll show the layout even if not authenticated
  // In production, we'll only show if authenticated
  if (!isAuthenticated && !isAuthRoute && !isDevelopment) {
    return null;
  }
  
  // Otherwise, render the full layout with sidebar and navbar
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left Sidebar */}
      <AppSidebar isCollapsed={isSidebarCollapsed} onToggleCollapse={toggleSidebar} />
      
      <div className="flex-1">
        {/* Top Navigation */}
        <Navbar onToggleSidebar={toggleSidebar} />
        
        {/* Main Content */}
        <div className="p-4 w-full bg-gray-50">
          {children}
        </div>
      </div>
    </div>
  );
}
