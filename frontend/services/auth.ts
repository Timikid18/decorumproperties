import { apiRequest } from "@/lib/api";
import { AuthResponse, User } from "@/types";

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  whatsapp?: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfilePayload {
  name: string;
  phone?: string;
  whatsapp?: string;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>(`/auth/register`, {
    method: "POST",
    body: payload,
    auth: false,
  });
  return res.data;
}

export async function login(
  email: string,
  password: string,
): Promise<AuthResponse> {
  const res = await apiRequest<{ data: AuthResponse }>(`/auth/login`, {
    method: "POST",
    body: { email, password },
    auth: false,
  });
  return res.data;
}

export async function logout(): Promise<void> {
  await apiRequest<{ data: null }>(`/auth/logout`, { method: "POST" });
}

export async function getMe(): Promise<User> {
  const res = await apiRequest<{ data: User }>(`/auth/me`);
  return res.data;
}

export async function updateProfile(payload: UpdateProfilePayload): Promise<User> {
  const res = await apiRequest<{ data: User }>(`/auth/profile`, {
    method: "PUT",
    body: payload,
  });
  return res.data;
}

export async function updateProfileWithImage(formData: FormData): Promise<User> {
  const res = await apiRequest<{ data: User }>(`/auth/profile`, {
    method: "PUT",
    body: formData,
  });
  return res.data;
}

export async function updatePassword(
  current_password: string,
  password: string,
  password_confirmation: string,
): Promise<void> {
  await apiRequest<{ data: null }>(`/auth/password`, {
    method: "PUT",
    body: { current_password, password, password_confirmation },
  });
}

export async function forgotPassword(email: string): Promise<void> {
  await apiRequest<{ data: null }>(`/auth/forgot-password`, {
    method: "POST",
    body: { email },
    auth: false,
  });
}

export async function resetPassword(
  token: string,
  email: string,
  password: string,
  password_confirmation: string,
): Promise<void> {
  await apiRequest<{ data: null }>(`/auth/reset-password`, {
    method: "POST",
    body: { token, email, password, password_confirmation },
    auth: false,
  });
}