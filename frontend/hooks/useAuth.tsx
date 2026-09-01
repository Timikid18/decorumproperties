"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { getMe, login as apiLogin, logout as apiLogout, register as apiRegister } from "@/services/auth";
import type { RegisterPayload } from "@/services/auth";
import { User } from "@/types";
import { clearToken, clearStoredUser, getToken, getStoredUser, setStoredUser, setToken } from "@/lib/auth";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) setUser(stored as unknown as User);
  }, []);

  const applySession = useCallback((session: { token: string; user: User }) => {
    setToken(session.token);
    setStoredUser(session.user as unknown as Record<string, unknown>);
    setUser(session.user);
  }, []);

  const refreshUser = useCallback(async () => {
    if (!getToken()) {
      setUser(null);
      return;
    }
    try {
      const me = await getMe();
      setUser(me);
      setStoredUser(me as unknown as Record<string, unknown>);
    } catch {
      clearToken();
      clearStoredUser();
      setUser(null);
    }
  }, []);

  useEffect(() => {
    refreshUser().finally(() => setLoading(false));
  }, [refreshUser]);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await apiLogin(email, password);
      applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (payload: RegisterPayload) => {
      const session = await apiRegister(payload);
      applySession(session);
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch {
      // still clear the local session
    }
    clearToken();
    clearStoredUser();
    setUser(null);
  }, []);

  const updateUser = useCallback((next: User) => {
    setUser(next);
    setStoredUser(next as unknown as Record<string, unknown>);
  }, []);

  const isAdmin = useMemo(
    () => Boolean(user?.roles?.some((r) => ["super-admin", "admin", "staff"].includes(r))),
    [user],
  );

  const value = useMemo(
    () => ({
      user,
      loading,
      isAuthenticated: Boolean(user),
      isAdmin,
      login,
      register,
      logout,
      refreshUser,
      updateUser,
    }),
    [user, loading, isAdmin, login, register, logout, refreshUser, updateUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}