import React, { createContext, useContext, useEffect, useState } from "react";

export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  role: "admin" | "customer";
  accountVerified: boolean;
  bankAccountNumber?: string;
}

interface RegisterData {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (
    username: string,
    password: string,
    role: "admin" | "customer"
  ) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => void;
  updateUser: (data: Partial<User>) => void;
}

/** ---- Mock directory ----
 * admin / admin123    -> admin
 * john  / john123     -> customer (verified)
 * sara  / sara123     -> customer (NOT verified)
 */
const MOCK_USERS: Array<User & { password: string }> = [
  {
    id: "u-admin",
    username: "admin",
    firstName: "Admin",
    lastName: "User",
    role: "admin",
    accountVerified: true,
    bankAccountNumber: "100088777766",
    password: "admin123",
  },
  {
    id: "u-john",
    username: "john",
    firstName: "John",
    lastName: "Doe",
    role: "customer",
    accountVerified: true,
    bankAccountNumber: "1000890123456",
    password: "john123",
  },
  {
    id: "u-sara",
    username: "sara",
    firstName: "Sara",
    lastName: "Lee",
    role: "customer",
    accountVerified: false,
    bankAccountNumber: undefined,
    password: "sara123",
  },
];

const LS_KEY = "auth_user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Hydrate on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) setUser(JSON.parse(raw));
    } finally {
      setLoading(false);
    }
  }, []);

  const login = async (
    username: string,
    password: string,
    role: "admin" | "customer"
  ): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 400)); // mock latency
    const found = MOCK_USERS.find(
      (u) =>
        u.username.toLowerCase() === username.toLowerCase() &&
        u.password === password &&
        u.role === role
    );
    if (!found) return false;

    const { password: _pw, ...publicUser } = found;
    setUser(publicUser);
    localStorage.setItem(LS_KEY, JSON.stringify(publicUser));
    return true;
  };

  const register = async (_data: RegisterData): Promise<boolean> => {
    await new Promise((r) => setTimeout(r, 400));
    // keep simple for now; backend will own this later
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(LS_KEY);
  };

  const updateUser = (data: Partial<User>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...data };
      localStorage.setItem(LS_KEY, JSON.stringify(next));
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
