/**
 * Authentication-related type definitions
 */

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface AuthToken {
  token: string;
  type: 'Bearer';
  expiresAt: number; // Unix timestamp
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  name: string;
}

export interface AuthResponse {
  user: User;
  tokens: {
    access: AuthToken;
    refresh?: AuthToken;
  };
}

export interface SessionData {
  user: User;
  accessToken: string;
  refreshToken?: string;
  expiresAt: number; // Unix timestamp
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => Promise<void>;
  signUp: (userData: RegisterCredentials) => Promise<void>;
  error: string | null;
}