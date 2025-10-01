'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { sidebarNavigation, NavItem } from '@/lib/navigation';
import { ChevronDown, ChevronRight, User, LogOut, ChevronLeftCircle, ChevronRightCircle, Menu } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuth } from '@/lib/authContext';

interface SidebarItemProps {
  item: NavItem;
  isActive: boolean;
  level?: number;
  sectionTitle?: string;
  isCollapsed?: boolean;
}

const SidebarItem = ({ item, isActive, level = 0, sectionTitle, isCollapsed = false }: SidebarItemProps) => {
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
      {sectionTitle && level === 0 && !isCollapsed && (
        <div className="px-4 py-2 mt-4">
          <span className="text-sm font-medium text-gray-500">{sectionTitle}</span>
        </div>
      )}
      {sectionTitle && level === 0 && isCollapsed && (
        <div className="py-2 mt-4 flex justify-center">
          <div className="w-8 border-b border-gray-200"></div>
        </div>
      )}
      <div className={cn(
        isCollapsed ? "px-2 py-1.5" : "px-4 py-1.5", 
        isActive && "bg-gray-100",
        level > 0 && "py-1"
      )}>
        {hasChildren ? (
          isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <button 
                  onClick={handleToggle}
                  className={cn(
                    "w-full py-1 flex items-center justify-center",
                    isActive ? "text-black font-medium" : "text-gray-800",
                  )}
                >
                  {Icon && <Icon className={cn("w-5 h-5", level > 0 && "text-amber-600")} />}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right" className="p-0 overflow-hidden">
                <div className="p-2">
                  <div className="font-medium mb-1">{item.title}</div>
                  {item.children && item.children.length > 0 && (
                    <div className="text-xs space-y-1">
                      {item.children.map((child, idx) => (
                        <div key={idx} className="flex items-center gap-1">
                          {child.icon && <child.icon className="w-3 h-3 text-amber-600" />}
                          <span className="text-amber-600">{child.title}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </TooltipContent>
            </Tooltip>
          ) : (
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
          )
        ) : (
          isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Link 
                  href={item.href} 
                  className={cn(
                    "w-full py-1 flex items-center justify-center",
                    isActive ? "text-black font-medium" : "text-gray-800",
                  )}
                >
                  {Icon && <Icon className={cn("w-5 h-5", level > 0 && "text-amber-600")} />}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">
                <span>{item.title}</span>
              </TooltipContent>
            </Tooltip>
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
          )
        )}
      </div>
      
      {hasChildren && isExpanded && !isCollapsed && (
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
                isCollapsed={isCollapsed}
              />
            );
          })}
        </div>
      )}
    </>
  );
};

const UserProfile = ({ isCollapsed = false }) => {
  const { user } = useAuth() || { user: { name: "john yhtgfr", email: "harshad2@gmail.com" } };
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (isCollapsed) {
    return (
      <div className="border-t border-gray-200 mt-auto py-2 flex justify-center">
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-600 cursor-pointer">
              {user?.name?.charAt(0) || 'J'}
            </div>
          </TooltipTrigger>
          <TooltipContent side="right">
            <div className="py-1">
              <div className="font-medium">{user?.name || 'John Doe'}</div>
              <div className="text-xs text-gray-500">{user?.email || 'john@example.com'}</div>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>
    );
  }
  
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

interface AppSidebarProps {
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export function AppSidebar({ isCollapsed = false, onToggleCollapse }: AppSidebarProps) {
  const pathname = usePathname();
  // Use internal state only if no external control is provided
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  
  // Determine if we're using internal or external state
  const collapsed = onToggleCollapse !== undefined ? isCollapsed : internalCollapsed;
  
  // Store collapsed state in localStorage when using internal state
  useEffect(() => {
    if (onToggleCollapse === undefined) {
      const storedCollapsedState = localStorage.getItem('sidebarCollapsed');
      if (storedCollapsedState) {
        setInternalCollapsed(storedCollapsedState === 'true');
      }
    }
  }, [onToggleCollapse]);

  // Toggle function that uses either external or internal state
  const toggleCollapse = () => {
    if (onToggleCollapse) {
      onToggleCollapse();
    } else {
      const newState = !internalCollapsed;
      setInternalCollapsed(newState);
      localStorage.setItem('sidebarCollapsed', String(newState));
    }
  };
  
  // Group navigation items by section
  const platformItems = sidebarNavigation.slice(0, 6); // First 6 items
  const projectItems = sidebarNavigation.slice(6, 8); // Next 2 items
  const supportItems = sidebarNavigation.slice(8); // Remaining items
  
  return (
    <div className={cn(
      "bg-white border-r border-gray-200 h-screen overflow-y-auto flex flex-col transition-all duration-300 ease-in-out",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className={cn(
        "border-b border-gray-200 flex items-center",
        collapsed ? "p-2 justify-center" : "p-4"
      )}>
        {collapsed ? (
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="w-8 h-8 rounded bg-cyan-100 flex items-center justify-center cursor-pointer">
                <span className="text-cyan-600 font-bold text-lg">R</span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <div>
                <div className="font-bold">Rampart</div>
                <div className="text-xs text-gray-500">Logistics Platform</div>
              </div>
            </TooltipContent>
          </Tooltip>
        ) : (
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded bg-cyan-100 flex items-center justify-center">
              <span className="text-cyan-600 font-bold text-lg">R</span>
            </div>
            <div>
              <div className="font-bold text-gray-900">Rampart</div>
              <div className="text-xs text-gray-500">Logistics Platform</div>
            </div>
          </div>
        )}
        
        <button 
          onClick={toggleCollapse} 
          className={cn(
            "p-1 rounded-full hover:bg-gray-100",
            collapsed ? "ml-0" : "ml-2"
          )}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? 
            <ChevronRightCircle className="w-5 h-5 text-gray-500" /> : 
            <ChevronLeftCircle className="w-5 h-5 text-gray-500" />
          }
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {!collapsed && (
          <div className="px-4 py-2 mt-2">
            <span className="text-sm font-medium text-gray-500">Platform</span>
          </div>
        )}
        {collapsed && (
          <div className="py-2 mt-2 flex justify-center">
            <div className="w-8 border-b border-gray-200"></div>
          </div>
        )}
        
        {platformItems.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.children?.some(child => pathname === child.href) || false);
          
          return (
            <SidebarItem 
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
              isCollapsed={collapsed}
            />
          );
        })}
        
        {!collapsed ? (
          <div className="px-4 py-2 mt-4">
            <span className="text-sm font-medium text-gray-500">Projects</span>
          </div>
        ) : (
          <div className="py-2 mt-4 flex justify-center">
            <div className="w-8 border-b border-gray-200"></div>
          </div>
        )}
        
        {projectItems.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.children?.some(child => pathname === child.href) || false);
          
          return (
            <SidebarItem 
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
              isCollapsed={collapsed}
            />
          );
        })}
        
        {!collapsed ? (
          <div className="px-4 py-2 mt-4">
            <span className="text-sm font-medium text-gray-500">Support</span>
          </div>
        ) : (
          <div className="py-2 mt-4 flex justify-center">
            <div className="w-8 border-b border-gray-200"></div>
          </div>
        )}
        
        {supportItems.map((item, index) => {
          const isActive = pathname === item.href || 
            (item.children?.some(child => pathname === child.href) || false);
          
          return (
            <SidebarItem 
              key={`${item.href}-${index}`}
              item={item}
              isActive={isActive}
              isCollapsed={collapsed}
            />
          );
        })}
      </div>
      
      <UserProfile isCollapsed={collapsed} />
    </div>
  );
}
