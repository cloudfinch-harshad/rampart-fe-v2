'use client';

import React from 'react';
import { AuthBanner } from './AuthBanner';
import { AuthFooter } from './AuthFooter';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
  titleIcon?: React.ReactNode;
}

/**
 * Layout component for authentication pages
 * Includes the banner, title, subtitle, and footer
 */
export function AuthLayout({ children, title, subtitle, titleIcon }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left side banner */}
      <AuthBanner />
      
      {/* Right side content */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold mb-2">
              {title}
              {titleIcon && <span className="ml-2">{titleIcon}</span>}
            </h2>
            <p className="text-gray-500">
              {subtitle}
            </p>
          </div>
          
          {children}
          
          <AuthFooter />
        </div>
      </div>
    </div>
  );
}
