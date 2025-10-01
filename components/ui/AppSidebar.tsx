'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarNavigation, NavItem } from '@/lib/navigation';
import { ChevronDown, ChevronRight, User, LogOut } from 'lucide-react';
import { useAuth } from '@/lib/authContext';

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  level?: number;
  sectionTitle?: string;
}

const SidebarItem = ({ item, isActive, level = 0, sectionTitle }: SidebarItemProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(item.isExpanded || false);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  
  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <>
      {sectionTitle && level === 0 && (
        <div className="px-4 py-2 mt-4">
          
          <span className="text-sm font-medium text-gray-500">{sectionTitle}</span>
        </div>
      )}
      <div className={cn(
        "px-4 py-1.5", 
        isActive && "bg-gray-100",
        level > 0 && "py-1"
      )}>
        {hasChildren ? (
          <button 
            onClick={handleToggle}
            className={cn(
              "w-full text-left py-1 flex items-center justify-between",
              isActive ? "text-black font-medium" : "text-gray-800",
              level > 0 && "pl-10"
            )}
          >
            <div className="flex items-center gap-3">
              {Icon && <Icon className={cn("w-5 h-5", level > 0 && "text-amber-600")} />}
              <span className={cn(
                "text-sm font-medium",
                level > 0 && "text-amber-600"
              )}>{item.title}</span>
            </div>
            {hasChildren && (
              isExpanded ? 
                <ChevronDown className="w-4 h-4 text-gray-500" /> : 
                <ChevronRight className="w-4 h-4 text-gray-500" />
            )}
          </button>
        ) : (
          <Link 
            href={item.href} 
            className={cn(
              "w-full text-left py-1 flex items-center gap-3",
              isActive ? "text-black font-medium" : "text-gray-800",
              level > 0 && "pl-10"
            )}
          >
            {Icon && <Icon className={cn("w-5 h-5", level > 0 && "text-amber-600")} />}
            <span className={cn(
              "text-sm font-medium",
              level > 0 && "text-amber-600"
            )}>{item.title}</span>
          </Link>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="">
          {item.children?.map((child, index) => {
            const childPath = child.href;
            const isChildActive = pathname === childPath;
            
            return (
              <SidebarItem 
                key={`${child.href}-${index}`}
                item={child}
                isActive={isChildActive}
                level={level + 1}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

const UserProfile = () => {
  const { user } = useAuth() || { user: { name: "john yhtgfr", email: "harshad2@gmail.com" } };
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="border-t border-gray-200 mt-auto py-2 px-4">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-2 px-1"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600">
            {user?.name?.charAt(0) || 'J'}
          </div>
          <div className="text-left">
            <div className="text-sm font-medium">{user?.name || 'John Doe'}</div>
            <div className="text-xs text-gray-500">{user?.email || 'john@example.com'}</div>
          </div>
        </div>
        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
      </button>
      
      {isExpanded && (
        <div className="mt-2 border-t border-gray-100 pt-2">
          <Link href="/profile" className="flex items-center gap-3 px-1 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded">
            <User className="w-4 h-4" />
            <span>Profile</span>
          </Link>
          <button className="w-full flex items-center gap-3 px-1 py-2 text-sm text-red-600 hover:bg-gray-100 rounded text-left">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      )}
    </div>
  );
};

export function AppSidebar() {
  const pathname = usePathname();
  
  // Group navigation items by section
  const platformItems = sidebarNavigation.slice(0, 6); // First 6 items
  const projectItems = sidebarNavigation.slice(6, 8); // Next 2 items
  const supportItems = sidebarNavigation.slice(8); // Remaining items
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded bg-cyan-100 flex items-center justify-center">
            <span className="text-cyan-600 font-bold text-lg">R</span>
          </div>
          <div>
            <div className="font-bold text-gray-900">Rampart</div>
            <div className="text-xs text-gray-500">Logistics Platform</div>
          </div>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2 mt-2">
          <span className="text-sm font-medium text-gray-500">Platform</span>
        </div>
        
        {platformItems.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.children?.some(child => pathname === child.href) || false);
          
          return (
            <SidebarItem 
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
            />
          );
        })}
        
        <div className="px-4 py-2 mt-4">
          <span className="text-sm font-medium text-gray-500">Projects</span>
        </div>
        
        {projectItems.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.children?.some(child => pathname === child.href) || false);
          
          return (
            <SidebarItem 
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
            />
          );
        })}
        
        <div className="px-4 py-2 mt-4">
          <span className="text-sm font-medium text-gray-500">Support</span>
        </div>
        
        {supportItems.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.children?.some(child => pathname === child.href) || false);
          
          return (
            <SidebarItem 
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
            />
          );
        })}
      </div>
      
      <UserProfile />
    </div>
  );
}
