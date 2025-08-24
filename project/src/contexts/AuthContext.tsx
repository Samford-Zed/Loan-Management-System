// src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from "react";
import {
  login as authLogin,
  register as authRegister,
  loadMe as authLoadMe,
  logout as authLogout,
  AppUser,
} from "../services/auth";

export type Role = "admin" | "customer";

type RegisterData = {
  fullName: string;
  username: string;
  email: string;
  password: string;
};

type AuthContextType = {
  user: AppUser | null;
  loading: boolean;
  // keep role param for backward compatibility (ignored; role comes from backend)
  login: (username: string, password: string, role?: Role) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<AppUser>) => void;
};

const LS_USER = "auth_user";
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount: if we have a token, try to refresh profile from backend; else hydrate from LS
  useEffect(() => {
    const init = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          const me = await authLoadMe();
          if (me) {
            setUser(me);
            setLoading(false);
            return;
          }
        }
        // fallback to cached user if no token or loadMe failed
        const cached = localStorage.getItem(LS_USER);
        if (cached) setUser(JSON.parse(cached));
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  /** Login -> stores token -> fetch /api/lms/profile -> store user */
  const login = async (
    username: string,
    password: string,
    _role?: Role
  ): Promise<boolean> => {
    const res = await authLogin(username, password);
    if (!("ok" in res) || !res.ok) return false;

    // auth.login already fetched /api/lms/profile and stored auth_user
    const raw = localStorage.getItem(LS_USER);
    setUser(raw ? (JSON.parse(raw) as AppUser) : null);
    return true;
  };

  /** Register with fullName/username/email/password */
  const register = async (data: RegisterData): Promise<boolean> => {
    await authRegister(data);
    return true;
  };

  /** Logout: clear token + user */
  const logout = () => {
    authLogout();
    setUser(null);
  };

  /** Merge updates locally (useful after bank verification, etc.) */
  const updateUser = (partial: Partial<AppUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...partial };
      localStorage.setItem(LS_USER, JSON.stringify(next));
      return next;
    });
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};
