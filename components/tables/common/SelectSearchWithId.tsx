"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApiQuery } from "@/hooks/useApi"

// Custom debounce hook
function useDebounce<T>(value: T, delay?: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay || 500)

    return () => {
      clearTimeout(timer)
    }
  }, [value, delay])

  return debouncedValue
}

interface Option {
  id: string
  name: string
}

interface SelectSearchWithIdProps {
  apiEndpoint: string
  type?: string
  value: { id: string; name: string } | null
  onChange: (value: { id: string; name: string } | null) => void
  onIdChange?: (id: string) => void
  onNameChange?: (name: string) => void
  placeholder: string
  searchValue?: string
  disabled?: boolean
  error?: string
}

export function SelectSearchWithId({
  apiEndpoint,
  type,
  value,
  onChange,
  onIdChange,
  onNameChange,
  placeholder,
  searchValue,
  disabled = false,
  error
}: SelectSearchWithIdProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)

  // Reset search term when popover closes
  useEffect(() => {
    if (!open) {
      setSearchTerm("")
    }
  }, [open])

  // Handle search API call
  const { data: searchResults, isLoading: searchLoading } = useApiQuery({
    queryKey: ['select-search', apiEndpoint, debouncedSearchTerm],
    url: apiEndpoint,
    method: 'POST',
    body: { key: debouncedSearchTerm, companyType: type || '' },
    enabled: open && debouncedSearchTerm.length > 0,
  })

  // Handle initial data load
  const { data: initialOptions, isLoading: initialLoading } = useApiQuery({
    queryKey: ['select-search-initial', apiEndpoint],
    url: apiEndpoint,
    method: 'POST',
    body: { key: searchValue || '', companyType: type || '' },
    enabled: open && debouncedSearchTerm.length === 0,
  })

  // Transform API response to match our Option interface
  const transformApiResponse = (data: any[]): Option[] => {
    return data.map(item => ({
      id: item.value || item.id,
      name: item.label || item.name
    }))
  }

  // Combine options from both API calls
  const options: Option[] = debouncedSearchTerm.length > 0
    ? transformApiResponse((searchResults as any)?.data || [])
    : transformApiResponse((initialOptions as any)?.data || [])

  // Find the selected value in options
  const selectedValue = value?.name || ''
  
  const handleSelect = (option: Option | null) => {
    if (option) {
      const newValue = { id: option.id, name: option.name }
      onChange(newValue)
      
      // Call individual handlers if provided
      if (onIdChange) onIdChange(option.id)
      if (onNameChange) onNameChange(option.name)
    } else {
      onChange(null)
      if (onIdChange) onIdChange('')
      if (onNameChange) onNameChange('')
    }
    setOpen(false)
  }

  return (
    <div>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            className={cn(
              "w-full justify-between border-b border-gray-200 rounded-none mt-[2px]",
              disabled && "opacity-50 cursor-not-allowed",
              error && "border-destructive"
            )}
            disabled={disabled}
          >
            {value ? 
              value.name
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0">
          <div className="w-full">
            <div className="relative">
              <input
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={`Search ${placeholder.toLowerCase()}...`}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="max-h-60 overflow-auto py-1">
              {options.length === 0 && (
                <div className="text-center py-2 text-sm text-gray-500">
                  {searchLoading ? "Loading..." : "No results found."}
                </div>
              )}
              {options.map((option) => (
                <div
                  key={option.id}
                  className={cn(
                    "relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                    value?.id === option.id ? "bg-accent text-accent-foreground" : ""
                  )}
                  onClick={() => handleSelect(option)}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value?.id === option.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  <span>{option.name}</span>
                </div>
              ))}
            </div>
          </div>
        </PopoverContent>
      </Popover>
      {error && (
        <p className="text-sm font-semibold text-red-600 mt-1">{error}</p>
      )}
    </div>
  )
}
