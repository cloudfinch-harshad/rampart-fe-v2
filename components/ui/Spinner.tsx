"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface SpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

/**
 * Spinner component that uses the cargogen-small.png image
 * 
 * @param size - Size of the spinner: sm (32px), md (48px), lg (64px)
 * @param className - Additional classes to apply to the spinner
 */
export function Spinner({ 
  size = "md", 
  className = ""
}: SpinnerProps) {
  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-44 w-44",
  };

  return (
    <div className="flex items-center justify-center">
      <div className={cn("animate-bounce", sizeClasses[size], className)}>
        <img 
          src="/images/cargogen-small.png" 
          alt="Loading" 
          className="w-full h-full object-contain" 
        />
      </div>
    </div>
  );
}

export default Spinner;
