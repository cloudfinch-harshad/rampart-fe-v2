'use client';

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';
import { AuthLayout } from '../../components/ui/AuthLayout';
import { Button } from '../../components/ui/button';
import { Form } from '../../components/ui/form';
import { TextField } from '../../components/forms/common/FormFields';
import { registerSchema } from '../../lib/validations';
import { useAuth } from '../../lib/authContext';

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      companyName: '',
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });
  
  const { handleSubmit, control } = form;
  
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await register({
        companyName: data.companyName,
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
      });
      
      if (result.success) {
        toast.success(result.message || 'Registration successful');
        
        // Add a small delay to ensure the token is properly set in cookies
        // before redirecting to avoid the middleware redirecting back to login
        setTimeout(() => {
          router.push('/dashboard');
        }, 100);
      } else {
        toast.error(result.message || 'Registration failed');
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
      title="Create Account"
      subtitle="Register for a 30-day free trial. No Credit Card required."
      titleIcon="✍️"
    >
      <Form {...form}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <TextField
            control={control}
            name="companyName"
            label="Company Name"
            placeholder="Company Name"
            required
            disabled={isLoading}
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextField
              control={control}
              name="firstName"
              label="First Name"
              placeholder="First Name"
              required
              disabled={isLoading}
            />
            
            <TextField
              control={control}
              name="lastName"
              label="Last Name"
              placeholder="Last Name"
              required
              disabled={isLoading}
            />
          </div>
          
          <TextField
            control={control}
            name="email"
            label="Email"
            placeholder="email@example.com"
            type="email"
            required
            disabled={isLoading}
          />
          
          <TextField
            control={control}
            name="password"
            label="Password"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />
          
          <TextField
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="••••••••"
            type="password"
            required
            disabled={isLoading}
          />
          
          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? 'Registering...' : 'Register'}
          </Button>
          
          <div className="text-center text-sm text-gray-500">
            Already have an account?{' '}
            <Link href="/login" className="text-black hover:underline">
              Login here
            </Link>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
