"use client"

import { ReactNode, useEffect, useState } from "react"
import { DataTable } from "@/components/tables/common/DataTable"
import { TableSkeleton } from "@/components/skeletons/TableSkeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { useApiMutation, useApiQuery } from "@/hooks/useApi"
import { Permission } from "@/hooks/usePermissions"
import { PageHeader } from "@/components/ui/PageHeader"
import { LinkInvoicesPage } from "./LinkInvoicesPage"

// Re-export LinkInvoicesPage for convenience
export { LinkInvoicesPage }

interface BlInvoice {
  invoiceId: string
  invoiceNumber: string
  invoiceDate: string
  invoiceAmount: number
  currency: string
  status: string
  createdBy: string
  createdAt: string
  containerNumbers?: string[]
}

interface BlInvoicesPageProps {
  billOfLadingId: string
  permissions?: Permission
  listEndpoint?: string
  deleteEndpoint?: string
  linkEndpoint?: string
  linkListEndpoint?: string
  place?: string
}

export function LinkedInvoicesPage({ 
  billOfLadingId, 
  permissions, 
  place,
  listEndpoint = "/api/v1/bills-of-lading/get-bl-invoices", 
  deleteEndpoint = "/api/v1/bills-of-lading/remove-linked-invoice", 
  linkEndpoint = "/api/v1/bills-of-lading/link-invoice",
  linkListEndpoint = "/api/v1/invoices/list"
}: BlInvoicesPageProps) {
  // State for invoices data
  const [invoices, setInvoices] = useState<BlInvoice[]>([])
  const [totalRecords, setTotalRecords] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")

  // State for dialogs
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [invoiceToDelete, setInvoiceToDelete] = useState<string | null>(null)
  
  // Loading state for permissions
  const [permissionsLoading, setPermissionsLoading] = useState(false)

  // API query for fetching invoices
  const { refetch, isFetching, data } = useApiQuery<any>({
    queryKey: ["bl-invoices", billOfLadingId, currentPage, pageSize, searchTerm],
    url: listEndpoint,
    method: "POST",
    body: {
      iDisplayStart: (currentPage - 1) * pageSize,
      iDisplayLength: pageSize,
      id: billOfLadingId,
      searchTerm
    },
    enabled: !!billOfLadingId,
    onError: () => {
      toast.error("Failed to load invoices")
    }
  })
  
  // Handle successful API response
  useEffect(() => {
    console.log(data)
    if (data?.data?.aaData) { 
      setInvoices(data.data.aaData)
      setTotalRecords(data.data.iTotalRecords || 0)
    } else if(data?.aaData){
      setInvoices(data.aaData)
      setTotalRecords(data.iTotalRecords || 0)
    }
  }, [data])

  // API mutation for deleting an invoice
  const { mutateAsync: deleteInvoice, isPending: isDeleting } = useApiMutation({
    url: deleteEndpoint,
    method: "POST",
    onSuccess: () => {
      toast.success("Invoice removed successfully")
      refetch()
    },
    onError: () => {
      toast.error("Failed to remove invoice")
    }
  })

  // Handle delete confirmation
  const handleDeleteClick = (invoice: BlInvoice) => {
    setInvoiceToDelete(invoice.invoiceId)
    setIsDeleteDialogOpen(true)
  }

  // Handle delete action
  const handleDelete = async () => {
    if (!invoiceToDelete) return

    try {
      await deleteInvoice({
        [place=== 'mbl'? 'masterBillOfLadingId' : place === "container" ? "containerId" : "billOfLadingId"]: billOfLadingId,
        invoiceId: invoiceToDelete
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setInvoiceToDelete(null)
    }
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size)
    setCurrentPage(1) // Reset to first page when changing page size
  }

  // Handle search
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setCurrentPage(1) // Reset to first page when searching
  }

  // Common action column to avoid duplication
  const actionColumn = {
    header: "Actions",
    cell: (item: BlInvoice): ReactNode => (
      <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteClick(item)}
            className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
      </div>
    ),
    className: "w-[100px]"
  }

  // MBL specific columns
  const mblColumns = [
    {
      header: "BL NUMBER",
      accessorKey: "blNumber" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "BL DATE",
      accessorKey: "blDate" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "BL TYPE",
      accessorKey: "typeOfBl" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "SHIPPING BILL'S",
      accessorKey: "shippingBillCount" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "CONTAINER'S",
      accessorKey: "containerNumbers" as keyof BlInvoice,
      cell: (item: BlInvoice): ReactNode => (
        <div className="flex items-center gap-2">
          {item.containerNumbers?.map((containerNumber: string, index: number) => (
            <Badge key={index} variant="outline" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
              {containerNumber}
            </Badge>
          ))}
        </div>
      ),
      className: "w-[200px]"
    }
  ]

  // Default invoice columns
  const defaultColumns = [
    {
      header: "Invoice Number",
      accessorKey: "invoiceNumber" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "Booking Id",
      accessorKey: "shipmentId" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "Consignee",
      accessorKey: "consignee" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "No of Packages",
      accessorKey: "noOfPackages" as keyof BlInvoice,
      className: "w-[100px]"
    },
    {
      header: "Port of Discharge",
      accessorKey: "portOfDischarge" as keyof BlInvoice,
      className: "w-[150px]"
    },
    {
      header: "Forwarding Agent Origin",
      accessorKey: "forwardingAgentAtOrigin" as keyof BlInvoice,
      className: "w-[150px]"
    }
  ]

  // Combine columns based on place
  const columns = place === 'mbl' 
    ? [...mblColumns, actionColumn]
    : [...defaultColumns, actionColumn]

  // Configure server-side pagination
  const serverSidePagination = {
    currentPage,
    pageSize,
    totalItems: totalRecords,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange
  }

  // Define search configuration
  const searchConfig = {
    placeholder: "Search invoices...",
    value: searchTerm,
    onChange: handleSearch,
    searchFn: (item: BlInvoice, term: string): boolean => {
      const searchTerm = term.toLowerCase();
      return (
        (item.invoiceNumber?.toLowerCase().includes(searchTerm) || false) ||
        (item.status?.toLowerCase().includes(searchTerm) || false)
      );
    }
  }

  if (isFetching && invoices.length === 0) {
    return (
      <TableSkeleton
        rowCount={5}
        columns={[
          { key: 'invoiceNumber', width: 'w-1/6' },
          { key: 'invoiceDate', width: 'w-1/6' },
          { key: 'amount', width: 'w-1/6' },
          { key: 'status', width: 'w-1/6' },
          { key: 'createdBy', width: 'w-1/6' },
          { key: 'createdAt', width: 'w-1/6' },
          { key: 'actions', width: 'w-1/12' },
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
                title={place === 'mbl' ? "Link BLs" : place === "container" ? "Container Invoices" : "BL Invoices"}
                description={place === 'mbl' ? "Click on the plus icon to link BLs, clicking on the cross icon before BL Number will unlink the BL for this particular MBL" : place === "container" ? "Click on the plus icon to link invoice, clicking on the cross icon before Invoice id will remove the invoice for this particular Container" : "Click on the plus icon to link invoice, clicking on the cross icon before Invoice id will remove the invoice for this particular BL"}
                actions={
                    <Button 
                            className="flex items-center gap-2"
                            onClick={() => setIsDialogOpen(true)}
                            disabled={permissionsLoading}
                        >
                            <Plus className="h-4 w-4" />
                            {place === 'mbl' ? "Link BL" : place === "container" ? "Container Invoice" : "Link Invoice"}
                        </Button>    
                }
            />
      
      <DataTable
        data={invoices}
        columns={columns}
        searchConfig={searchConfig}
        noResultsMessage={isFetching ? "Loading..." : "No invoices found."}
        serverSidePagination={serverSidePagination}
        className="max-w-full"
        dateFilters={false}
        locationFilters={false}
      />
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently unlink this invoice from the bill of lading.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? "Removing..." : "Remove"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      {/* Add Invoice Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <LinkInvoicesPage 
            billOfLadingId={billOfLadingId}
            onSuccess={() => {
              setIsDialogOpen(false)
              refetch() // Refresh the list after successful creation
            }}
            onCancel={() => setIsDialogOpen(false)}
            listEndpoint={linkListEndpoint}
            linkEndpoint={linkEndpoint}
            place={place}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}