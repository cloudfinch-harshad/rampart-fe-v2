import { useState, useMemo } from 'react';

export type FilterType = 'checkbox' | 'radio' | 'select' | 'select-search';

export interface DropdownOption {
  value: string;
  label: string;
}

export interface FilterState {
  selected: string[];
  toggle: (value: string) => void;
  clear: () => void;
  set: (values: string[]) => void;
}

export interface FilterConfig<T> {
  id: string;
  label: string;
  accessor: (item: T) => string | string[];
  filterType?: FilterType;
  badgeClassName?: string;
  api?: string;
  selected?: (string | DropdownOption)[];
  setSelected?: (selected: (string | DropdownOption)[] | null) => void;
}

export interface SearchConfig<T> {
  placeholder: string;
  searchFn: (item: T, searchTerm: string) => boolean;
  value: string;
  onChange: (value: string) => void;
}

export function useTableFilters<T>(
  data: T[],
  filterConfigs: FilterConfig<T>[],
  searchConfig: SearchConfig<T>
) {
  // State for search term
  const [searchTerm, setSearchTerm] = useState(searchConfig.value);
  
  // State for pagination
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Create filter states for each filter config
  const filterStates = useMemo(() => {
    const states: Record<string, FilterState> = {};
    
    filterConfigs.forEach((config) => {
      states[config.id] = {
        selected: [],
        toggle: (value: string) => {
          setFilterSelections((prev) => {
            const currentSelected = prev[config.id] || [];
            const isSelected = currentSelected.includes(value);
            
            const newSelected = isSelected
              ? currentSelected.filter((v) => v !== value)
              : [...currentSelected, value];
            
            return {
              ...prev,
              [config.id]: newSelected,
            };
          });
          // Reset to first page when filter changes
          setPage(1);
        },
        clear: () => {
          setFilterSelections((prev) => ({
            ...prev,
            [config.id]: [],
          }));
          // Reset to first page when filter is cleared
          setPage(1);
        },
        set: (values: string[]) => {
          setFilterSelections((prev) => ({
            ...prev,
            [config.id]: values,
          }));
          // Reset to first page when filter is set
          setPage(1);
        },
      };
    });
    
    return states;
  }, [filterConfigs]);

  // State for filter selections
  const [filterSelections, setFilterSelections] = useState<Record<string, string[]>>(() => {
    const initialSelections: Record<string, string[]> = {};
    filterConfigs.forEach((config) => {
      initialSelections[config.id] = [];
    });
    return initialSelections;
  });

  // Get unique filter values for each filter
  const uniqueFilterValues = useMemo(() => {
    const values: Record<string, string[]> = {};
    
    filterConfigs.forEach((config) => {
      const uniqueValues = new Set<string>();
      
      data.forEach((item) => {
        const itemValues = config.accessor(item);
        if (Array.isArray(itemValues)) {
          itemValues.forEach((value) => uniqueValues.add(value));
        } else {
          uniqueValues.add(itemValues);
        }
      });
      
      values[config.id] = Array.from(uniqueValues).sort();
    });
    
    return values;
  }, [data, filterConfigs]);

  // Apply filters and search to data
  const filteredData = useMemo(() => {
    return data.filter((item) => {
      // Apply search filter
      if (searchTerm && !searchConfig.searchFn(item, searchTerm)) {
        return false;
      }
      
      // Apply all other filters
      for (const config of filterConfigs) {
        const selectedValues = filterSelections[config.id];
        if (selectedValues.length === 0) continue;
        
        const itemValues = config.accessor(item);
        const itemValueArray = Array.isArray(itemValues) ? itemValues : [itemValues];
        
        // Check if any of the item's values match any of the selected filter values
        const hasMatch = selectedValues.some((selectedValue) =>
          itemValueArray.includes(selectedValue)
        );
        
        if (!hasMatch) return false;
      }
      
      return true;
    });
  }, [data, filterConfigs, filterSelections, searchTerm, searchConfig]);

  // Calculate total selected filters
  const totalSelectedFilters = useMemo(() => {
    return Object.values(filterSelections).reduce(
      (total, selected) => total + selected.length,
      0
    );
  }, [filterSelections]);

  // Clear all filters
  const clearAllFilters = () => {
    setFilterSelections(() => {
      const clearedSelections: Record<string, string[]> = {};
      filterConfigs.forEach((config) => {
        clearedSelections[config.id] = [];
      });
      return clearedSelections;
    });
    setSearchTerm('');
    setPage(1);
  };

  // Calculate pagination
  const totalItems = filteredData.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  
  // Ensure current page is valid
  const currentPage = Math.min(Math.max(1, page), totalPages);
  if (page !== currentPage) {
    setPage(currentPage);
  }
  
  // Get paginated data
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, totalItems);
  const paginatedData = filteredData.slice(startIndex, endIndex);

  // Search placeholder
  const searchPlaceholder = searchConfig.placeholder;

  return {
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
    filteredData,
    paginatedData,
    totalItems,
    totalPages,
  };
}
