'use client';

import { useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useApiMutation } from '@/hooks/useApi';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form } from '@/components/ui/form';
import { TextField, DateField } from '@/components/forms/common/FormFields';
import { X, RefreshCw } from 'lucide-react';

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

// Function to generate a random access code
function generateAccessCode(length = 6): string {
  // Characters to use (excluding similar-looking characters like 0/O, 1/I/l)
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let result = '';
  
  // Generate random string of specified length
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
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
      accessCode: generateAccessCode(), // Generate random access code
      deadlineDate: '', // Default to 30 days from now
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
      accessCode: data.accessCode || generateAccessCode(), // Use the generated access code if not provided
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
              required
            />

            <TextField
              control={form.control}
              name="contactNumber"
              label="Phone Number"
              placeholder="Enter phone number"
              required
            />

            <div className="relative">
              <TextField
                control={form.control}
                name="accessCode"
                label="Access Code"
                placeholder="Enter access code"
                disabled
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="absolute right-0 top-8 mr-2"
                onClick={() => {
                  const newCode = generateAccessCode();
                  form.setValue('accessCode', newCode);
                  toast.success('New access code generated');
                }}
              >
                <RefreshCw className="h-3.5 w-3.5 mr-1" />
                Generate
              </Button>
            </div>

            <DateField
              control={form.control}
              name="deadlineDate"
              label="Deadline Date"
              placeholder="Select deadline date"
              required
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
