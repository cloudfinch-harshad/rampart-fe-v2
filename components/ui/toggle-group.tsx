"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

interface ToggleGroupProps {
  type: "single" | "multiple";
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  className?: string;
  children?: React.ReactNode;
}

export function ToggleGroup({
  type,
  value,
  defaultValue,
  onValueChange,
  className,
  children,
}: ToggleGroupProps) {
  const [selectedValue, setSelectedValue] = React.useState<string>(value || defaultValue || "");

  React.useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  }, [value]);

  const handleValueChange = (newValue: string) => {
    if (type === "single") {
      setSelectedValue(newValue);
      onValueChange?.(newValue);
    }
  };

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-md bg-muted p-1",
        className
      )}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, {
            isSelected: selectedValue === child.props.value,
            onSelect: () => handleValueChange(child.props.value),
          });
        }
        return child;
      })}
    </div>
  );
}

interface ToggleGroupItemProps {
  value: string;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
  children?: React.ReactNode;
  "aria-label"?: string;
}

export function ToggleGroupItem({
  value,
  isSelected,
  onSelect,
  className,
  children,
  "aria-label": ariaLabel,
}: ToggleGroupItemProps) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={isSelected}
      aria-label={ariaLabel}
      className={cn(
        "inline-flex items-center justify-center rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        isSelected
          ? "bg-black text-white shadow-sm"
          : "text-muted-foreground hover:bg-background/50 hover:text-foreground",
        className
      )}
      onClick={onSelect}
    >
      {children}
    </button>
  );
}
