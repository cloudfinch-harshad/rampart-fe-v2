'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useApiMutation } from '@/hooks/useApi';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/Spinner';
import { toast } from 'sonner';

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

interface VendorResponse {
  success: boolean;
  message: string;
  vendorData: VendorData | null;
}

export default function VendorSubmissionPage() {
  const params = useParams();
  const accessCode = params.accessCode as string;
  const [vendor, setVendor] = useState<VendorData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { mutate: fetchVendor } = useApiMutation<VendorResponse, { accessCode: string }>(
    'get-brsr-vendor',
    'POST'
  );

  useEffect(() => {
    if (!accessCode) return;

    setIsLoading(true);
    setError(null);

    fetchVendor(
      { accessCode },
      {
        onSuccess: (response) => {
            console.log(response);
          if (response.success && response.vendorData) {
            setVendor(response.vendorData);
          } else {
            setError(response.message || 'Invalid access code');
            toast.error(response.message || 'Invalid access code');
          }
          setIsLoading(false);
        },
        onError: (error) => {
          console.error('Error fetching vendor data:', error);
          setError('Failed to load vendor data. Please try again later.');
          toast.error('Failed to load vendor data');
          setIsLoading(false);
        },
      }
    );
  }, [accessCode, fetchVendor]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Access Error</CardTitle>
            <CardDescription>
              {error || 'Invalid access code. Please check the URL and try again.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-500 mb-4">
              If you believe this is an error, please contact your administrator.
            </p>
            <Button
              onClick={() => window.location.reload()}
              className="w-full"
            >
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>BRSR Vendor Submission</CardTitle>
          <CardDescription>
            Welcome, {vendor.vendorName}. Please complete your BRSR submission.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Vendor Name</h3>
              <p className="text-base">{vendor.vendorName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <p className="text-base">{vendor.vendorEmail}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Contact Person</h3>
              <p className="text-base">{vendor.contactName}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Deadline</h3>
              <p className="text-base">{vendor.deadlineDate || 'Not specified'}</p>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-md mb-6">
            <p className="text-sm text-blue-700">
              This is a secure form for submitting your BRSR compliance data. Your access code is: <span className="font-mono font-medium">{vendor.accessCode}</span>
            </p>
          </div>

          {/* Placeholder for the actual BRSR form - to be implemented */}
          <div className="border border-dashed border-gray-300 rounded-md p-8 text-center">
            <p className="text-gray-500 mb-4">BRSR submission form will be displayed here</p>
            <Button>Start Submission</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
