import { api } from "../api/client";

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  role: "CUSTOMER" | "MERCHANT" | "ADMIN";
  merchantId?: string;
  merchant?: {
    id: string;
    storeName: string;
    slug: string;
    isApproved: boolean;
  };
}

export interface AuthResponse {
  status: string;
  token: string;
  data?: {
    user: AuthUser;
  };
}

/**
 * Authenticates a user and stores the JWT token.
 */
export async function login(data: LoginInput): Promise<AuthUser> {
  const res = await api.post<AuthResponse>("/auth/login", data);
  
  // Note: Backend returns { status: 'success', token: '...' }
  // We'll need a way to get user info if login doesn't return it
  // For now, let's assume login returns token, and we might need an /me call
  
  const { token } = res.data;
  localStorage.setItem("token", token);

  // If login doesn't return user, we fetch it
  return getCurrentUser();
}

/**
 * Registers a new customer.
 */
export async function register(data: any) {
  const res = await api.post("/auth/register", data);
  const { token } = res.data;
  if (token) localStorage.setItem("token", token);
  return res.data;
}

/**
 * Fetches the currently authenticated user's profile.
 * Note: Assumes GET /auth/me exists as per user request.
 */
export async function getCurrentUser(): Promise<AuthUser> {
  try {
    const res = await api.get("/auth/me");
    return res.data.data.user;
  } catch (error) {
    localStorage.removeItem("token");
    throw error;
  }
}

/**
 * Log out the current user by removing the token.
 */
export function logout() {
  localStorage.removeItem("token");
}
