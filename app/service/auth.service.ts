import axios from 'axios';
import { log } from 'console';
import { z } from 'zod';
import { th } from 'zod/locales';

// Perbaikan 1: Gunakan z.string().email()
export const LoginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});

export const RegisterSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter")
});

export type LoginRequest = z.infer<typeof LoginSchema>;
export type RegisterRequest = z.infer<typeof RegisterSchema>;

export interface AuthResponse {
  message: string;
  data?: {
    token?: string; 
    user?: User;
    admin?: any;
  };
}

export interface User {
  id: string | number; 
  email: string;
  name: string;
}

export interface LoginResponse {
  message: string;
  data?: {
    token: string;
    user: User;
  };
}

export interface Admin {
    id: string | number;
    email: string;
    name: string;
    role: string;
}

export interface LoginAdminResponse {
    message: string;
    data?: {
        token: string;
        admin: Admin;
    };
}

const API_URL = '/api/auth/login'; 
const ADMIN_API_URL = '/api/auth/login-admin';
const API_URL_REGISTER = '/api/auth/register';

// --- HELPER FUNCTIONS ---

const handleAuthError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    console.log("error axios");
    
    const errorMessage = error.response?.data?.message || 'Terjadi kesalahan pada server';
    throw new Error(errorMessage);
  }
  
  if (error instanceof z.ZodError) {
    console.log("error zod");
    console.log(error.issues[0].message);
    
    throw new Error(error.issues[0].message);
  }

  throw new Error('Terjadi kesalahan yang tidak terduga');
};

const executeAuthRequest = async <T extends LoginResponse | LoginAdminResponse>(
  url: string, 
  credentials: LoginRequest
): Promise<T> => {
  try {
    LoginSchema.parse(credentials);

    const response = await axios.post<T>(url, credentials);
    
    if (response.data.data?.token) {
      localStorage.setItem('token_faqpajak', response.data.data.token);
    }

    return response.data;
  } catch (error) {
    handleAuthError(error);

    throw error; 
  }
};

export const authService = {
  
  login: (credentials: LoginRequest): Promise<LoginResponse> => {
    return executeAuthRequest<LoginResponse>(API_URL, credentials);
  },

  loginAdmin: (credentials: LoginRequest): Promise<LoginAdminResponse> => {
    return executeAuthRequest<LoginAdminResponse>(ADMIN_API_URL, credentials);
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    try {
      RegisterSchema.parse(data);
      const response = await axios.post<AuthResponse>(API_URL_REGISTER, data);
      return response.data;
    } catch (error) {
      handleAuthError(error);
      throw error;
    }
  },

  logout: () => {
    localStorage.removeItem('token_faqpajak');
    // Opsional: window.location.href = '/login';
  }
};