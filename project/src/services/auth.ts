import axios from "axios";
import api from "../lib/api"; // this has baseURL = http://localhost:8081/api/lms

/** === Backend shape from /api/lms/profile === */
export type RawProfile = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  accountVerified: boolean;
  bankAccountNumber?: string | null;
};

/** === App shape used by the UI === */
export type AppUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "admin" | "customer";
  accountVerified: boolean;
  bankAccountNumber?: string;
};

/** Map backend profile -> UI user */
function mapProfile(p: RawProfile): AppUser {
  return {
    id: String(p.id),
    fullName: p.fullName,
    username: p.username,
    email: p.email,
    role: p.role === "ROLE_ADMIN" ? "admin" : "customer",
    accountVerified: !!p.accountVerified,
    bankAccountNumber: p.bankAccountNumber ?? undefined,
  };
}

/** Root URL for login/reset/register (no /api/lms prefix!) */
const AUTH_BASE = "http://localhost:8081";

/** === LOGIN === */
export async function login(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; message?: string }> {
  try {
    const { data, headers } = await axios.post(`${AUTH_BASE}/login`, {
      username,
      password,
    });

    const token = headers?.authorization?.startsWith("Bearer ")
      ? headers.authorization.substring(7)
      : data?.token ||
        data?.jwt ||
        data?.accessToken ||
        (typeof data === "string" ? data : undefined);

    if (!token) throw new Error("No token returned");

    localStorage.setItem("token", token);

    // Now fetch profile using token
    const { data: profile } = await api.get<RawProfile>("/profile");
    const user = mapProfile(profile);
    localStorage.setItem("auth_user", JSON.stringify(user));

    return { ok: true };
  } catch (e: any) {
    const status = e?.response?.status;
    const message =
      status === 401 || status === 403 ? "Invalid credentials" : "Login failed";
    return { ok: false, message };
  }
}

/** === REGISTER === */
export async function register(payload: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}) {
  await axios.post(`${AUTH_BASE}/register`, payload);
  return { ok: true as const };
}

/** === FORGOT PASSWORD === */
export async function forgotPassword(email: string) {
  return axios.post(`${AUTH_BASE}/forgotPassword`, { email });
}

/** === RESET PASSWORD === */
export async function resetPassword(token: string, newPassword: string) {
  return axios.post(`${AUTH_BASE}/resetPassword`, {
    token,
    newPassword,
  });
}

/** === CHANGE PASSWORD (JWT protected) === */
export async function updatePassword(oldPassword: string, newPassword: string) {
  return api.put("/updatePassword", { oldPassword, newPassword });
}

/** === Load current user from backend === */
export async function loadMe(): Promise<AppUser | null> {
  try {
    const { data } = await api.get<RawProfile>("/profile");
    const user = mapProfile(data);
    localStorage.setItem("auth_user", JSON.stringify(user));
    return user;
  } catch {
    return null;
  }
}

/** === Logout === */
export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("auth_user");
}

/** === Read local user from localStorage === */
export function getStoredUser(): AppUser | null {
  const raw = localStorage.getItem("auth_user");
  return raw ? (JSON.parse(raw) as AppUser) : null;
}
