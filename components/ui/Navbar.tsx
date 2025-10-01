'use client';

import React from 'react';
import { Search, Menu } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface NavbarProps {
  companyName?: string;
  onToggleSidebar?: () => void;
}

export function Navbar({ companyName = "Mayert Inc", onToggleSidebar }: NavbarProps) {
  return (
    <div className="flex justify-between items-center px-4 py-2 border-b border-gray-200 bg-white">
      <div className="flex items-center gap-3">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar}
            className="p-1 rounded-md hover:bg-gray-100"
            aria-label="Toggle sidebar"
          >
            <Menu className="h-5 w-5 text-gray-500" />
          </button>
        )}
        <button className="flex items-center gap-2 text-blue-600 font-medium">
          <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>{companyName}</span>
        </button>
      </div>
      <div className="flex items-center gap-4">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input 
            placeholder="Search for module" 
            className="w-48 pl-8 h-8 bg-gray-50 border-gray-200 rounded-md text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <button className="text-gray-400 hover:text-gray-600">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </button>
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center">
            <span className="font-medium text-sm">JM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
