'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthLayout } from '../../components/ui/AuthLayout';
import { Button } from '../../components/ui/button';
import { Form } from '../../components/ui/form';
import { TextField } from '../../components/forms/common/FormFields';
import { forgotPasswordSchema } from '../../lib/validations';
import { apiService } from '../../lib/api';

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');
  
  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });
  
  const { handleSubmit, control } = form;
  
  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiService.post<{ success: boolean; message: string }>('/forgot-password', { email: data.email });
      
      if (response.success) {
        setSubmittedEmail(data.email);
        setIsSubmitted(true);
        toast.success('Password reset instructions sent to your email');
      } else {
        toast.error(response.message || 'Failed to send reset instructions');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Forgot Password"
      subtitle="Enter your email to receive password reset instructions"
      titleIcon="🔑"
    >
      {!isSubmitted ? (
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <TextField
                control={control}
                name="email"
                label="Email"
                placeholder="email@example.com"
                type="email"
                required
                disabled={isLoading}
              />
              
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
              
              <div className="text-center">
                <Link href="/login" className="text-black hover:underline">
                  Back to Login
                </Link>
              </div>
            </form>
          </Form>
        ) : (
          <div className="text-center">
            <div className="mb-6 p-4 bg-green-50 text-green-700 rounded-md">
              <h3 className="font-bold text-lg mb-2">Email Sent!</h3>
              <p>
                We've sent password reset instructions to:
                <br />
                <span className="font-medium">{submittedEmail}</span>
              </p>
              <p className="mt-2 text-sm">
                Please check your inbox and follow the instructions to reset your password.
                If you don't see the email, please check your spam folder.
              </p>
            </div>
            
            <Button
              onClick={() => setIsSubmitted(false)}
              className="mt-4"
            >
              Try Another Email
            </Button>
            
            <div className="mt-4">
              <Link href="/login" className="text-black hover:underline">
                Back to Login
              </Link>
            </div>
          </div>
        )}
    </AuthLayout>
  );
}
