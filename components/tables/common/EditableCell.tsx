"use client";

import React, { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface EditableCellProps {
  value: string | number;
  onChange: (value: string | number) => void;
  type?: "text" | "number" | "date";
  isEditing: boolean;
  onEditToggle?: () => void;
  className?: string;
  precision?: number; // For number formatting (decimal places)
  dateFormat?: string; // For date formatting
}

export function EditableCell({
  value,
  onChange,
  type = "text",
  isEditing,
  onEditToggle,
  className = "",
  precision = 3,
  dateFormat = "yyyy-MM-dd",
}: EditableCellProps) {
  const [internalValue, setInternalValue] = useState<string | number>(value);
  const inputRef = useRef<HTMLInputElement>(null);

  // Update internal value when external value changes
  useEffect(() => {
    setInternalValue(value);
  }, [value]);

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = type === "number" ? parseFloat(e.target.value) : e.target.value;
    setInternalValue(newValue);
  };

  const handleBlur = () => {
    onChange(internalValue);
    if (onEditToggle) {
      onEditToggle();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onChange(internalValue);
      if (onEditToggle) {
        onEditToggle();
      }
    } else if (e.key === "Escape") {
      setInternalValue(value); // Reset to original value
      if (onEditToggle) {
        onEditToggle();
      }
    }
  };

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const formattedDate = format(date, dateFormat);
      setInternalValue(formattedDate);
      onChange(formattedDate);
      if (onEditToggle) {
        onEditToggle();
      }
    }
  };

  // Display formatted value when not editing
  if (!isEditing) {
    if (type === "number" && typeof value === "number") {
      return <span className={className}>{value.toFixed(precision)}</span>;
    } else if (type === "date" && value) {
      try {
        // Try to format the date, but handle invalid dates gracefully
        return <span className={className}>{format(new Date(value.toString()), dateFormat)}</span>;
      } catch (error) {
        return <span className={className}>{value}</span>;
      }
    } else {
      return <span className={className}>{value}</span>;
    }
  }

  // Render appropriate input type when editing
  if (type === "date") {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !value && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {value ? format(new Date(value.toString()), dateFormat) : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={value ? new Date(value.toString()) : undefined}
            onSelect={handleDateSelect}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <Input
      ref={inputRef}
      type={type}
      value={internalValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      className={cn("w-full h-8", className)}
      step={type === "number" ? "0.001" : undefined}
    />
  );
}
