'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiMutation } from '@/hooks/useApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { TextField, DateField } from '@/components/forms/common/FormFields';
import { X } from 'lucide-react';

// Define the form schema using Zod
const vendorFormSchema = z.object({
  vendorName: z.string().min(1, { message: 'Vendor name is required' }),
  vendorEmail: z.string().email({ message: 'Invalid email address' }),
  contactName: z.string().min(1, { message: 'Contact name is required' }),
  contactNumber: z.string().min(10, { message: 'Contact number must be at least 10 digits' }),
  accessCode: z.string().optional(),
  deadlineDate: z.string().min(1, { message: 'Deadline date is required' }),
});

type VendorFormValues = z.infer<typeof vendorFormSchema>;

interface AddVendorFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

interface VendorPayload {
  vendorId: string;
  vendorName: string;
  vendorEmail: string;
  contactName: string;
  contactNumber: string;
  accessCode: string;
  deadlineDate: string;
}

interface VendorResponse {
  success: boolean;
  message: string;
}

export function AddVendorForm({ isOpen, onClose, onSuccess }: AddVendorFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { mutate: saveVendor } = useApiMutation<VendorResponse, VendorPayload>(
    'save-brsr-vendor',
    'POST'
  );

  const form = useForm<VendorFormValues>({
    resolver: zodResolver(vendorFormSchema),
    defaultValues: {
      vendorName: '',
      vendorEmail: '',
      contactName: '',
      contactNumber: '',
      accessCode: Math.floor(100000 + Math.random() * 900000).toString(), // Generate random 6-digit code
      deadlineDate: new Date(Date.now() + 30*24*60*60*1000).toISOString().split('T')[0], // Default to 30 days from now
    },
  });

  const onSubmit = (data: VendorFormValues) => {
    setIsSubmitting(true);
    
    const payload: VendorPayload = {
      vendorId: '', // Empty for new vendors
      vendorName: data.vendorName,
      vendorEmail: data.vendorEmail,
      contactName: data.contactName,
      contactNumber: data.contactNumber,
      accessCode: data.accessCode || Math.floor(100000 + Math.random() * 900000).toString(), // Ensure accessCode is always a string
      deadlineDate: data.deadlineDate,
    };

    saveVendor(payload, {
      onSuccess: (response) => {
        if (response.success) {
          toast.success('Vendor added successfully');
          form.reset();
          if (onSuccess) onSuccess();
          onClose();
        } else {
          toast.error(response.message || 'Failed to add vendor');
        }
        setIsSubmitting(false);
      },
      onError: (error) => {
        console.error('Error adding vendor:', error);
        toast.error('Failed to add vendor');
        setIsSubmitting(false);
      },
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader className="">
          <DialogTitle className="text-lg font-medium">Add New Vendor</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-2 gap-4 py-2">
            <TextField
              control={form.control}
              name="vendorName"
              label="Vendor Name"
              placeholder="Enter vendor company name"
              required
            />

            <TextField
              control={form.control}
              name="vendorEmail"
              label="Email"
              placeholder="Enter vendor email address"
              type="email"
              required
            />

            <TextField
              control={form.control}
              name="contactName"
              label="Contact Person"
              placeholder="Enter contact person name"
            />

            <TextField
              control={form.control}
              name="contactNumber"
              label="Phone Number"
              placeholder="Enter phone number"
            />

            <TextField
              control={form.control}
              name="accessCode"
              label="Access Code"
              placeholder="Enter access code"
            />

            <DateField
              control={form.control}
              name="deadlineDate"
              label="Deadline Date"
              placeholder="Select deadline date"
            />

          <DialogFooter className="mt-6 flex col-span-full justify-end gap-2">
            <Button type="submit" disabled={isSubmitting} className="flex-1 bg-blue-600 hover:bg-blue-700">
              {isSubmitting ? 'Adding...' : 'Add Vendor'}
            </Button>
          </DialogFooter>
        </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
