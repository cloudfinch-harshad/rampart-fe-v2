"use client"

import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { useState, useEffect } from "react"

interface SearchBarProps {
  placeholder: string
  value: string
  onChange: (value: string) => void
  className?: string
}

export function SearchBar({ 
  placeholder, 
  value, 
  onChange, 
  className 
}: SearchBarProps) {

  const [text, setText] = useState(value);
  
  // Determine className based on placeholder text
  const getClassNameByPlaceholder = () => {
    if (className) return className; // Use provided className if available
    
    const placeholderLength = placeholder.length;
    
    // Short placeholders (< 20 characters)
    if (placeholderLength < 20) {
      return "min-w-48 w-full sm:w-64";
    }
    // Medium placeholders (20-40 characters)
    else if (placeholderLength < 40) {
      return "min-w-64 w-full sm:w-80";
    }
    // Long placeholders (40-60 characters)
    else if (placeholderLength < 60) {
      return "min-w-80 w-full sm:w-96";
    }
    // Very long placeholders (60+ characters)
    else {
      return "min-w-96 w-[500px]";
    }
  };
  
  const dynamicClassName = getClassNameByPlaceholder();
  
  // Update local state when value prop changes
  useEffect(() => {
    setText(value);
  }, [value]);
  
  // Animation is active whenever text is present
  const handleSearchIconClick = () => {
    // Trigger search regardless of value
    onChange(text);
  };
  
  // Handle text changes
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setText(newValue);
    
    // If text is cleared (empty string), trigger onChange immediately
    if (newValue === '') {
      onChange('');
    }
  };

  return (
    <div className={`relative ${dynamicClassName}`}>
      <Input
        placeholder={placeholder}
        value={text}
        onChange={handleTextChange}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            handleSearchIconClick();
          }
        }}
        className="pl-8 pr-10 w-full"
      />
      <style jsx global>{`
        @keyframes glow {
          0%, 100% { filter: drop-shadow(0 0 2px rgba(59, 130, 246, 0)); transform: translateY(0); }
          50% { filter: drop-shadow(0 0 5px rgba(59, 130, 246, 0.7)); transform: translateY(-2px); }
        }
        .search-icon-animate {
          animation: glow 1.5s ease-in-out infinite;
        }
      `}</style>
      <Search 
        className={cn(
          "absolute right-2.5 top-2.5 h-4 w-4 cursor-pointer",
          "transition-all duration-300 ease-in-out",
          text ? "text-primary hover:scale-125 hover:rotate-12" : "text-muted-foreground hover:text-gray-500",
          text ? "search-icon-animate" : ""
        )}
        onClick={handleSearchIconClick}
      />
    </div>
  )
}
