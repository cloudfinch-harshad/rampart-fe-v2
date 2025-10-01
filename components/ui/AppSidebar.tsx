'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarNavigation, NavItem } from '@/lib/navigation';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  level?: number;
}

const SidebarItem = ({ item, isActive, level = 0 }: SidebarItemProps) => {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(item.isExpanded || false);
  const Icon = item.icon;
  const hasChildren = item.children && item.children.length > 0;
  const paddingLeft = level > 0 ? `pl-${level * 4}` : '';
  
  const handleToggle = (e: React.MouseEvent) => {
    if (hasChildren) {
      e.preventDefault();
      setIsExpanded(!isExpanded);
    }
  };
  
  return (
    <>
      <div className={cn("px-4 py-2", isActive && "bg-blue-50")}>
        {hasChildren ? (
          <button 
            onClick={handleToggle}
            className={cn(
              "w-full text-left text-gray-700 py-1 flex items-center justify-between",
              paddingLeft
            )}
          >
            <div className="flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5" />}
              <span>{item.title}</span>
            </div>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        ) : (
          <Link 
            href={item.href} 
            className={cn(
              "w-full text-left py-1 flex items-center gap-2",
              isActive ? "text-blue-600 font-medium" : "text-gray-700",
              paddingLeft
            )}
          >
            {Icon && <Icon className="w-5 h-5" />}
            <span>{item.title}</span>
          </Link>
        )}
      </div>
      
      {hasChildren && isExpanded && (
        <div className="bg-gray-50">
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

export function AppSidebar() {
  const pathname = usePathname();
  
  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen overflow-y-auto">
      <div className="p-4">
        <div className="flex items-center">
          <span className="text-xl font-bold text-blue-600">rampart</span>
        </div>
      </div>
      
      <div className="mt-4">
        {sidebarNavigation.map((item, index) => {
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
    </div>
  );
}
