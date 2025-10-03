'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Pencil, Check } from 'lucide-react';
import { BrsrComplianceItem } from './BrsrComplianceItem';
import { ComplianceTable, ComplianceColumn } from './ComplianceTable';

interface BrsrItem {
  brsrMasterId: string;
  sequenceNumber: number;
  requirement: string;
  brsrItemId: string | null;
  response: string;
  notes: string;
  vendorId: string | null;
}

interface BrsrSectionProps {
  sectionId: string;
  sectionName: string | null;
  sectionNumber: number;
  description: string | null;
  items: BrsrItem[];
}

export function BrsrComplianceSection({ 
  sectionId, 
  sectionName, 
  sectionNumber, 
  description, 
  items 
}: BrsrSectionProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  
  // Calculate completion percentage
  const completedItems = items.filter(item => item.response && item.response.trim() !== '').length;
  const totalItems = items.length;
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;
  
  // Get section name based on section number
  const getSectionName = (num: number) => {
    switch(num) {
      case 1: return 'General Disclosures';
      case 2: return 'Management & Process';
      case 3: return 'Principle-wise Performance';
      case 4: return 'ESG & SDG Performance Data';
      default: return sectionName || `Section ${num}`;
    }
  };

  return (
    <div className="mb-6 bg-white rounded-lg shadow-sm overflow-hidden">
      {/* Section Header */}
      <div 
        className="flex items-center p-4 cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="mr-2">
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-gray-500" />
          ) : (
            <ChevronRight className="h-5 w-5 text-gray-500" />
          )}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">
            Section {sectionNumber}: {getSectionName(sectionNumber)}
          </h3>
          <div className="text-sm text-gray-500">
            Due: 30 days | {completedItems}/{totalItems} items completed
          </div>
        </div>
        <div className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs font-medium">
          {completionPercentage}% items completed
        </div>
      </div>
      
      {/* Section Content */}
      {isExpanded && (
        <div className="px-4 pb-4">
          <div className="text-sm text-gray-600 mb-4">
            {description || `This section covers ${getSectionName(sectionNumber).toLowerCase()} related to the company's sustainability practices.`}
          </div>
          
          <ComplianceTable
            data={items.map(item => ({
              ...item,
              id: item.brsrMasterId // Ensure id is available for the table
            }))}
            columns={[
              {
                header: '#',
                accessorKey: 'sequenceNumber',
                width: 'w-12',
                align: 'center',
                cell: (item) => {
                  return (
                    <div className="text-center rounded-full shadow-sm p-1 bg-gray-100">
                      {item.sequenceNumber}
                    </div>
                  );
                }
              },
              {
                header: 'Requirement',
                accessorKey: 'requirement',
                align: 'left'
              },
              {
                header: 'Response',
                accessorKey: 'response',
                cell: (item) => (
                  item.response || (
                    <span className="text-gray-400 text-sm">
                      Click to add data...
                    </span>
                  )
                )
              },
              {
                header: 'Notes',
                accessorKey: 'notes',
                cell: (item) => (
                  item.notes || (
                    <span className="text-gray-400 text-sm">
                      Click to add notes...
                    </span>
                  )
                )
              },
              {
                header: 'Actions',
                width: 'w-24',
                align: 'center',
                cell: (item) => (
                  <div className="flex justify-center space-x-2">
                    <button 
                      className="p-1 rounded-full hover:bg-blue-50 text-blue-500"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button 
                      className="p-1 rounded-full hover:bg-red-50 text-red-500"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  </div>
                )
              }
            ]}
            maxHeight="[calc(100vh-300px)]"
          />
          
          {/* Complete All Button */}
          <div className="mt-4 flex justify-end">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm">
              Complete All
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
