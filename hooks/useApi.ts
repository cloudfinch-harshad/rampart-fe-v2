'use client';

import { useQuery, useMutation, UseQueryOptions, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { apiService, ApiResponse } from '@/lib/api';

// Custom hook for API queries
export function useApiQuery<T = any>(
  endpoint: string,
  config?: AxiosRequestConfig,
  options?: UseQueryOptions<T, AxiosError>
) {
  return useQuery<T, AxiosError>({
    queryKey: [endpoint, config?.params],
    queryFn: async () => {
      const response = await apiService.request<T>({
        url: endpoint,
        method: 'GET',
        ...config,
      });
      return response;
    },
    ...options,
  });
}

// Custom hook for API mutations
export function useApiMutation<TData = any, TVariables = any>(
  endpoint: string,
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'POST',
  config?: AxiosRequestConfig,
  options?: UseMutationOptions<TData, AxiosError, TVariables>
) {
  return useMutation<TData, AxiosError, TVariables>({
    mutationFn: async (variables) => {
      const response = await apiService.request<TData>({
        url: endpoint,
        method,
        data: variables,
        ...config,
      });
      return response;
    },
    ...options,
  });
}

// Custom hook for login
export function useLogin() {
  return useMutation({
    mutationFn: apiService.login,
  });
}

// Custom hook for registration
export function useRegister() {
  return useMutation({
    mutationFn: apiService.register,
  });
}

// Custom hook for fetching user data
export function useUserData() {
  return useQuery({
    queryKey: ['user'],
    queryFn: apiService.getUser,
  });
}
