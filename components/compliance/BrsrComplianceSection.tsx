'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { BrsrComplianceItem } from './BrsrComplianceItem';

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
          
          <div className="overflow-x-auto max-h-[calc(100vh-300px)]">
            <table className="w-full text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 w-12 text-center">#</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Requirement</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Response</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500">Notes</th>
                  <th className="py-3 px-4 text-left font-medium text-gray-500 w-24 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <BrsrComplianceItem
                    key={item.brsrMasterId}
                    sequenceNumber={item.sequenceNumber}
                    requirement={item.requirement}
                    response={item.response}
                    notes={item.notes}
                  />
                ))}
              </tbody>
            </table>
          </div>
          
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
