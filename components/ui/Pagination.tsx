import React from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MoreHorizontal, ChevronsLeft, ChevronsRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface PaginationProps {
  page: number;
  pageSize: number;
  total: number;
  onPageChange: (page: number) => void;
  onPageSizeChange?: (size: number) => void;
  pageSizeOptions?: number[];
  className?: string;
  showFirstLast?: boolean;
}

export function Pagination({
  page,
  pageSize,
  total,
  onPageChange,
  onPageSizeChange,
  pageSizeOptions = [10, 20, 50, 100],
  className = "",
  showFirstLast = true,
}: PaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  const handlePrev = () => {
    if (page > 1) onPageChange(page - 1);
  };

  const handleNext = () => {
    if (page < totalPages) onPageChange(page + 1);
  };

  const handleFirst = () => {
    if (page > 1) onPageChange(1);
  };

  const handleLast = () => {
    if (page < totalPages) onPageChange(totalPages);
  };

  // Show up to 5 page numbers, with ellipsis if needed
  const getPageNumbers = () => {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 3)
      return [1, 2, 3, 4, "...", totalPages];
    if (page >= totalPages - 2)
      return [1, "...", totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  return (
    <div className={cn("flex flex-col sm:flex-row items-center justify-between gap-4 pb-3", className)}>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4">
        {/* Results count - now on the left */}
        <span className="text-sm text-muted-foreground whitespace-nowrap order-1 sm:order-none">
          {total === 0 ? (
            "No results"
          ) : (
            <>Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, total)} of {total}</>
          )}
        </span>
      </div>
      
      {/* Page size selector - stays on the right */}
      {onPageSizeChange && (
        <div className="flex items-center gap-2">
             {/* Page navigation controls */}
        <div className="flex items-center gap-1.5">
          {showFirstLast && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleFirst} 
              disabled={page === 1}
              className="h-8 w-8 rounded-md transition-colors hover:bg-muted"
            >
              <ChevronsLeft className="h-4 w-4" />
              <span className="sr-only">First page</span>
            </Button>
          )}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handlePrev} 
            disabled={page === 1}
            className="h-8 w-8 rounded-md transition-colors hover:bg-muted"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Previous page</span>
          </Button>
          
          <div className="flex items-center">
            {getPageNumbers().map((num, idx) =>
              typeof num === "number" ? (
                <Button
                  key={num}
                  variant={num === page ? "default" : "ghost"}
                  size="icon"
                  onClick={() => onPageChange(num)}
                  className={cn(
                    "size-8 rounded-full text-sm font-medium transition-colors",
                   )}
                >
                  {num}
                </Button>
              ) : (
                <span key={`ellipsis-${idx}`} className="w-8 flex items-center justify-center text-muted-foreground">
                  <MoreHorizontal className="h-4 w-4" />
                </span>
              )
            )}
          </div>
          
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={handleNext} 
            disabled={page === totalPages}
            className="h-8 w-8 rounded-md transition-colors hover:bg-muted"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Next page</span>
          </Button>
          {showFirstLast && (
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={handleLast} 
              disabled={page === totalPages}
              className="h-8 w-8 rounded-md transition-colors hover:bg-muted"
            >
              <ChevronsRight className="h-4 w-4" />
              <span className="sr-only">Last page</span>
            </Button>
          )}
        </div>
          <span className="text-sm text-muted-foreground">Rows per page:</span>
          <select
            className="h-8 rounded-md shadow-sm border border-input bg-background px-2 py-1 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={pageSize}
            onChange={e => onPageSizeChange(Number(e.target.value))}
            aria-label="Rows per page"
          >
            {pageSizeOptions.map(size => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
