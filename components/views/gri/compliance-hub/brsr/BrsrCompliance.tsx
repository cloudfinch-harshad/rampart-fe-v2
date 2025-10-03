'use client';

import { useState, useEffect } from 'react';
import { useApiMutation } from '@/hooks/useApi';
import { BrsrComplianceSection } from './BrsrComplianceSection';
import { FloatingActionButtons } from '@/components/common/FloatingActionButtons';

interface BrsrItem {
  brsrMasterId: string;
  sequenceNumber: number;
  requirement: string;
  brsrItemId: string | null;
  response: string;
  notes: string;
  vendorId: string | null;
}

interface BrsrSection {
  sectionId: string;
  sectionName: string | null;
  description: string | null;
  getBrsrItemResponseList: BrsrItem[];
}

interface BrsrItemsPayload {
  fy: string;
  vendorId: string;
}

interface BrsrItemsResponse {
  success: boolean;
  message: string;
  vendorId: string | null;
  vendorName: string;
  accessCode: string;
  deadlineDate: string | null;
  completionStatus: string;
  submittedDate: string | null;
  vendorEmail: string;
  organizationName: string;
  getBrsrSectionResponseList: BrsrSection[];
}

interface BrsrComplianceProps {
  isComplianceMode: boolean;
}

export function BrsrCompliance({ isComplianceMode }: BrsrComplianceProps) {
  
  // Use the API mutation hook to call the get-brsr-items endpoint
  const { mutate: fetchBrsrItems, data, isPending, isError, error } = useApiMutation<BrsrItemsResponse, BrsrItemsPayload>(
    'get-brsr-items',
    'POST'
  );

  const payload: BrsrItemsPayload = {
    fy: "2025-2026",
    vendorId: "" // Use appropriate vendor ID when in vendor mode
  };

  // Function to fetch BRSR items
  const fetchData = () => {
 
    
    // Call the API and log the response
    fetchBrsrItems(payload, {
      onSuccess: (data) => {
        console.log('BRSR Items API Response:', data);
      },
      onError: (error) => {
        console.error('Error fetching BRSR items:', error);
      }
    });
  };
  
  // Call the API when the component mounts or when mode changes
  useEffect(() => {
    fetchData();
  }, [isComplianceMode]); // Removed fetchBrsrItems from dependencies to avoid unnecessary re-fetches
  
  console.log('Current mode:', isComplianceMode ? 'Compliance Mode' : 'Vendor Mode');
  
  // Calculate overall completion percentage if data is available
  const totalItems = data?.getBrsrSectionResponseList?.reduce(
    (acc, section) => acc + section.getBrsrItemResponseList.length, 
    0
  ) || 0;
  
  const completedItems = data?.getBrsrSectionResponseList?.reduce(
    (acc, section) => acc + section.getBrsrItemResponseList.filter(
      item => item.response && item.response.trim() !== ''
    ).length, 
    0
  ) || 0;
  
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  if (isPending) {
    return (
      <div className="flex items-center justify-center p-6 h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 p-6 bg-white rounded-lg shadow-sm h-full">
        Error loading compliance data: {error?.message || 'Unknown error'}
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-gray-500 p-6 bg-white rounded-lg shadow-sm h-full">
        No compliance data available
      </div>
    );
  }

  return (
    <>
      {/* Floating Action Buttons */}
      <FloatingActionButtons payload={payload} />
      
      <div className="space-y-6 h-full overflow-y-auto pb-8 relative">
      {/* Overall Progress */}
      <div className="flex items-center space-x-6 bg-white p-6 rounded-lg shadow-sm">
        <div className="relative h-20 w-20">
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-xl font-bold">{completionPercentage}%</span>
          </div>
          <svg className="h-20 w-20" viewBox="0 0 36 36">
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#E5E7EB"
              strokeWidth="3"
            />
            <path
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="#3B82F6"
              strokeWidth="3"
              strokeDasharray={`${completionPercentage}, 100`}
            />
          </svg>
        </div>
        <div>
          <h2 className="text-lg font-semibold">Section A: General Disclosures</h2>
          <p className="text-sm text-gray-500">Complete all sections to finish your compliance report</p>
        </div>
      </div>
      
      <h2 className="text-xl font-semibold mt-8 uppercase">Compliance Sections</h2>
      
      {/* Sections */}
      {data.getBrsrSectionResponseList.map((section, index) => (
        <BrsrComplianceSection
          key={section.sectionId}
          sectionId={section.sectionId}
          sectionName={section.sectionName}
          sectionNumber={index + 1}
          description={section.description}
          items={section.getBrsrItemResponseList}
          onRefresh={fetchData}
        />
      ))}
    </div>
    </>
  );
}
