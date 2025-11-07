import api from "../lib/api"; 
import publicApi from "../lib/publicApi"; 

export type RawProfile = {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: "ROLE_ADMIN" | "ROLE_USER";
  accountVerified: boolean;
  bankAccountNumber?: string | null;
};

export type AppUser = {
  id: string;
  fullName: string;
  username: string;
  email: string;
  role: "admin" | "customer";
  accountVerified: boolean;
  bankAccountNumber?: string;
};

/** === Map backend profile -> UI shape === */
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

export async function login(
  username: string,
  password: string
): Promise<{ ok: true } | { ok: false; message?: string }> {
  try {
    const { data, headers } = await publicApi.post("/login", {
      username,
      password,
    });

    const bearer = headers?.authorization ?? headers?.Authorization;
    const tokenFromHeader =
      typeof bearer === "string" && bearer.startsWith("Bearer ")
        ? bearer.slice(7)
        : undefined;

    const tokenFromBody =
      (data?.token as string) ||
      (data?.jwt as string) ||
      (data?.accessToken as string) ||
      (typeof data === "string" ? data : undefined);

    const token = tokenFromHeader ?? tokenFromBody;
    if (!token) throw new Error("No token returned");

    localStorage.setItem("token", token);

    // Now fetch profile using the JWT (via api interceptor)
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

export async function register(payload: {
  fullName: string;
  username: string;
  email: string;
  password: string;
}) {
  await publicApi.post("/register", payload);
  return { ok: true as const };
}

export async function forgotPassword(email: string) {
  return publicApi.post("/forgotPassword", { email });
}

export async function resetPassword(token: string, newPassword: string) {
  return publicApi.post("/resetPassword", { token, newPassword });
}


export async function updatePassword(oldPassword: string, newPassword: string) {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("Not authenticated");

  return publicApi.put(
    "/updatePassword",
    { oldPassword, newPassword },
    { headers: { Authorization: `Bearer ${token}` } }
  );
}

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

export function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("auth_user");
}

export function getStoredUser(): AppUser | null {
  const raw = localStorage.getItem("auth_user");
  return raw ? (JSON.parse(raw) as AppUser) : null;
}

