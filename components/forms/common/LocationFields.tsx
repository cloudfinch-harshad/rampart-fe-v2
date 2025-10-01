"use client"

import { useState, useEffect } from "react"
import { Control, FieldValues, FieldPath, useWatch, useFormContext } from "react-hook-form"
import { useApiQuery } from "@/hooks/useApi"
import { TextField, SelectField } from "@/components/forms/common/FormFields"

// Types for location data
type LocationOption = {
  id: string
  name: string
}

type LocationStringData = {
  country: string | null
  state: string | null
  city: string | null
}

interface LocationFilterGroupProps<
  TFieldValues extends FieldValues = FieldValues
> {
  control: Control<TFieldValues>
  countryName: FieldPath<TFieldValues>
  stateName: FieldPath<TFieldValues>
  cityName: FieldPath<TFieldValues>
  className?: string
  disabled?: boolean
  requiredFields?: {
    country?: boolean
    state?: boolean
    city?: boolean
  }
  // Legacy props for backward compatibility
  onLocationChange?: (location: LocationStringData) => void
  cacheLocation?: LocationStringData
  errors?: {
    country?: string
    state?: string
    city?: string
  }
}

export function LocationFieldsGroup<
  TFieldValues extends FieldValues = FieldValues
>({
  control,
  countryName,
  stateName,
  cityName,
  className = "col-span-full",
  disabled = false,
  requiredFields = { country: false, state: false, city: false },
  // Legacy props for backward compatibility
  onLocationChange,
  cacheLocation,
  errors
}: LocationFilterGroupProps<TFieldValues>) {

  const [isLoading, setIsLoading] = useState(false)
  const { setValue } = useFormContext<TFieldValues>()

  // Watch form values to determine current selections
  const watchedCountry: string = useWatch({ control, name: countryName }) ?? ""
  const watchedState: string = useWatch({ control, name: stateName }) ?? ""

  // Fetch countries from API
  const { data: countriesData, isLoading: countriesLoading } = useApiQuery<{ data: LocationOption[] }>({
    url: "/api/v1/location/get-countries",
    method: "POST",
    body: {},
    queryKey: ["countries"],
    enabled: true
  })

  // Fetch states based on selected country (only for India)
  const isIndia = watchedCountry === "101" // Assuming India has ID "101"
  const { data: statesData, isLoading: statesLoading } = useApiQuery<{ data: LocationOption[] }>({
    url: "/api/v1/location/get-states",
    method: "POST",
    body: { country_id: watchedCountry },
    queryKey: ["states", watchedCountry],
    enabled: isIndia && Boolean(watchedCountry)
  })

  // Update loading state
  useEffect(() => {
    setIsLoading(countriesLoading || statesLoading)
  }, [countriesLoading, statesLoading])

  // Handle country change - clear state and city when country changes
  const handleCountryChange = (countryId: string) => {
    if (countryId !== undefined && countryId !== null) {
      // Reset state and city fields when country changes
      setValue(stateName, "" as any)
      setValue(cityName, "" as any)
    }
  }

  // Handle state change for India - store ID directly for India, name for others
  const handleStateChange = (value: string) => {
    if (value !== undefined && value !== null) {
      setValue(stateName, value as any)
      // Clear city when state changes
      setValue(cityName, "" as any)
    }
  }

  // Prepare options for country dropdown
  const countryOptions = countriesData?.data?.map(country => ({
    label: country.name,
    value: country.id
  })) || []

  // Prepare options for state dropdown (India only)
  const stateOptions = statesData?.data?.map(state => ({
    label: state.name,
    value: state.id
  })) || []

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      {/* Country Field */}
      <SelectField
        control={control}
        name={countryName}
        label="COUNTRY"
        placeholder="Select Country"
        options={countryOptions}
        required={requiredFields.country}
        disabled={disabled || isLoading}
        onChange={handleCountryChange}
      />

      {/* State/Province Field - Conditional */}
      {isIndia ? (
        <SelectField
          control={control}
          name={stateName}
          label="STATE/PROVINCE"
          placeholder="Select State/Province"
          options={stateOptions.map(state => state.label)}
          required={requiredFields.state}
          disabled={disabled || isLoading}
          onChange={handleStateChange}
        />
      ) : (
        <TextField
          control={control}
          name={stateName}
          label="STATE/PROVINCE"
          placeholder="Enter State/Province"
          required={requiredFields.state}
          disabled={disabled}
        />
      )}

      {/* City Field */}
      <TextField
        control={control}
        name={cityName}
        label="CITY"
        placeholder="Enter City"
        required={requiredFields.city}
        disabled={disabled}
      />
    </div>
  )
}
