import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// API base URL
const API_BASE_URL = 'http://localhost:9000/';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Types
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  jwtToken?: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  companyName: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

// Add request interceptor to include auth token for protected routes
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// API service functions
export const apiService = {
  // Auth endpoints
  login: async (payload: LoginPayload): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('login', payload);
      if (response.data.jwtToken) {
        // Store token in localStorage for API requests
        localStorage.setItem('authToken', response.data.jwtToken);
        
        // Store token in cookies for middleware
        document.cookie = `authToken=${response.data.jwtToken}; path=/; max-age=86400; SameSite=Strict`;
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Login failed',
      };
    }
  },

  register: async (payload: RegisterPayload): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('register-company', payload);
      if (response.data.jwtToken) {
        // Store token in localStorage for API requests
        localStorage.setItem('authToken', response.data.jwtToken);
        
        // Store token in cookies for middleware
        document.cookie = `authToken=${response.data.jwtToken}; path=/; max-age=86400; SameSite=Strict`;
      }
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Registration failed',
      };
    }
  },

  getUser: async (): Promise<ApiResponse> => {
    try {
      const response = await api.get<ApiResponse>('get-user');
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Failed to fetch user data',
      };
    }
  },

  // Generic request function for other API calls
  request: async <T>(config: AxiosRequestConfig): Promise<T> => {
    const response = await api(config);
    return response.data;
  },
  
  // Generic POST method
  post: async <T>(url: string, data: any): Promise<ApiResponse<T>> => {
    try {
      const response = await api.post<ApiResponse<T>>(url, data);
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<T>>;
      return {
        success: false,
        message: axiosError.response?.data?.message || 'Request failed',
      };
    }
  },

  // Logout function to clear token
  logout: (): void => {
    localStorage.removeItem('authToken');
    document.cookie = 'authToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
  },
};
