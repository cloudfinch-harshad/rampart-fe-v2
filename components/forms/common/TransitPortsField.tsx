"use client"

import { useEffect, useState, useRef } from "react"
import { Control, FieldPath, FieldValues } from "react-hook-form"
import { Search, Loader2, ChevronDown } from "lucide-react"
import { useApiQuery } from "@/hooks/useApi"

import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"

// Interface for the TransitPortsField props
interface TransitPortsFieldProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>
    name: TName
    label?: string
    placeholder?: string
    className?: string
    required?: boolean
    apiUrl?: string
    apiMethod?: "GET" | "POST"
    listOptions?: Array<{label: string, value: string}>
    showDropdown?: boolean
}

export function TransitPortsField<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label = "Transit Ports",
    placeholder = "Search for ports...",
    className,
    required,
    apiUrl = "/api/v1/ports/dropdown-search",
    apiMethod = "POST",
    listOptions = [],
    showDropdown = true
}: TransitPortsFieldProps<TFieldValues, TName>) {
    const [portSearchQuery, setPortSearchQuery] = useState<string>('')
    const [searchResults, setSearchResults] = useState<Array<{label: string, value: string}>>([])  
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

    // Fetch ports data for search
    const { data: portsData, isLoading: isLoadingPorts, refetch: refetchPorts } = useApiQuery<{data: any}>({ 
        url: apiUrl,
        method: apiMethod,
        body: { search: portSearchQuery },
        queryKey: ["ports", portSearchQuery],
        enabled: portSearchQuery.length > 2
    })

    // Update search results when ports data changes
    useEffect(() => {
        if (portsData?.data) {
            const formattedPorts = portsData.data.map((port: any) => ({
                label: port.name,
                value: port.id
            }))
            setSearchResults(formattedPorts)
        }
    }, [portsData])

    // Handle port search with debounce
    const handlePortSearch = (query: string) => {
        setPortSearchQuery(query)
        
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }
        
        searchTimeoutRef.current = setTimeout(() => {
            if (query.length > 2) {
                refetchPorts()
            }
        }, 300)
    }

    useEffect(() => {
        refetchPorts()  
    }, [])

    return (
        <FormField
            control={control}
            name={name}
            render={({ field }) => (
                <FormItem className={`flex flex-col ${className}`}>
                    <FormLabel>{label}{required && <span className="flex justify-end text-destructive ml-1">*</span>}</FormLabel>
                    
                    {/* Search and dropdown toggle */}
                    <div className="flex items-center space-x-2 mb-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder={placeholder}
                                className="pl-8"
                                value={portSearchQuery}
                                onChange={(e) => handlePortSearch(e.target.value)}
                            />
                        </div>
                    </div>
                    
                    {isLoadingPorts && (
                        <div className="flex items-center justify-center py-4">
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            <span>Searching ports...</span>
                        </div>
                    )}
                    
                    <FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {searchResults.map((port) => (
                                <div 
                                    key={port.value} 
                                    className={`px-3 py-1 rounded-full cursor-pointer text-sm ${field.value?.includes(port.value) 
                                        ? 'bg-primary text-primary-foreground' 
                                        : 'bg-secondary text-secondary-foreground'}`}
                                    onClick={() => {
                                        const currentPorts: string[] = Array.isArray(field.value) ? field.value : [];
                                        const newPorts = currentPorts.includes(port.value)
                                            ? currentPorts.filter((p) => p !== port.value)
                                            : [...currentPorts, port.value];
                                        field.onChange(newPorts);
                                    }}
                                >
                                    {port.label}
                                </div>
                            ))}
                            
                            {portSearchQuery.length > 0 && searchResults.length === 0 && !isLoadingPorts && (
                                <div className="text-sm text-muted-foreground py-2">
                                    No ports found. Try a different search term.
                                </div>
                            )}
                            
                            {portSearchQuery.length === 0 && searchResults.length === 0 && (
                                <div className="text-sm text-muted-foreground py-2">
                                    Type at least 3 characters to search for ports.
                                </div>
                            )}
                        </div>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    )
}
