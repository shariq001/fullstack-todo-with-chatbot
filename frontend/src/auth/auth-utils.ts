/**
 * Authentication utilities for Better Auth integration.
 * Tokens are stored in localStorage after login for use with the backend API.
 */

const TOKEN_KEY = 'auth-token';
const SESSION_KEY = 'auth-session';

/**
 * Gets the JWT token stored after login.
 */
export const getToken = async (): Promise<string | null> => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(TOKEN_KEY);
    }
    return null;
  } catch (error) {
    console.error('Error getting token:', error);
    return null;
  }
};

/**
 * Stores the JWT token after successful login.
 */
export const setToken = (token: string): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(TOKEN_KEY, token);
  }
};

/**
 * Stores the session data after successful login.
 */
export const setSession = (session: any): void => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  }
};

/**
 * Gets the stored session data.
 */
export const getSession = (): any | null => {
  try {
    if (typeof window !== 'undefined') {
      const data = localStorage.getItem(SESSION_KEY);
      return data ? JSON.parse(data) : null;
    }
    return null;
  } catch {
    return null;
  }
};

/**
 * Checks if the current user is authenticated.
 */
export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  if (!token) return false;
  return !isTokenExpired(token);
};

/**
 * Checks if a JWT token is expired.
 */
export const isTokenExpired = (token: string): boolean => {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return true;

    const base64 = parts[1].replace(/-/g, '+').replace(/_/g, '/');
    const payload = JSON.parse(atob(base64));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch {
    return true;
  }
};

/**
 * Clears all authentication data.
 */
export const clearAuthSession = (): void => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(SESSION_KEY);
  }
};
