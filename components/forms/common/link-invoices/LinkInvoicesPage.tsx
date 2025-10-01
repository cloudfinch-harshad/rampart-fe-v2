"use client"

import React, { useState, ReactNode } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { PageHeader } from "@/components/ui/PageHeader"
import { useTableData } from "@/hooks/useTableData"
import { useApiMutation } from "@/hooks/useApi"
import { toast } from "sonner"
import { Checkbox } from "@/components/ui/checkbox"
import { DataTable } from "@/components/tables/common/DataTable"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import { CheckSquare } from "lucide-react"
import { FilterConfig, SelectOption } from "@/hooks/useTableFilters"

interface Invoice {
    blId: string
    invoiceId: string
    invoiceNumber: string
    customer: string
    amount: number
    status: string
    dateIssued: string
    dueDate: string
    createdBy: string
    createdAt: string
}

interface InvoicesFilters {
    sEcho: string
    iDisplayLength: number
    iDisplayStart: number
    iSortCol_0: number
    sSortDir_0: string
    invoiceNumber: string
    fromDate: string
    toDate: string
    bookingId?: string
    branchMasterId?: string
    branchId?: string
    sSearch?: string
    shipperId?: string
    consigneeId?: string
    portOfLoadingId?: string
    portOfDischargeId?: string
    vesselId?: string
    cartingPointId?: string
}

interface LinkInvoicesPageProps {
    billOfLadingId: string
    onSuccess: () => void
    onCancel: () => void
    listEndpoint?: string
    linkEndpoint?: string
    place?: string
    }

export function LinkInvoicesPage({ 
    billOfLadingId, 
    onSuccess, 
    onCancel, 
    listEndpoint = "/api/v1/invoices/list",
    linkEndpoint = "/api/v1/bills-of-lading/link-invoice", 
    place
}: LinkInvoicesPageProps) {
    const [selectedInvoices, setSelectedInvoices] = useState<string[]>([])
    const [isLinking, setIsLinking] = useState(false)

    // Initial filters for the invoices table
    const initialFilters: InvoicesFilters = {
        sEcho: "1",
        iDisplayLength: 10,
        iDisplayStart: 0,
        iSortCol_0: 0,
        sSortDir_0: "asc",
        invoiceNumber: "",
        fromDate: "2025-06-18T10:42:47.435Z",
        toDate: "2026-06-18T10:42:47.435Z",
        bookingId: "",
        branchMasterId: "",
        sSearch: ""
    }

    // Use the table data hook
    const {
        data: apiResponse,
        isLoading,
        filters,
        refetch,
        handleFilterChange,
        handlePageChange,
        handlePageSizeChange
    } = useTableData<any, InvoicesFilters>(
        listEndpoint,
        initialFilters,
        ["invoices"]
    )

    // Extract the data from the API response
    const invoices = (apiResponse as any)?.data?.aaData || []
    const totalRecords = (apiResponse as any)?.data?.iTotalRecords || 0

    // API mutation for linking invoices
    const { mutateAsync: linkInvoices } = useApiMutation({
        url: linkEndpoint,
        method: "POST",
        onSuccess: () => {
            toast.success("Invoices linked successfully")
            onSuccess()
        },
        onError: () => {
            toast.error("Failed to link invoices")
            setIsLinking(false)
        }
    })

    // Handle linking selected invoices
    const handleLinkInvoices = async () => {
        if (selectedInvoices.length === 0) {
            toast.error("Please select at least one invoice")
            return
        }

        setIsLinking(true)

        try {
            await linkInvoices({
                [place === 'mbl' ? 'masterBillOfLadingId' : place === "container" ? "containerId" : "billOfLadingId"]: billOfLadingId,
                [place === 'mbl' ? 'billOfLadingIds' : 'invoiceIds']: selectedInvoices
            })
        } catch (error) {
            // Error is handled by the mutation's onError
            console.error("Error linking invoices:", error)
        }
    }

    // Toggle all invoices selection
    const toggleAllInvoices = () => {
        if (selectedInvoices.length === invoices.length) {
            setSelectedInvoices([])
        } else {
            setSelectedInvoices(invoices.map((invoice: Invoice) => place === 'mbl' ? invoice.blId : invoice.invoiceId))
        }
    }

    const setSelected = (invoiceId: string) => {
        console.log(invoiceId)
        setSelectedInvoices(prev => {
            if (prev.includes(invoiceId)) {
                return prev.filter(id => id !== invoiceId)
            } else {
                return [...prev, invoiceId]
            }
        })
    }


    // Define columns for the DataTable
    const columns = [
        {
            header: (
                <div className="flex items-center">
                    <Checkbox
                        checked={invoices.length > 0 && selectedInvoices.length === invoices.length}
                        onCheckedChange={(checked) => {
                            if (checked) {
                                toggleAllInvoices()
                            } else {
                                setSelectedInvoices([])
                            }
                        }}
                        aria-label="Select all invoices"
                    />
                </div>
            ),
            accessorKey: "select",
            cell: (rowData: Invoice) => (
                <div className="flex items-center">
                    <Checkbox
                        checked={selectedInvoices.includes(place === 'mbl' ? rowData.blId : rowData.invoiceId)}
                        onCheckedChange={(checked) => {
                            setSelected(place === 'mbl' ? rowData.blId : rowData.invoiceId)
                        }}
                        aria-label={`Select invoice ${place === 'mbl' ? rowData.blId : rowData.invoiceId}`}
                    />
                </div>
            ),
            className: "w-10"
        },
        {
            header: place === 'mbl' ? 'BL No.' : 'Invoice Number',
            accessorKey: place === 'mbl' ? 'blNumber' : "invoiceNumber",
            className: "w-1/6"
        },
        {
            header: place === 'mbl' ? 'Type' : "Shipment Id",
            accessorKey: place === 'mbl' ? 'typeOfBL' : "bookingShipmentId",
            className: "w-1/6"
        },

        {
            header: place === 'mbl' ? '' : "Branch",
            accessorKey: place === 'mbl' ? '' : "branchMasterName",
            className: "w-1/6"
        },
        {
            header: place === 'mbl' ? 'Shipper' : "Invoice Date",
            accessorKey: place === 'mbl' ? 'shipper' : "invoiceDate",
            className: "w-1/6"
        },
        {
            header: place === 'mbl' ? 'Consignee' : "Net Weight",
            accessorKey: place === 'mbl' ? 'consignee' : "netWeight",
           
            className: "w-1/6"
        },
        {
            header: place === 'mbl' ? 'Invoice Number' : "Gross Weight",
            accessorKey: place === 'mbl' ? 'invoiceNumber' : "grossWeight",
            className: "w-1/6"
        },
        {
            header: place === 'mbl' ? 'Purchase Order Number' : "Volume",
            accessorKey: place === 'mbl' ? 'purchaseOrderNumber' : "volume",
            className: "w-1/6"
        },
        {
            header: "No. of Packages",
            cell: (item: any) => (
                <div className="flex justify-center">
                    {item.noOfPackages || "-"}
                </div>
            ),
            accessorKey: "noOfPackages",
            className: "flex justify-center"
        }
    ]

    const ifMbl = [
        {
            header: "GROSS WEIGHT",
            accessorKey: "weight",
            className: "w-1/8 text-center"
        },
        {
            header: "VOLUME",
            accessorKey: "volume",
            className: "w-1/8 text-center"
        },
        {
            header: "PORT OF DISCHARGE",
            accessorKey: "portOfDischarge",
            className: "w-1/6"
        },
        {
            header: "VESSEL - VOYAGE",
            accessorKey: "vesselVoyageNo",
            className: "w-1/6"
        },
        {
            header: "CONTAINER NO.",
            accessorKey: "containerNo",
            className: "w-1/5"
        },
        {
            header: "BOOKING'S",
            cell: (item: any): ReactNode => (
                <div className="flex flex-wrap gap-1">
                    {item.selectedShipmentDetails?.map((bookingNumber: any, index: number) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100 text-xs">
                            {bookingNumber.shipmentId}
                        </Badge>
                    )) || "-"}
                </div>
            ),
            accessorKey: "bookingNumber",
            className: "flex justify-center"
        }
    ]

    // Define search configuration
    const searchConfig = {
        placeholder: place === 'mbl' ? "Search bl number..." : "Search invoices...",
        value: place === 'mbl' ? filters.sSearch || "" : filters.invoiceNumber || "",
        onChange: (value: string) => {
            let filter = place === 'mbl' ? {sSearch: value} : {invoiceNumber: value}
            handleFilterChange({
                 ...filter,
                iDisplayStart: 0    
            })
        },
        searchFn: (invoice: Invoice, term: string): boolean => {
            const lowerTerm = term.toLowerCase()
            return (
                (invoice.invoiceNumber?.toLowerCase().includes(lowerTerm) ?? false)
            )
        }
    }

    // Define server-side pagination
    const serverSidePagination = {
        currentPage: (filters.iDisplayStart / filters.iDisplayLength) + 1,
        pageSize: filters.iDisplayLength,
        totalItems: totalRecords,
        onPageChange: (page: number) => {
            handlePageChange(page, filters.iDisplayLength)
            return Promise.resolve()
        },
        onPageSizeChange: (size: number) => {
            handlePageSizeChange(size)
            handlePageChange(1, size)
            return Promise.resolve()
        }
    }
      // Helper function to create a common setSelected handler
      const createSetSelectedHandler = (
        setValue: React.Dispatch<React.SetStateAction<any>>,
        filterKey: string
      ) => (value: string | SelectOption | string[] | SelectOption[] | (string | SelectOption)[] | null) => {
        // Handle direct SelectOption or null from SelectSearch component
        if (value === null) {
          setValue(null);
          return;
        }
        
        // Handle single SelectOption object (from SelectSearch)
        if (typeof value === 'object' && !Array.isArray(value) && value !== null) {
          const selectedOption = value as SelectOption;
          setValue({ value: selectedOption.value, label: selectedOption.label });
          return;
        }
        
        // Handle array format (from other filter types)
        if (Array.isArray(value) && value.length > 0) {
          // Extract the value and label from the object if it's an object, otherwise use the string value
          if (typeof value[0] === 'object' && value[0] !== null) {
            const selectedOption = value[0] as SelectOption;
            setValue({ value: selectedOption.value, label: selectedOption.label });
          } else {
            const selectedValue = value[0] as string;
            // Create an object with the same value for both label and value
            setValue({ value: selectedValue, label: selectedValue });
          }
        } else {
          // Clear selection for empty arrays
          setValue(null);
        }
      };
    
      // Helper function to create a common filterFn
      const createFilterFn = (itemAccessor: (item: any) => string | undefined) => {
        return (item: any, selectedValues: string[] | SelectOption[] | (string | SelectOption)[]) => {
          if (selectedValues.length === 0) return true;
    
          // Handle all possible array types: string[], SelectOption[], or mixed (string | SelectOption)[]
          return selectedValues.some(selected => {
            const itemValue = itemAccessor(item) || '';
            if (typeof selected === 'string') {
              return selected === itemValue;
            } else {
              return selected.value === itemValue;
            }
          });
        };
      };

      const [bookingId, setBookingId] = useState<SelectOption | null>(null);
      const [branchId, setBranchId] = useState<SelectOption | null>(null);
      
      // MBL Filter states
      const [shipperId, setShipperId] = useState<SelectOption | null>(null);
      const [consigneeId, setConsigneeId] = useState<SelectOption | null>(null);
      const [portOfLoadingId, setPortOfLoadingId] = useState<SelectOption | null>(null);
      const [portOfDischargeId, setPortOfDischargeId] = useState<SelectOption | null>(null);
      const [vesselId, setVesselId] = useState<SelectOption | null>(null);
      const [cartingPointId, setCartingPointId] = useState<SelectOption | null>(null);
      
      // Color schemes for filters
      const billOfLeadingColorSchemes = {
        shipperId: "bg-blue-100 text-blue-800",
        consigneeId: "bg-green-100 text-green-800",
        portOfLoadingId: "bg-purple-100 text-purple-800",
        portOfDischargeId: "bg-orange-100 text-orange-800",
        vesselId: "bg-red-100 text-red-800",
        cartingPointId: "bg-yellow-100 text-yellow-800"
      };
    
      const handleMBLFilterChange = (name: string, value: any) => {
        // Update the appropriate state
        switch(name) {
          case 'shipperId':
            setShipperId(value);
            break;
          case 'consigneeId':
            setConsigneeId(value);
            break;
          case 'portOfLoadingId':
            setPortOfLoadingId(value);
            break;
          case 'portOfDischargeId':
            setPortOfDischargeId(value);
            break;
          case 'vesselId':
            setVesselId(value);
            break;
          case 'cartingPointId':
            setCartingPointId(value);
            break;
        }
        
        if (handleFilterChange) {
          handleFilterChange({
            [name]: value?.value || '',
            iDisplayStart: 0
          });
        }
      };
    
      const handleFilterChange2 = (name: string, value: any) => {
        if (name === 'bookingId') {
          setBookingId(value);
        } else if (name === 'branchId') {
          setBranchId(value);
        }
    
        if (handleFilterChange) {
            const filterObj: any = {
                bookingId: (name === 'bookingId' ? value?.value : bookingId?.value) || '',
                iDisplayStart: 0
            };
            
            if (place === 'mbl') {
                filterObj.branchId = (name === 'branchId' ? value?.value : branchId?.value) || '';
            } else {
                filterObj.branchMasterId = (name === 'branchId' ? value?.value : branchId?.value) || '';
            }
            
            handleFilterChange(filterObj);
        }
      };

      const filterConfigs: FilterConfig<any>[] = [
        {
          id: "bookings",
          label: "Booking",
          badgeClassName: "bg-blue-100 text-blue-800",
          selected: bookingId ? [bookingId] : [],
          setSelected: (value) => {
            createSetSelectedHandler(setBookingId, 'bookingId')(value);
            handleFilterChange2('bookingId', Array.isArray(value) && value.length > 0 ? 
              (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
          },
          filterType: 'select-search',
          api: '/api/v1/bookings/dropdown-search',
          filterFn: createFilterFn(item => item.bookings)
        },
        {
            id: "branch",
            label: "Branch",
            badgeClassName: "bg-green-100 text-green-800",
            selected: branchId ? [branchId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setBranchId, 'branchId')(value);
              handleFilterChange2('branchId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/branches/dropdown-search',
            filterFn: () => true
          },
      ];

      const ifMBLFilter: FilterConfig<any>[] = [
        {
            id: "shipper",
            label: "Shipper",
            badgeClassName: billOfLeadingColorSchemes.shipperId,
            selected: shipperId ? [shipperId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setShipperId, 'shipperId')(value);
              handleMBLFilterChange('shipperId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/companies/dropdown-search',
            filterFn: createFilterFn(item => typeof item.shipper === 'object' && item.shipper ? item.shipper.companyId : undefined)
          },
          {
            id: "consignee",
            label: "Consignee",
            badgeClassName: billOfLeadingColorSchemes.consigneeId,
            selected: consigneeId ? [consigneeId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setConsigneeId, 'consigneeId')(value);
              handleMBLFilterChange ('consigneeId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/companies/dropdown-search',
            filterFn: createFilterFn(item => typeof item.consignee === 'object' && item.consignee ? item.consignee.companyId : undefined)
          },
          {
            id: "portOfLoadingId",
            label: "Port of Loading",
            badgeClassName: billOfLeadingColorSchemes.portOfLoadingId,
            selected: portOfLoadingId ? [portOfLoadingId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setPortOfLoadingId, 'portOfLoadingId')(value);
              handleMBLFilterChange('portOfLoadingId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/ports/dropdown-search',
            filterFn: createFilterFn(item => item.portOfLoading ? item.portOfLoading.portId : undefined)
          },
          {
            id: "portOfDischarge",
            label: "Port of Discharge",
            badgeClassName: billOfLeadingColorSchemes.portOfDischargeId,
            selected: portOfDischargeId ? [portOfDischargeId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setPortOfDischargeId, 'portOfDischargeId')(value);
              handleMBLFilterChange('portOfDischargeId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/ports/dropdown-search',
            filterFn: createFilterFn(item => typeof item.portOfDischarge === 'object' && item.portOfDischarge ? item.portOfDischarge.portId : undefined)
          },
          {
            id: "vessel",
            label: "Vessel",
            badgeClassName: billOfLeadingColorSchemes.vesselId,
            selected: vesselId ? [vesselId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setVesselId, 'vesselId')(value);
              handleMBLFilterChange('vesselId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/vessels/dropdown-search',
            filterFn: createFilterFn(item => item.vessel ? item.vessel.vesselId : undefined)
          },
          {
            id: "cartingPoint",
            label: "Carting Point",
            badgeClassName: billOfLeadingColorSchemes.cartingPointId,
            selected: cartingPointId ? [cartingPointId] : [],
            setSelected: (value) => {
              createSetSelectedHandler(setCartingPointId, 'cartingPointId')(value);
              handleMBLFilterChange('cartingPointId', Array.isArray(value) && value.length > 0 ? 
                (typeof value[0] === 'object' ? value[0] : { value: value[0], label: value[0] }) : value);
            },
            filterType: 'select-search',
            api: '/api/v1/carting-points/dropdown-search',
            filterFn: () => true
          },
      ]

    if (isLoading) {
        return (
            <TableSkeleton
                rowCount={5}
                columns={[
                    { key: 'select', width: 'w-10' },
                    { key: 'invoiceNumber', width: 'w-1/6' },
                    { key: 'customer', width: 'w-1/6' },
                    { key: 'amount', width: 'w-1/6' },
                    { key: 'status', width: 'w-1/6' },
                    { key: 'dateIssued', width: 'w-1/6' }
                ]}
                showSearchAndFilters={true}
                showPagination={true}
                className="max-w-full"
            />
        )
    }

    return (
        <div className="space-y-4 bg-white p-4 rounded-md shadow-sm">
            <PageHeader
                title="Link Invoices"
                description="Select invoices to link"
                actions={
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={onCancel}
                            disabled={isLinking}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="flex items-center gap-2"
                            onClick={handleLinkInvoices}
                            disabled={isLinking || selectedInvoices.length === 0}
                        >
                            <CheckSquare className="h-4 w-4" />
                            {isLinking ? "Linking..." : `Link Selected (${selectedInvoices.length})`}
                        </Button>
                    </div>
                }
            />

            <DataTable
                data={invoices}
                columns={place === 'mbl' ? [...columns, ...ifMbl] as any : columns as any}
                searchConfig={searchConfig}
                filterConfigs={ place === 'mbl' ? [...filterConfigs, ...ifMBLFilter] : filterConfigs}
                noResultsMessage={isLoading ? "Loading..." : "No invoices found."}
                serverSidePagination={serverSidePagination}
                className="max-w-[calc(100vw-16rem)]"
                dateFilters={ place === 'mbl' ? false : true}
                locationFilters={false}
                onClearFilters={() => {
                    setBookingId(null);
                    setBranchId(null);
                    setShipperId(null);
                    setConsigneeId(null);
                    setPortOfLoadingId(null);
                    setPortOfDischargeId(null);
                    setVesselId(null);
                    setCartingPointId(null);

                    handleFilterChange({
                        invoiceNumber: "",
                        fromDate: "",
                        toDate: "",
                        bookingId: "",
                        branchMasterId: "",
                        branchId: "",
                        sSearch: "",
                        iDisplayStart: 0,
                        shipperId: "",
                        consigneeId: "",
                        portOfLoadingId: "",
                        portOfDischargeId: "",
                        vesselId: "",
                        cartingPointId: ""
                    })

                }}
                onDateFilterChange={(e: any) => {
                     const {name, value} = e.target
                     console.log(name, value)
                    handleFilterChange({
                        [name]: value,
                        iDisplayStart: 0
                    })
                }}
            />
        </div>
    )
}
