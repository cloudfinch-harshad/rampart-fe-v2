"use client"

import { useState, useEffect, useCallback } from "react"
import { useApiQuery } from "@/hooks/useApi"
import {
  Select as SelectRoot,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { SelectSearch } from "./SelectSearch"

// Types for location data
type LocationOption = {
  id: string
  name: string
}

type LocationData = {
  country: LocationOption | null
  state: LocationOption | null
  city: LocationOption | null
}

type LocationStringData = {
  country: string | null
  state: string | null
  city: string | null
}

interface LocationFilterGroupProps {
  className?: string
  disabled?: boolean
  onLocationChange?: (location: LocationData) => void
  cacheLocation?: LocationStringData
}

export function LocationFilterGroup({
  className = "",
  disabled = false,
  onLocationChange,
  cacheLocation
}: LocationFilterGroupProps) {
  // Convert string values from cache to LocationOption
  const getLocationOption = (value: string | null): LocationOption | null => {
    return value && value !== "0" ? { id: value, name: value } : null;
  };

  const [locationData, setLocationData] = useState<LocationData>({
    country: getLocationOption(cacheLocation?.country ?? null),
    state: getLocationOption(cacheLocation?.state ?? null),
    city: getLocationOption(cacheLocation?.city ?? null)
  })
  const [isLoading, setIsLoading] = useState(false)

  // Memoize the location change handler
  const handleLocationChange = useCallback((updates: Partial<LocationData>) => {
    const newData = { ...locationData, ...updates }
    setLocationData(newData)
    onLocationChange?.(newData)
  }, [locationData, onLocationChange])
  
  // Update locationData when cacheLocation changes
  useEffect(() => {
    setLocationData({
      country: getLocationOption(cacheLocation?.country ?? null),
      state: getLocationOption(cacheLocation?.state ?? null),
      city: getLocationOption(cacheLocation?.city ?? null)
    })
  }, [cacheLocation])

  // Countries will be fetched by SelectSearch component
  // Remove the old countries API query since SelectSearch handles it

  // Fetch states based on selected country
  const { data: statesData, isLoading: statesLoading } = useApiQuery<{ data: LocationOption[] }>({
    url: "/api/v1/location/get-states",
    method: "POST",
    body: { country_id: locationData.country?.id },
    queryKey: ["states", locationData.country],
    enabled: !!locationData.country
  })

  // Fetch cities based on selected state
  const { data: citiesData, isLoading: citiesLoading } = useApiQuery<{ data: LocationOption[] }>({
    url: "/api/v1/location/get-cities",
    method: "POST",
    body: { state_id: locationData.state?.id },
    queryKey: ["cities", locationData.state],
    enabled: !!locationData.state
  })

  // Update loading state
  useEffect(() => {
    setIsLoading(statesLoading || citiesLoading)
  }, [statesLoading, citiesLoading])

  // Handle country change from SelectSearch
  const handleCountryChange = (selectedOption: any) => {
    const country = selectedOption ? { id: selectedOption.value, name: selectedOption.label } : null;
    handleLocationChange({
      country: country,
      state: null,
      city: null
    })
  }

  // Handle state change
  const handleStateChange = (stateId: string) => {
    const state = statesData?.data?.find(s => s.id === stateId);
    handleLocationChange({
      state: state || null,
      city: null
    })
  }

  // Handle city change
  const handleCityChange = (cityId: string) => {
    const city = citiesData?.data?.find(c => c.id === cityId);
    handleLocationChange({ 
      city: city || null
    })
  }

  return (
    <div className={`grid grid-cols-1 gap-4 ${className}`}>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Country</label>
        <SelectSearch
          apiEndpoint="/api/v1/location/get-countries-search"
          placeholder="Search countries..."
          value={locationData.country ? { value: locationData.country.id, label: locationData.country.name } : null}
          onChange={handleCountryChange}
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">State/Province</label>
        <SelectRoot
          value={locationData.state?.id || ""}
          onValueChange={handleStateChange}
          disabled={disabled || !locationData.country || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="State/Province" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {statesData?.data?.map((state) => (
              <SelectItem key={state.id} value={state.id}>
                {state.name}
              </SelectItem>
            ))}
          </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">City</label>
        <SelectRoot
          value={locationData.city?.id || ""}
          onValueChange={handleCityChange}
          disabled={disabled || !locationData.state || isLoading}
        >
          <SelectTrigger>
            <SelectValue placeholder="City" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {citiesData?.data?.map((city) => (
              <SelectItem key={city.id} value={city.id}>
                {city.name}
              </SelectItem>
            ))}
          </SelectGroup>
          </SelectContent>
        </SelectRoot>
      </div>
    </div>
  )
}
