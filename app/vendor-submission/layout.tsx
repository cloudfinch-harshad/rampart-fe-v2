'use client';

import { ReactNode } from 'react';
import Image from 'next/image';
import { Card } from '@/components/ui/card';

interface VendorSubmissionLayoutProps {
  children: ReactNode;
}

export default function VendorSubmissionLayout({ children }: VendorSubmissionLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto py-4 px-4 flex items-center justify-between">
          <div className="flex items-center">
            <Image 
              src="/logo.svg" 
              alt="CargoGen Logo" 
              width={40} 
              height={40}
              className="mr-2"
              onError={(e) => {
                // Fallback if logo.svg doesn't exist
                e.currentTarget.src = "/favicon.ico";
              }}
            />
            <h1 className="text-xl font-semibold">BRSR Vendor Portal</h1>
          </div>
          <div className="text-sm text-gray-500">
            Secure Vendor Submission
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-auto">
        <div className="container mx-auto py-4 px-4">
          <div className="text-center text-sm text-gray-500">
            <p>© {new Date().getFullYear()} CargoGen. All rights reserved.</p>
            <p className="mt-1">For support, contact support@cargogen.com</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
