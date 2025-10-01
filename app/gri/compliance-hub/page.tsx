'use client';

import { useEffect } from 'react';
import { useApiMutation } from '@/hooks/useApi';
import { BrsrCompliance } from '@/components/compliance/BrsrCompliance';

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

export default function ComplianceHubPage() {
  // Use the API mutation hook to call the get-brsr-items endpoint
  const { mutate: fetchBrsrItems, data, isPending, isError, error } = useApiMutation<BrsrItemsResponse, BrsrItemsPayload>(
    'get-brsr-items',
    'POST'
  );

  // Call the API when the component mounts
  useEffect(() => {
    const payload: BrsrItemsPayload = {
      fy: "2025-2026",
      vendorId: ""
    };
    
    // Call the API and log the response
    fetchBrsrItems(payload, {
      onSuccess: (data) => {
        console.log('BRSR Items API Response:', data);
      },
      onError: (error) => {
        console.error('Error fetching BRSR items:', error);
      }
    });
  }, [fetchBrsrItems]);

  return (
    <div className="">
      {isPending ? (
        <div className="flex items-center justify-center p-6">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
      ) : isError ? (
        <div className="text-red-500 p-6 bg-white rounded-lg shadow-sm">
          Error loading compliance data: {error?.message || 'Unknown error'}
        </div>
      ) : data ? (
        <BrsrCompliance data={data} />
      ) : (
        <div className="text-gray-500 p-6 bg-white rounded-lg shadow-sm">
          No compliance data available
        </div>
      )}
    </div>
  );
}
