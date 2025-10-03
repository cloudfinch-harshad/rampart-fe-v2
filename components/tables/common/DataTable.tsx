"use client"

import { ReactNode, useState, useEffect } from "react"
import { ArrowUpDown, ArrowUpAZ, ArrowDownAZ } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../../components/ui/table"
import { Pagination } from "../../../components/ui/Pagination"
import { SearchBar } from "./SearchBar"
import { FilterPopover, FilterTab, DropdownOption } from "./FilterPopover"
import { Badge } from "../../../components/ui/badge"
import { FilterBadges, FilterGroup } from "./FilterBadges"
import type { FilterConfig, FilterType, SearchConfig } from "../../../hooks/useTableFilters"
import { useTableFilters } from "../../../hooks/useTableFilters"
import { LocationData } from "../../../types/locations"


interface Column<T> {
  header: string
  accessorKey?: keyof T
  cell?: (item: T) => ReactNode
  className?: string
  sortable?: boolean
  sortField?: string
}

interface ServerSidePagination {
  currentPage: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}


interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  filterConfigs?: FilterConfig<T>[]
  searchConfig?: SearchConfig<T>
  pageSizeOptions?: number[]
  defaultPageSize?: number
  noResultsMessage?: string
  className?: string
  serverSidePagination?: ServerSidePagination
  // For server-side clear filters
  onClearFilters?: () => void
  totalSelectedFilters?: number
  defaultCountryFilter?: boolean
  onLocationSelect?: (location: LocationData) => void
  onDateFilterChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  cacheFilters?: LocationData
  locationFilters?: boolean
  dateFilters?: boolean
  // Sorting props
  sortColumn?: number
  sortDirection?: 'asc' | 'desc'
  onSort?: (columnIndex: number, direction: 'asc' | 'desc') => void
  hideSearch?: boolean
  selectedRowId?: string
  rowIdField?: string
  refetch?: () => void
}

export function DataTable<T>({
  refetch,
  data,
  columns,
  filterConfigs,
  searchConfig,
  pageSizeOptions = [10, 20, 50, 100],
  defaultPageSize = 10,
  noResultsMessage = "No results found matching your filters.",
  className,
  serverSidePagination,
  onClearFilters,
  totalSelectedFilters: externalTotalSelectedFilters,
  onLocationSelect,
  onDateFilterChange,
  cacheFilters,
  locationFilters= true,
  dateFilters= true,
  sortColumn,
  sortDirection = 'asc',
  onSort,
  hideSearch = false,
  selectedRowId,
  rowIdField
}: DataTableProps<T>) {


  // Use server-side pagination if provided, otherwise use client-side filtering and pagination
  const isServerSide = !!serverSidePagination
  
  // Ensure filterConfigs is an array even when undefined
  const safeFilterConfigs = filterConfigs || []
  
  // For client-side filtering
  const {
    searchTerm,
    setSearchTerm,
    searchPlaceholder,
    filterStates,
    filterSelections,
    uniqueFilterValues,
    totalSelectedFilters,
    clearAllFilters,
    page,
    setPage,
    pageSize,
    setPageSize,
    paginatedData,
    totalItems,
  } = useTableFilters<T>(data, safeFilterConfigs, searchConfig || {
    placeholder: "Search...",
    searchFn: () => true, // Default search function that passes all items
    value: "",
    onChange: () => {}
  })
  
  // For server-side, use the provided values
  const currentPage = isServerSide ? serverSidePagination.currentPage : page
  const currentPageSize = isServerSide ? serverSidePagination.pageSize : pageSize
  const currentTotalItems = isServerSide ? serverSidePagination.totalItems : totalItems
  const currentData = isServerSide ? data : paginatedData
  const currentTotalSelectedFilters = isServerSide && externalTotalSelectedFilters !== undefined ? externalTotalSelectedFilters : totalSelectedFilters

  
  // Handle page change
  const handlePageChange = (newPage: number) => {
    if (isServerSide) {
      serverSidePagination.onPageChange(newPage)
    } else {
      setPage(newPage)
    }
  }
  
  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    if (isServerSide) {
      serverSidePagination.onPageSizeChange(newSize)
    } else {
      setPageSize(newSize)
    }
  }



  // Prepare filter tabs for FilterPopover
  const filterTabs = [
    // Add existing filter configs
    ...safeFilterConfigs.map(config => {
      // For server-side filtering, check if the config has selected and setSelected properties
      const selected = 'selected' in config && config.selected ? config.selected : (filterSelections[config.id] || [])
      // Pass the API endpoint for select-search filters
      const api = config.api || ''
      const onToggle = (value: string | DropdownOption | null) => {
        if ('setSelected' in config && config.setSelected) {
          // Handle different filter types
          if (config.filterType === 'select-search') {
            // For select-search, handle null values (deselection) and direct value changes
            if (value === null) {
              config.setSelected(null);
            } else {
              // Wrap single value in array for consistency
              config.setSelected([value]);
            }
          } else if (config.filterType === 'radio' || config.filterType === 'select') {
            // For radio and select, we either select the new value or clear all
            if (value === null) return;
            // Check if the value is in the selected array
            const isSelected = selected.some((item: string | DropdownOption) => {
              if (typeof item === 'string' && typeof value === 'string') {
                return item === value;
              } else if (typeof item === 'object' && typeof value === 'object') {
                return item.value === value.value;
              }
              return false;
            });
            
            const newSelected = isSelected ? [] : [value];
            config.setSelected(newSelected);
          } else {
            // For checkboxes (default), toggle the selection
            if (value === null) return;
            // Check if the value is in the selected array
            const isSelected = selected.some((item: string | DropdownOption) => {
              if (typeof item === 'string' && typeof value === 'string') {
                return item === value;
              } else if (typeof item === 'object' && typeof value === 'object') {
                return item.value === value.value;
              }
              return false;
            });
            
            const newSelected = isSelected
              ? selected.filter((item: string | DropdownOption) => {
                  if (typeof item === 'string' && typeof value === 'string') {
                    return item !== value;
                  } else if (typeof item === 'object' && typeof value === 'object') {
                    return item.value !== value.value;
                  }
                  return true;
                })
              : [...selected, value];
            config.setSelected(newSelected);
          }
        } else {
          // For client-side filtering
          if (value === null) return;
          if (typeof value === 'string') {
            filterStates[config.id].toggle(value);
          } else if (typeof value === 'object' && value !== null) {
            // For object values, use the value property
            filterStates[config.id].toggle(value.value);
          }
        }
      }
      
      return {
        id: config.id,
        label: config.label,
        options: uniqueFilterValues[config.id] || [],
        selected,
        onToggle,
        filterType: 'filterType' in config ? config.filterType as FilterType : 'checkbox' as FilterType,
        api: api
      }
    })
  ];

  // Prepare filter groups for badges
  const filterGroups = [
    // Add location filter if any location is selected
    ...(cacheFilters?.country?.name || cacheFilters?.state?.name || cacheFilters?.city?.name ? [{
      id: 'location',
      label: 'Location',
      values: [
        ...(cacheFilters?.country?.name ? [`Country: ${cacheFilters.country.name}`] : []),
        ...(cacheFilters?.state?.name ? [`State: ${cacheFilters.state.name}`] : []),
        ...(cacheFilters?.city?.name ? [`City: ${cacheFilters.city.name}`] : [])
      ],
      onRemove: (value: string | DropdownOption) => {
        if (!onLocationSelect) return;
        
        // Parse the filter type from the value string
        const valueStr = typeof value === 'string' ? value : value.value;
        const filterType = valueStr.split(':')[0].trim().toLowerCase();
        
        // Create a new location object with the appropriate field cleared
        const newLocation = { 
          country: filterType === 'country' ? null : cacheFilters?.country,
          state: filterType === 'state' ? null : cacheFilters?.state,
          city: filterType === 'city' ? null : cacheFilters?.city,
          fromDate: cacheFilters?.fromDate || '',
          toDate: cacheFilters?.toDate || ''
        };
        
        // Call the onLocationSelect function with the updated location data
        onLocationSelect(newLocation);
      },
      badgeClassName: 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
    }] : []),
    
    // Add existing filter groups
    ...safeFilterConfigs.map(config => {
      const values = 'selected' in config && config.selected ? config.selected : (filterSelections[config.id] || [])
      const onRemove = (value: string | DropdownOption) => {
        if ('setSelected' in config && config.setSelected) {
          const newSelected = values.filter((item: string | DropdownOption) => {
            if (typeof item === 'string' && typeof value === 'string') {
              return item !== value;
            } else if (typeof item === 'object' && typeof value === 'object') {
              return item.value !== value.value;
            }
            return true;
          });
          config.setSelected(newSelected);
        } else {
          if (typeof value === 'string') {
            filterStates[config.id].toggle(value);
          } else if (typeof value === 'object' && value !== null) {
            filterStates[config.id].toggle(value.value);
          }
        }
      }
      
      return {
        id: config.id,
        label: config.label,
        values,
        onRemove,
        badgeClassName: config.badgeClassName
      }
    })
  ];

  return (
    <div className={`space-y-4 ${className || ''}`}>
      {/* Search and filters */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {hideSearch ? (
            <FilterBadges
            visible={true}
            filterGroups={filterGroups}
            onClearAll={isServerSide && onClearFilters ? onClearFilters : clearAllFilters}
          />
          ) : (
            <SearchBar
              placeholder={searchConfig?.placeholder || "Search..."}
              value={searchConfig?.value !== undefined ? searchConfig.value : searchTerm}
              onChange={searchConfig?.onChange || setSearchTerm}
            />
          )}
          
          {/* Only render FilterPopover if there are filter tabs */}
            {(filterTabs.length > 0 || locationFilters || dateFilters) && (
              <FilterPopover
                tabs={filterTabs}
                totalSelected={currentTotalSelectedFilters}
                dateFilters={dateFilters}
                locationFilters={locationFilters}
                onLocationSelect={onLocationSelect}
                onDateFilterChange={onDateFilterChange}
                cacheFilters={{country: cacheFilters?.country?.id || null, state: cacheFilters?.state?.id || null, city: cacheFilters?.city?.id || null, fromDate: cacheFilters?.fromDate || "", toDate: cacheFilters?.toDate || ""}}
                onClearAll={isServerSide && onClearFilters ? onClearFilters : clearAllFilters}
                refetch={refetch}
              />
            )}
        </div>

        {/* Active filters */}
      {!hideSearch &&  <FilterBadges
          filterGroups={filterGroups}
          onClearAll={isServerSide && onClearFilters ? onClearFilters : clearAllFilters}
        />}
      </div>

      {/* Table */}
      <div className="rounded-md  shadow-sm overflow-x-auto">
        <Table className="min-w-full">
          <TableHeader>
            <TableRow className="bg-muted/50">
              {columns.map((column, index) => {
                // Determine alignment based on column position
                const getHeaderAlignmentClass = () => {
                  if (index === 0) return 'text-left'
                  if (index === columns.length - 1) return 'text-right'
                  return 'text-center'
                }

                const getFlexJustifyClass = () => {
                  if (index === 0) return 'justify-start'
                  if (index === columns.length - 1) return 'justify-end'
                  return 'justify-center'
                }

                return (
                  <TableHead 
                    key={index} 
                    className={`${column.className || ''} ${column.sortable ? 'cursor-pointer hover:bg-muted/70' : ''} ${getHeaderAlignmentClass()}`}
                    onClick={() => {
                      if (column.sortable && onSort) {
                        const newDirection = sortColumn === index && sortDirection === 'asc' ? 'desc' : 'asc';
                        onSort(index, newDirection);
                      }
                    }}
                  >
                    <div className={`flex items-center gap-2 ${getFlexJustifyClass()}`}>
                      <span className="uppercase">{column.header}</span>
                      {column.sortable && (
                        <span className="ml-2">
                          {sortColumn === index ? (
                            sortDirection === 'asc' ? (
                              <ArrowUpAZ className="h-4 w-4" />
                            ) : (
                              <ArrowDownAZ className="h-4 w-4" />
                            )
                          ) : (
                            <ArrowUpDown className="h-4 w-4 text-gray-400" />
                          ) }
                        </span>
                      )}
                    </div>
                  </TableHead>
                )
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentData.length > 0 ? (
              currentData.map((item: T, rowIndex: number) => (
                <TableRow 
                  key={rowIndex} 
                  className={`${selectedRowId && rowIdField && item[rowIdField as keyof T] === selectedRowId ? 'bg-green-50 dark:bg-green-900/20' : ''} hover:bg-muted/30`}
                >
                  {columns.map((column, colIndex: number) => {
                    // Determine alignment based on column position
                    const getAlignmentClass = () => {
                      if (colIndex === 0) return 'text-left'
                      if (colIndex === columns.length - 1) return 'text-right'
                      return 'text-center'
                    }

                    return (
                      <TableCell key={colIndex} className={getAlignmentClass()}>
                        {column.cell 
                          ? column.cell(item)
                          : column.accessorKey 
                            ? String(item[column.accessorKey] || '-')
                            : null}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {noResultsMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination controls */}
      <Pagination
        page={currentPage}
        pageSize={currentPageSize}
        total={currentTotalItems}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        pageSizeOptions={pageSizeOptions}
        className="justify-between"
      />
    </div>
  )
}
