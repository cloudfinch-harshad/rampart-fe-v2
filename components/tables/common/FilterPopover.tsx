"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Filter, Calendar as CalendarIcon } from "lucide-react"
import { FilterType, selectValueType } from "@/hooks/useTableFilters"
import { SelectSearch } from "./SelectSearch"
import { LocationFilterGroup } from "./LcationFilters"
import { LocationData } from "@/types/locations"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import { Separator } from "@/components/ui/separator"

export type DropdownOption = {
  label: string
  value: string
  id?: string
  name?: string
}

export interface FilterTab {
  id: string
  label: string
  options: (string | DropdownOption)[]
  selected: (string | DropdownOption)[]
  onToggle: (value: string | DropdownOption | null) => void
  filterType?: FilterType
  api?: string
}

type LocationStringData = {
  country?: string | null
  state?: string | null
  city?: string | null
  fromDate?: string | null
  toDate?: string | null
}

interface FilterPopoverProps {
  tabs: FilterTab[]
  totalSelected: number
  dateFilters?: boolean
  locationFilters?: boolean
  onDateFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onLocationSelect?: (data: LocationData) => void
  cacheFilters?: LocationStringData
  onClearAll: () => void
  refetch?: () => void
}

export function FilterPopover({
  refetch,
  tabs,
  totalSelected,
  locationFilters,
  dateFilters,
  onDateFilterChange,
  onLocationSelect,
  cacheFilters,
  onClearAll
}: FilterPopoverProps) {
  // States for date pickers
  const [fromDate, setFromDate] = useState<Date | undefined>(undefined);
  const [toDate, setToDate] = useState<Date | undefined>(undefined);
  const [fromDateOpen, setFromDateOpen] = useState(false);
  const [toDateOpen, setToDateOpen] = useState(false);
  const [dateOpen, setDateOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);

  // Initialize date states from cache if available
  useEffect(() => {
    if (cacheFilters?.fromDate) {
      try {
        const date = new Date(cacheFilters.fromDate);
        if (!isNaN(date.getTime())) {
          setFromDate(date);
        }
      } catch (e) {
        console.error('Invalid from date format', e);
      }
    }
    if (cacheFilters?.toDate) {
      try {
        const date = new Date(cacheFilters.toDate);
        if (!isNaN(date.getTime())) {
          setToDate(date);
        }
      } catch (e) {
        console.error('Invalid to date format', e);
      }
    }
  }, [cacheFilters?.fromDate, cacheFilters?.toDate]);

  const getBadgeLabel = (filter: FilterTab) => {
    if (!filter.selected || (Array.isArray(filter.selected) && filter.selected.length === 0)) {
      return filter.label
    }

    if (filter.filterType === 'radio' || filter.filterType === 'select' || filter.filterType === 'select-search') {
      const selectedValue = Array.isArray(filter.selected) ? filter.selected[0] : filter.selected
      return `${filter.label}: ${typeof selectedValue === 'string' ? selectedValue : selectedValue.label || selectedValue.value}`
    }
    
    if (filter.filterType === 'date' && Array.isArray(filter.selected) && filter.selected.length > 0) {
      if (filter.selected.length === 1) {
        return `${filter.label}: ${filter.selected[0]}`
      }
      return `${filter.label}: ${filter.selected[0]} - ${filter.selected[1]}`
    }

    return `${filter.label} (${Array.isArray(filter.selected) ? filter.selected.length : 1})`
  }

  return (
    <Popover open={filterOpen} onOpenChange={setFilterOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 border-dashed">
          <Filter className="h-4 w-4" />
          <span>Filters</span>
          {totalSelected > 0 && (
            <Badge variant="secondary" className="rounded-full px-1 font-normal ml-1">
              {totalSelected}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[340px] p-4" align="end">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="font-medium text-sm">Filter Options</h4>
          </div>
          <Separator />
          <div className="grid grid-cols-1 max-h-[calc(100vh-450px)] overflow-y-auto gap-4 pt-2">
            {/* Date Filters Section */}
            {dateFilters && (
              <>
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">Date Range</h5>
                  <div className="flex flex-row justify-evenly">
                    {/* From Date */}
                    <div className="grid gap-2">
                      <Popover open={fromDateOpen} onOpenChange={setFromDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full border-b rounded-none justify-start text-left font-normal h-9"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {fromDate ? format(fromDate, "dd/MM/yyyy") : <span>From Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={fromDate}
                            disabled={(date) => {
                              // Disable dates before the fromDate if it's set
                              return toDate ? date > toDate : false;
                            }}
                            onSelect={(date) => {
                              setFromDate(date);
                              setFromDateOpen(false);

                              // Create synthetic event for compatibility with existing handlers
                              if (onDateFilterChange && date) {
                                const syntheticEvent = {
                                  target: {
                                    name: 'fromDate',
                                    value: date.toISOString(),
                                  },
                                } as React.ChangeEvent<HTMLInputElement>;

                                onDateFilterChange(syntheticEvent);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>

                    {/* To Date */}
                    <div className="grid gap-2">
                      <Popover open={toDateOpen} onOpenChange={setToDateOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="ghost"
                            className="w-full border-b rounded-none justify-start text-left font-normal h-9"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {toDate ? format(toDate, "dd/MM/yyyy") : <span>To Date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={toDate}
                            disabled={(date) => {
                              // Disable dates before the fromDate if it's set
                              return fromDate ? date < fromDate : false;
                            }}
                            onSelect={(date) => {
                              setToDate(date);
                              setToDateOpen(false);

                              // Create synthetic event for compatibility with existing handlers
                              if (onDateFilterChange && date) {
                                const syntheticEvent = {
                                  target: {
                                    name: 'toDate',
                                    value: date.toISOString(),
                                  },
                                } as React.ChangeEvent<HTMLInputElement>;

                                onDateFilterChange(syntheticEvent);
                              }
                            }}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>
                <Separator className="my-2" />
              </>
            )}

            {/* Location Filters Section */}
            {locationFilters && (
              <>
                <div className="space-y-2">
                  <LocationFilterGroup
                    onLocationChange={onLocationSelect}
                    cacheLocation={{
                      country: cacheFilters?.country || null,
                      state: cacheFilters?.state || null,
                      city: cacheFilters?.city || null
                    }}
                  />
                </div>
                <Separator className="my-2" />
              </>
            )}

            {/* Tab Filters Section */}
            {tabs.map((tab, index) => (
              <div key={tab.id} className="space-y-2">
                <h5 className="text-sm font-medium">{tab.label}</h5>
                {tab.filterType === 'select-search' ? (
                  <SelectSearch
                    apiEndpoint={tab.api || ''}
                    value={Array.isArray(tab.selected) && tab.selected.length > 0 ? 
                      (typeof tab.selected[0] === 'string' ? tab.selected[0] : tab.selected[0]) : 
                      null
                    }
                    onChange={(value) => {
                      // Handle the new object value format
                      tab.onToggle(value);
                    }}
                    placeholder={`Select ${tab.label.toLowerCase()}`}
                  />
                ) : tab.filterType === 'select' || tab.filterType === 'radio' ? (
                  <Select
                    value={Array.isArray(tab.selected) && tab.selected.length > 0 ? 
                      (typeof tab.selected[0] === 'string' ? tab.selected[0] : tab.selected[0].value || tab.selected[0].id || '') : ''}
                    onValueChange={(value: string) => {
                      // For select, we need to handle selection similarly to radio buttons
                      // First, clear any existing selection
                      if (tab.selected.length > 0) {
                        // Handle both string and object values
                        tab.selected.forEach(item => {
                          tab.onToggle(item);
                        });
                      }

                      // Then add the new selection
                      // Find the original option object to preserve label/name
                      const selectedOption = tab.options.find(option => {
                        if (typeof option === 'string') {
                          return option === value;
                        } else {
                          return option.value === value || option.id === value;
                        }
                      });
                      
                      if (selectedOption && typeof selectedOption !== 'string') {
                        // If we found the object option, use it
                        tab.onToggle(selectedOption);
                      } else {
                        // Otherwise just use the string value
                        tab.onToggle(value);
                      }
                    }}
                  >
                    <SelectTrigger className="w-full h-9">
                      <SelectValue placeholder={`Select ${tab.label.toLowerCase()}`} />
                    </SelectTrigger>
                    <SelectContent>
                      {tab.options.map(option => {
                        const optionValue = typeof option === 'string' ? option : (option.value || option.id || '');
                        const optionLabel = typeof option === 'string' ? option : (option.label || option.name || '');
                        return (
                          <SelectItem key={optionValue} value={optionValue}>
                            {optionLabel}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                ) : tab.filterType === "date" ? (
                  <div className="grid gap-2">
                    <Popover open={dateOpen} onOpenChange={setDateOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="w-full border-b rounded-none justify-start text-left font-normal h-9"
                        >
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {tab.selected && Array.isArray(tab.selected) && tab.selected[0] ? (
                            <span>
                              {format(
                                new Date(
                                  typeof tab.selected[0] === 'string' 
                                    ? tab.selected[0] 
                                    : (tab.selected[0] as DropdownOption).value
                                ), 
                                "PPP"
                              )}
                            </span>
                          ) : (
                            <span>Select Date</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={tab.selected && Array.isArray(tab.selected) && tab.selected[0] ? (
                            new Date(
                              typeof tab.selected[0] === 'string' 
                                ? tab.selected[0] 
                                : (tab.selected[0] as DropdownOption).value
                            )
                          ) : undefined}
                          onSelect={(date) => {
                            if (date && tab.onToggle) {
                              // Format date as string in yyyy-MM-dd format
                              const dateValue = format(date, 'yyyy-MM-dd');
                              
                              // Clear existing selection first
                              if (tab.selected && tab.selected.length > 0) {
                                tab.selected.forEach(item => tab.onToggle(item));
                              }
                              
                              // Add new date as string
                              tab.onToggle(dateValue);
                              setDateOpen(false);
                            }
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {tab.options.map(option => {
                      const optionValue = typeof option === 'string' ? option : (option.value || option.id || '');
                      const optionLabel = typeof option === 'string' ? option : (option.label || option.name || '');
                      return (
                        <div key={optionValue} className="flex items-center space-x-2">
                          <Checkbox
                            id={`${tab.id}-${optionValue}`}
                            checked={Array.isArray(tab.selected) && tab.selected.some(item => 
                              typeof item === 'string' ? item === optionValue : (item.value === optionValue || item.id === optionValue)
                            )}
                            onCheckedChange={() => {
                              // Use the original option object if it's not a string
                              if (typeof option !== 'string') {
                                tab.onToggle(option);
                              } else {
                                // Create a value object for consistency with select-search
                                const valueObj = { value: optionValue, label: optionLabel };
                                tab.onToggle(valueObj);
                              }
                            }}
                          />
                          <label
                            htmlFor={`${tab.id}-${optionValue}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {optionLabel}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Apply and Reset Buttons */}
          <div className="flex justify-between pt-2">
            <Button variant="outline" size="sm" onClick={ () => {onClearAll(), setFromDate(undefined), setToDate(undefined) } }>
              Reset Filters
            </Button>
            <Button
              size="sm"
              onClick={() => {
                // Close the popover when filters are applied
                refetch?.();
                setFilterOpen(false);
              }}
            >
              Apply Filters
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
