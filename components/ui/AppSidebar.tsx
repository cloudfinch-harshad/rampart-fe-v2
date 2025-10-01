'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

interface SidebarItemProps {
  href: string;
  children: React.ReactNode;
  isActive?: boolean;
}

const SidebarItem = ({ href, children, isActive }: SidebarItemProps) => {
  return (
    <div className={cn("px-4 py-2", isActive && "bg-blue-50")}>
      <Link href={href} className="w-full text-left text-gray-700 py-1 block">
        {children}
      </Link>
    </div>
  );
};

export function AppSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-52 bg-white border-r border-gray-200 h-screen">
      <div className="p-4">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-600">rampart</span>
        </div>
      </div>
      
      <div className="mt-4">
        <div className="px-4 py-2">
          <Link href="/dashboard" className="w-full text-left text-blue-600 font-medium py-1 block">
            HOME
          </Link>
        </div>
        
        <div className="px-4 py-2">
          <button className="w-full text-left text-gray-700 py-1 flex items-center">
            <span>Audit Management</span>
            <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        
        <SidebarItem href="/gri" isActive={pathname === '/gri'}>
          GRI
        </SidebarItem>
        
        <SidebarItem href="/dashboard" isActive={pathname === '/dashboard'}>
          Dashboard
        </SidebarItem>
        
        <SidebarItem href="/planning" isActive={pathname === '/planning'}>
          Planning
        </SidebarItem>
        
        <SidebarItem href="/esg-aura" isActive={pathname === '/esg-aura'}>
          ESG Aura
        </SidebarItem>
        
        <SidebarItem href="/sdg-goals" isActive={pathname === '/sdg-goals'}>
          SDG Goals
        </SidebarItem>
        
        <SidebarItem href="/compliance-hub" isActive={pathname === '/compliance-hub'}>
          Compliance Hub
        </SidebarItem>
        
        <SidebarItem href="/capas" isActive={pathname === '/capas'}>
          CAPAs
        </SidebarItem>
        
        <SidebarItem href="/collaborate" isActive={pathname === '/collaborate'}>
          Collaborate
        </SidebarItem>
      </div>
    </div>
  );
}
