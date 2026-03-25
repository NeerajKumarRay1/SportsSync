import api, { tokenStore } from './api';

// ─── Types ───────────────────────────────────────────────────────────────────
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  displayName: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  displayName: string;
}

// ─── Auth service ─────────────────────────────────────────────────────────────
export const authService = {
  /**
   * POST /api/auth/login
   * Stores JWT in memory, returns the full auth payload.
   */
  async login(payload: LoginRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/login', payload);
    tokenStore.set(data.token);
    return data;
  },

  /**
   * POST /api/auth/register
   * Creates account and automatically logs in.
   */
  async register(payload: RegisterRequest): Promise<AuthResponse> {
    const { data } = await api.post<AuthResponse>('/api/auth/register', payload);
    tokenStore.set(data.token);
    return data;
  },

  /**
   * Clears the in-memory token. Optionally call POST /api/auth/logout
   * if your backend maintains a token blocklist.
   */
  async logout(): Promise<void> {
    try {
      await api.post('/api/auth/logout');
    } catch {
      // Swallow — token is cleared regardless
    } finally {
      tokenStore.clear();
    }
  },

  /** Quick check — is there a live token in memory? */
  isAuthenticated(): boolean {
    return tokenStore.get() !== null;
  },
};
