'use client';

import React, { ReactNode } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

// Generic type for table items
export interface ComplianceItem {
  id: string;
  sequenceNumber: number;
  requirement: string;
  response: string;
  notes: string;
  [key: string]: any; // Allow for additional properties
}

// Column definition
export interface ComplianceColumn<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (item: T) => ReactNode;
  className?: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

// Table props
export interface ComplianceTableProps<T extends ComplianceItem> {
  data: T[];
  columns: ComplianceColumn<T>[];
  renderRow?: (item: T) => ReactNode;
  noResultsMessage?: string;
  className?: string;
  maxHeight?: string;
}

export function ComplianceTable<T extends ComplianceItem>({
  data,
  columns,
  renderRow,
  noResultsMessage = 'No compliance items found.',
  className = '',
  maxHeight = 'calc(100vh-300px)',
}: ComplianceTableProps<T>) {
  // Helper function to get alignment class based on column position and explicit alignment
  const getAlignmentClass = (align?: 'left' | 'center' | 'right', index?: number) => {
    // If explicit alignment is provided, use it
    if (align) {
      switch (align) {
        case 'center': return 'text-center';
        case 'right': return 'text-right';
        case 'left': return 'text-left';
      }
    }
    
    // Default alignment based on position
    if (index === 0) return 'text-left';
    if (index === columns.length - 1) return 'text-right';
    return 'text-center';
  };

  return (
    <div className={`overflow-x-auto ${maxHeight ? `max-h-${maxHeight}` : ''}`}>
      <Table className={`w-full text-sm ${className}`}>
        <TableHeader>
          <TableRow className="bg-gray-50">
            {columns.map((column, index) => (
              <TableHead
                key={index}
                className={`py-3 px-4 font-medium text-gray-500 uppercase ${getAlignmentClass(column.align, index)} ${column.className || ''} ${column.width ? column.width : ''}`}
              >
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length > 0 ? (
            renderRow ? (
              // Use custom row renderer if provided
              data.map((item) => renderRow(item))
            ) : (
              // Default row rendering
              data.map((item) => (
                <TableRow key={item.id} className="border-b border-gray-100 hover:bg-gray-50">
                  {columns.map((column, colIndex) => (
                    <TableCell
                      key={colIndex}
                      className={`py-3 px-4 ${getAlignmentClass(column.align, colIndex)}`}
                    >
                      {column.cell
                        ? column.cell(item)
                        : column.accessorKey
                        ? String(item[column.accessorKey] || '-')
                        : null}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )
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
  );
}
