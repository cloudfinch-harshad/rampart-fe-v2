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
    // Skip adding token for login and register endpoints
    if (config.url === 'login' || config.url === 'register-company') {
      return config;
    }
    
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add response interceptor to handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401 && error.config.url !== 'login') {
      // Redirect to login page if we're in a browser environment
      // Token clearing is now handled by the authContext
      if (typeof window !== 'undefined') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// API service functions
export const apiService = {
  // Auth endpoints
  login: async (payload: LoginPayload): Promise<ApiResponse> => {
    try {
      const response = await api.post<ApiResponse>('login', payload);
      // Token storage is now handled by the syncToken helper in authContext
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
      // Token storage is now handled by the syncToken helper in authContext
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

  // Logout function - token clearing is now handled by syncToken helper in authContext
  logout: (): void => {
    // This is now just a placeholder as token clearing is handled in authContext
    // Keeping this method for API consistency
  },
};
