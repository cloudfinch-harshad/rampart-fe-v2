"use client"

import { useState, useEffect } from "react"
import { Check, ChevronsUpDown, Loader2, Search } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useApiQuery } from "@/hooks/useApi"

// Define the option type for select-search
interface SelectOption {
  id?: string
  name?: string
  value?: string
  label?: string
}

// Define the API response type based on the actual response format
interface ApiResponse {
  status: string
  message: string
  data: any[]
  [key: string]: any // Allow for other properties in the response
}

interface SelectSearchProps {
  apiEndpoint: string
  value: string | { value: string; label: string } | null
  onChange: (value: { value: string; label: string } | null) => void
  placeholder: string
}

export function SelectSearch({
  apiEndpoint,
  value,
  onChange,
  placeholder
}: SelectSearchProps) {
  const [open, setOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("")

  const [options, setOptions] = useState<SelectOption[]>([])
  
  // Extract value string from object if needed
  const selectedValue = typeof value === 'object' && value !== null ? value.value : value

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchTerm])

  // Fetch options from API when there's a search term
  const { data: searchData, isLoading: searchLoading } = useApiQuery<any>({
    queryKey: ['select-search', apiEndpoint, debouncedSearchTerm],
    url: apiEndpoint,
    method: 'POST',
    body: { key: debouncedSearchTerm },
    enabled: open && debouncedSearchTerm.length > 0,
  })
  
  // Fetch initial options when dropdown is opened (without search term)
  const { data: initialData, isLoading: initialLoading } = useApiQuery<any>({
    queryKey: ['select-search-initial', apiEndpoint],
    url: apiEndpoint,
    method: 'POST',
    body: { key: '' },
    enabled: open && debouncedSearchTerm.length === 0,
  })
  

  useEffect(() => {
    if (searchData || initialData) {
      const formattedOptions = (searchData || initialData).data.map((item: any) => ({
        id: item.id || item.value || '',
        name: item.name || item.label || '',
        value: item.id || item.value || '',
        label: item.name || item.label || ''
      }))
      setOptions(formattedOptions)
    }
  }, [searchData, initialData])
  

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          role="combobox"
          aria-expanded={open}
          className="w-full border-b rounded-none justify-between border-b border-gray-200"
        >
          {selectedValue ? 
            // Find the option by ID first
            options.find((option) => option.id === selectedValue || option.value === selectedValue)?.name || 
            // If not found in options, use the label from the value object
            (typeof value === 'object' && value !== null ? value.label : 
            // Fallback to the value itself if it's a string
            (typeof selectedValue === 'string' ? selectedValue : placeholder))
            : placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-2">
        <div className="flex items-center border rounded-md px-3 mb-2">
          <Search className="h-4 w-4 mr-2 text-muted-foreground" />
          <Input
            placeholder={`Search ${placeholder.toLowerCase()}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-9 px-0"
          />
        </div>
        
        {searchLoading || initialLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="h-4 w-4 animate-spin" />
          </div>
        ) : (
          <ScrollArea className="h-[200px]">
            {options.length === 0 ? (
              <div className="text-center py-6 text-sm text-muted-foreground">
                No results found.
              </div>
            ) : (
              <div className="space-y-1">
                {/* Render each option */}
                {options.map((option: SelectOption, index: number) => {
                  // Extract option ID and label with fallbacks
                  const optionId = option.id || option.value || String(index)
                  const optionLabel = option.name || option.label || String(option)
                  
                  return (
                    <div
                      key={optionId || index}
                      className={cn(
                        "flex items-center px-2 py-1.5 rounded-md cursor-pointer hover:bg-accent",
                        selectedValue === optionId ? "bg-accent" : ""
                      )}
                      onClick={() => {
                        if (selectedValue === optionId) {
                          onChange(null)
                        } else {
                          onChange({ value: optionId, label: optionLabel })
                        }
                        setOpen(false)
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedValue === optionId ? "opacity-100" : "opacity-0"
                        )}
                      />
                      <span className="text-sm">{optionLabel || 'Unnamed Option'}</span>
                    </div>
                  )
                })}
              </div>
            )}
          </ScrollArea>
        )}
      </PopoverContent>
    </Popover>
  )
}
