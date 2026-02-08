// Better Auth service integration
import { authClient } from '@/src/auth/better-auth';
import { setToken, setSession, clearAuthSession, getSession } from '@/src/auth/auth-utils';

export { authClient };

async function fetchAndStoreJWT(): Promise<string | null> {
  try {
    // Fetch JWT from our custom endpoint (uses session cookie)
    const response = await fetch('/api/auth/jwt', {
      credentials: 'include',
    });
    if (response.ok) {
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        return data.token;
      }
    }
  } catch (error) {
    console.error('Failed to fetch JWT token:', error);
  }
  return null;
}

export class AuthService {
  static async login(credentials: { email: string; password: string }) {
    try {
      const result = await authClient.signIn.email(credentials);

      if (result.error) {
        throw new Error(result.error.message || 'Login failed');
      }

      if (result.data) {
        // Fetch JWT token for backend API calls
        const jwtToken = await fetchAndStoreJWT();
        setSession({
          user: result.data.user,
          token: jwtToken || result.data.token,
        });
      }

      return result;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    }
  }

  static async register(userData: { email: string; password: string }) {
    try {
      const result = await authClient.signUp.email({
        email: userData.email,
        password: userData.password,
        name: userData.email.split('@')[0],
      });

      if (result.error) {
        throw new Error(result.error.message || 'Registration failed');
      }

      if (result.data) {
        // Fetch JWT token for backend API calls
        const jwtToken = await fetchAndStoreJWT();
        setSession({
          user: result.data.user,
          token: jwtToken || result.data.token,
        });
      }

      return result;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    }
  }

  static async forgotPassword(email: string) {
    const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseURL}/api/auth/forget-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, redirectTo: '/reset-password' }),
    });
    if (!response.ok) {
      throw new Error('Failed to send password reset email');
    }
    return response.json();
  }

  static async resetPassword(token: string, newPassword: string) {
    const baseURL = process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:3000";
    const response = await fetch(`${baseURL}/api/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token, newPassword }),
    });
    if (!response.ok) {
      throw new Error('Failed to reset password');
    }
    return response.json();
  }

  static async logout() {
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      clearAuthSession();
    }
  }

  static getCurrentSession() {
    return getSession();
  }

  static async isAuthenticated(): Promise<boolean> {
    const session = this.getCurrentSession();
    return !!session?.user;
  }
}
