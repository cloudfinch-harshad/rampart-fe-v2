'use client';

import { useState } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, FileText, User, Mail, Phone } from 'lucide-react';

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

interface VendorSubmissionViewProps {
  isOpen: boolean;
  onClose: () => void;
  vendor: VendorData | null;
}

export function VendorSubmissionView({ isOpen, onClose, vendor }: VendorSubmissionViewProps) {
  if (!vendor) return null;

  // Status badge styling
  const getStatusBadge = (status: string) => {
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
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold flex items-center">
            <FileText className="mr-2 h-5 w-5 text-blue-600" />
            Vendor Submission Details
          </DialogTitle>
          <DialogDescription>
            View submission details for {vendor.vendorName}
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-6">
          {/* Vendor Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Vendor Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Vendor Name</p>
                  <p className="text-sm text-gray-600">{vendor.vendorName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Email</p>
                  <p className="text-sm text-gray-600">{vendor.vendorEmail}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <User className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact Person</p>
                  <p className="text-sm text-gray-600">{vendor.contactName}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Contact Number</p>
                  <p className="text-sm text-gray-600">{vendor.contactNumber}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Submission Status Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Submission Status</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Calendar className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Deadline</p>
                  <p className="text-sm text-gray-600">{vendor.deadlineDate || 'Not set'}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-gray-700">Submitted Date</p>
                  <p className="text-sm text-gray-600">{vendor.submittedDate || 'Not submitted yet'}</p>
                </div>
              </div>
              
              <div className="flex items-start col-span-2">
                <div>
                  <p className="text-sm font-medium text-gray-700 mb-1">Status</p>
                  {getStatusBadge(vendor.completionStatus)}
                </div>
              </div>
            </div>
          </div>
          
          {/* Access Information Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium border-b pb-2">Access Information</h3>
            
            <div className="flex items-start">
              <div>
                <p className="text-sm font-medium text-gray-700">Access Code</p>
                <p className="text-sm bg-gray-100 px-3 py-1 rounded font-mono">{vendor.accessCode}</p>
              </div>
            </div>
          </div>
        </div>
        
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
          <Button className="bg-blue-600 hover:bg-blue-700">
            View Full Submission
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
