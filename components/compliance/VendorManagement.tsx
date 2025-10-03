'use client';

import { useState, useEffect } from 'react';
import { useApiMutation } from '@/hooks/useApi';
import { DataTable } from '@/components/tables/common/DataTable';
import { Button } from '@/components/ui/button';
import { PlusCircle, FileDown, Send, Eye, Trash2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from '@/components/ui/tooltip';
import { MoreHorizontal } from 'lucide-react';
import { SearchConfig } from '@/hooks/useTableFilters';


interface VendorData {
  id: string;
  vendorName: string;
  vendorEmail: string;
  contactName: string;
  contactNumber: string;
  accessCode: string;
  deadlineDate: string;
  completionStatus: string;
  submittedDate: string;
}

interface VendorListResponse {
  success: boolean;
  message: string;
  filterBrsrVendorResponseList: VendorData[];
  total: number;
}

interface VendorListPayload {
  fy: string;
  searchKey: string;
  pageStart: number;
  pageSize: number;
}

interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => React.ReactNode;
  className?: string;
  sortable?: boolean;
  sortField?: string;
}

export function VendorManagement() {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [openTooltipId, setOpenTooltipId] = useState<string | null>(null);
  
  // Use the API mutation hook to call the filter-brsr-vendors endpoint
  const { mutate: fetchVendors, data, isPending, isError, error } = useApiMutation<VendorListResponse, VendorListPayload>(
    'filter-brsr-vendors',
    'POST'
  );

  // Function to fetch vendor data
  const fetchData = (search = searchTerm, page = currentPage, size = pageSize) => {
    const payload: VendorListPayload = {
      fy: "2025-2026",
      searchKey: search,
      pageStart: (page - 1) * size,
      pageSize: size
    };
    
    fetchVendors(payload, {
      onSuccess: (data) => {
        console.log('Vendor List API Response:', data);
      },
      onError: (error) => {
        console.error('Error fetching vendors:', error);
        toast.error('Failed to load vendors');
      }
    });
  };
  
  // Call the API when the component mounts or when pagination changes
  useEffect(() => {
    if (currentPage !== 1) { // Skip if it's the first page as it's handled in handleSearch
      fetchData(searchTerm, currentPage, pageSize);
    }
  }, [currentPage, pageSize]); // Intentionally not including searchTerm to avoid too many API calls
  
  // Initial data fetch on component mount
  useEffect(() => {
    fetchData();
  }, []);
  
  // We don't need a click outside handler since the Tooltip component
  // from Shadcn UI already handles this behavior through the onOpenChange prop

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page on new search
    fetchData(value, 1, pageSize);
  };

  // Define table columns
  const columns: Column<VendorData>[] = [
    {
      header: 'Vendor Name',
      accessorKey: 'vendorName',
      className: 'w-1/6',
    },
    {
      header: 'Email',
      accessorKey: 'vendorEmail',
      className: 'w-1/6',
    },
    {
      header: 'Contact Person',
      accessorKey: 'contactName',
      className: 'w-1/6',
    },
    {
      header: 'Access Code',
      accessorKey: 'accessCode',
      className: 'w-1/12',
    },
    {
      header: 'Status',
      accessorKey: 'completionStatus',
      className: 'w-1/12',
      cell: (item: VendorData) => {
        const status = item.completionStatus;
        let badgeClass = '';
        
        switch(status) {
          case 'COMPLETED':
            badgeClass = 'bg-green-100 text-green-800 hover:bg-green-200';
            break;
          case 'IN_PROGRESS':
            badgeClass = 'bg-blue-100 text-blue-800 hover:bg-blue-200';
            break;
          case 'PENDING':
          default:
            badgeClass = 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
            break;
        }
        
        return (
          <Badge className={badgeClass}>
            {status === 'PENDING' ? 'Pending' : 
             status === 'IN_PROGRESS' ? 'In Progress' : 
             status === 'COMPLETED' ? 'Completed' : status}
          </Badge>
        );
      }
    },
    {
      header: 'Submission Date',
      accessorKey: 'submittedDate',
      className: 'w-1/8',
      cell: (item: VendorData) => {
        return item.submittedDate || 'Not submitted';
      }
    },
    {
      header: 'Deadline',
      accessorKey: 'deadlineDate',
      className: 'w-1/8',
    },
    {
      header: 'Actions',
      className: 'w-1/12',
      cell: (item: VendorData) => {
        const isOpen = openTooltipId === item.id;
        
        const toggleTooltip = () => {
          setOpenTooltipId(isOpen ? null : item.id);
        };
        
        return (
          <div className="flex justify-end">
            <Tooltip open={isOpen} onOpenChange={(open) => !open && setOpenTooltipId(null)}>
              <TooltipTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0" onClick={toggleTooltip}>
                  <span className="sr-only">Actions</span>
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent className="p-0 w-48" sideOffset={5}>
                <div className="flex flex-col w-full bg-white rounded-md overflow-hidden">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSendInvitation(item.id);
                    }} 
                    className="flex items-center px-3 py-1.5 text-sm hover:bg-gray-50 w-full text-left"
                  >
                    <Send className="mr-2 h-4 w-4" />
                    <span>Send Invitation</span>
                  </button>
                  <div className="h-px bg-gray-100 mx-1 my-0.5"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewSubmission(item.id);
                    }} 
                    className="flex items-center px-3 py-1.5 text-sm hover:bg-gray-50 w-full text-left"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    <span>View Submission</span>
                  </button>
                  <div className="h-px bg-gray-100 mx-1 my-0.5"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownloadData(item.id);
                    }} 
                    className="flex items-center px-3 py-1.5 text-sm hover:bg-gray-50 w-full text-left"
                  >
                    <FileDown className="mr-2 h-4 w-4" />
                    <span>Download Data</span>
                  </button>
                  <div className="h-px bg-gray-100 mx-1 my-0.5"></div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveVendor(item.id);
                    }} 
                    className="flex items-center px-3 py-1.5 text-sm hover:bg-gray-50 w-full text-left text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    <span>Remove Vendor</span>
                  </button>
                </div>
              </TooltipContent>
            </Tooltip>
          </div>
        );
      }
    }
  ];

  // Action handlers
  const handleAddVendor = () => {
    toast.info('Add vendor functionality will be implemented');
  };

  const handleDownloadReport = () => {
    toast.info('Generate report functionality will be implemented');
  };

  const handleExportData = () => {
    toast.info('Export data functionality will be implemented');
  };

  const handleSendInvitation = (id: string) => {
    toast.info(`Sending invitation to vendor ${id}`);
    setOpenTooltipId(null); // Close tooltip after action
  };

  const handleViewSubmission = (id: string) => {
    toast.info(`Viewing submission for vendor ${id}`);
    setOpenTooltipId(null); // Close tooltip after action
  };

  const handleDownloadData = (id: string) => {
    toast.info(`Downloading data for vendor ${id}`);
    setOpenTooltipId(null); // Close tooltip after action
  };

  const handleRemoveVendor = (id: string) => {
    toast.info(`Removing vendor ${id}`);
    setOpenTooltipId(null); // Close tooltip after action
  };

  if (isPending && !data) {
    return (
      <div className="flex items-center justify-center p-6 h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-6 bg-white rounded-lg shadow-sm h-full">
        Error loading vendor data: {error?.message || 'Unknown error'}
      </div>
    );
  }

  // Create a search config that includes the required searchFn
  const searchConfig: SearchConfig<VendorData> = {
    placeholder: "Search vendors...",
    value: searchTerm,
    onChange: handleSearch,
    searchFn: (item, term) => {
      // This function won't actually be used since we're using server-side search
      // but we need to provide it to satisfy the type
      const searchLower = term.toLowerCase();
      return (
        item.vendorName.toLowerCase().includes(searchLower) ||
        item.vendorEmail.toLowerCase().includes(searchLower) ||
        item.contactName.toLowerCase().includes(searchLower) ||
        item.accessCode.toLowerCase().includes(searchLower)
      );
    }
  };

  return (
    <TooltipProvider>
      <div className="space-y-6 h-full overflow-y-auto pb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-sm text-gray-500 mb-4">
          Add and manage your vendors for BRSR compliance reporting. Each vendor will receive a unique access code and URL to submit their own BRSR form.
        </div>
        
        <div className="flex flex-wrap gap-2 mb-6">
          <Button onClick={handleAddVendor} className="bg-blue-600 hover:bg-blue-700">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add New Vendor
          </Button>
          <Button onClick={handleExportData} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Download Data
          </Button>
          <Button onClick={handleDownloadReport} variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
        </div>
        
        <DataTable
          data={data?.filterBrsrVendorResponseList || []}
          columns={columns}
          searchConfig={searchConfig}
          serverSidePagination={{
            currentPage,
            pageSize,
            totalItems: data?.total || 0,
            onPageChange: setCurrentPage,
            onPageSizeChange: setPageSize
          }}
          noResultsMessage="No vendors found matching your search."
          className="mt-4"
          dateFilters={false}
          locationFilters={false}
        />
        
        <div className="text-sm text-gray-500 mt-4">
          {data?.total || 0} vendors added
        </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
