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
import { loginSchema } from '../../lib/validations';
import { useAuth } from '../../lib/authContext';

type LoginFormValues = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { login } = useAuth();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  
  const { handleSubmit, control } = form;
  
  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      console.log('Attempting login with:', { email: data.email });
      
      const result = await login(data.email, data.password);
      console.log('Login result:', result);
      
      if (result.success) {
        toast.success(result.message || 'Login successful');
        
        // Add a small delay to ensure the token is properly set in cookies
        // before redirecting to avoid the middleware redirecting back to login
        setTimeout(() => {
          console.log('Redirecting to gri/compliance-hub after successful login');
          router.push('/gri/compliance-hub');
        }, 500); // Increased delay to ensure token is set
      } else {
        console.error('Login failed:', result.message);
        toast.error(result.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <AuthLayout 
      title="Login"
      subtitle="Welcome back, please login to your account"
      titleIcon="👋"
    >
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
          
          <TextField
            control={control}
            name="password"
            label="Password"
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
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
          
          <div className="flex justify-between items-center text-sm">
            <Link href="/forgot-password" className="text-black hover:underline">
              Forgot Password?
            </Link>
            <div className="text-gray-500">
              Don't you have an account?{' '}
              <Link href="/register" className="text-black hover:underline">
                Create an account
              </Link>
            </div>
          </div>
        </form>
      </Form>
    </AuthLayout>
  );
}
