"use client";

import React, { ReactNode } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
  disabled?: boolean;
}

export interface ReusableTabsProps {
  tabs: TabItem[];
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  tabsListClassName?: string;
  tabsTriggerClassName?: string;
  tabsContentClassName?: string;
  orientation?: "horizontal" | "vertical";
  variant?: "default" | "outline" | "pills";
}

export function ReusableTabs({
  tabs,
  defaultValue,
  value,
  onValueChange,
  className,
  tabsListClassName,
  tabsTriggerClassName,
  tabsContentClassName,
  orientation = "horizontal",
  variant = "default",
}: ReusableTabsProps) {
  // Determine the default tab value if not provided
  const initialValue = defaultValue || tabs[0]?.id;
  
  // Variant-specific styling
  const getVariantStyles = () => {
    switch (variant) {
      case "outline":
        return {
          list: "border-b rounded-none px-4",
          trigger: "rounded-t-md border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary",
        };
      case "pills":
        return {
          list: "gap-2 p-1",
          trigger: "rounded-full data-[state=active]:bg-primary data-[state=active]:text-primary-foreground",
        };
      default:
        return {
          list: "bg-muted rounded-lg p-1",
          trigger: "data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm",
        };
    }
  };

  const variantStyles = getVariantStyles();
  
  return (
    <Tabs
      defaultValue={initialValue}
      value={value}
      onValueChange={onValueChange}
      className={cn(
        "w-full",
        orientation === "vertical" && "flex gap-4",
        className
      )}
    >
      <TabsList 
        className={cn(
          "w-full justify-start",
          orientation === "vertical" && "flex-col h-auto w-auto",
          variantStyles.list,
          tabsListClassName
        )}
      >
        {tabs.map((tab) => (
          <TabsTrigger
            key={tab.id}
            value={tab.id}
            disabled={tab.disabled}
            className={cn(
              "transition-all",
              variantStyles.trigger,
              tabsTriggerClassName
            )}
          >
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>
      
      <div className={cn("flex-1", orientation === "vertical" && "w-full")}>
        {tabs.map((tab) => (
          <TabsContent 
            key={tab.id} 
            value={tab.id}
            className={cn("mt-2", tabsContentClassName)}
          >
            {tab.content}
          </TabsContent>
        ))}
      </div>
    </Tabs>
  );
}
