"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { DropdownOption } from "./FilterPopover"

export interface FilterGroup {
  id: string
  label: string
  values: (string | DropdownOption)[]
  onRemove: (value: string | DropdownOption) => void
  badgeClassName?: string
}

interface FilterBadgesProps {
  filterGroups: FilterGroup[]
  onClearAll: () => void
  visible?: boolean
}

export function FilterBadges({ filterGroups, onClearAll, visible = false }: FilterBadgesProps) {
  const hasActiveFilters = visible || filterGroups.some(group => group.values.length > 0)
  
  if (!hasActiveFilters) return null
  
  return (
    <div className="flex flex-wrap gap-2 items-center">
      <span className="text-sm text-muted-foreground">Active filters:</span>
      
      {filterGroups.map(group => (
        group.values.map(value => {
          // Extract the display text and key from the value
          const displayText = typeof value === 'object' ? value.label : value;
          const valueKey = typeof value === 'object' ? value.value : value;
          
          return (
            <Badge
              key={`${group.id}-${valueKey}`}
              variant="outline"
              className={`flex items-center gap-1 ${group.badgeClassName || "bg-blue-50 text-blue-700 hover:bg-blue-100"}`}
            >
              {displayText}
              {/* <X
                className="h-3 w-3 cursor-pointer"
                onClick={(e) => {
                  e.stopPropagation();
                  if (typeof group.onRemove === 'function') {
                    group.onRemove(value);
                  }
                }}
              /> */}
            </Badge>
          );
        })
      ))}
      
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-2 text-xs"
          onClick={onClearAll}
        >
          Clear all
        </Button>
      )}
    </div>
  )
}
