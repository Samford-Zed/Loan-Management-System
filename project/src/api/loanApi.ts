// src/api/loanApi.ts
import api from "../lib/api";

/** ---- Backend shapes (loose, nullable-safe) ---- */
type ApiApplication = {
  id: number;
  accountNumber?: string | null;
  purpose?: string | null;
  termMonths?: number | null;
  status?: string | null; // e.g. "PENDING" | "APPROVED" | "REJECTED"
  loanAmount?: string | number | null; // BigDecimal serialized as string
  emiPerMonth?: string | number | null; // BigDecimal serialized as string
  totalEmi?: string | number | null;
  appliedDate?: string | null;
  customerName?: string | null;
  reason?: string | null;
};

type PendingItem = {
  // Shape from GET /api/lms/loan/pending (if you use it)
  application?: {
    id: number;
    loanAmount?: string | number | null;
    purpose?: string | null;
    status?: string | null;
    termMonths?: number | null;
    accountNumber?: string | null;
    emiPerMonth?: string | number | null;
    totalEmi?: string | number | null;
    appliedDate?: string | null;
    customerName?: string | null;
    reason?: string | null;
  };
  loanSummary?: unknown; // not used here
};

/** ---- UI shape ---- */
export type LoanApplication = {
  id: string;
  customerName?: string;
  accountNumber: string;
  purpose: string;
  amount: number; // parsed number
  duration: number; // months
  emi: number; // parsed number
  status: "pending" | "approved" | "rejected";
  reason?: string | null;
  appliedDate?: string | null;
};

/** ---- Helpers ---- */
const toNum = (v: string | number | null | undefined) =>
  typeof v === "number" ? v : v ? Number(v) : 0;

const toStatus = (s: unknown): LoanApplication["status"] => {
  const v = typeof s === "string" ? s.toLowerCase() : "";
  if (v === "approved") return "approved";
  if (v === "rejected") return "rejected";
  return "pending";
};

function mapApplication(a: ApiApplication): LoanApplication {
  return {
    id: String(a.id),
    customerName: a.customerName ?? undefined,
    accountNumber: a.accountNumber ?? "",
    purpose: a.purpose ?? "",
    amount: toNum(a.loanAmount),
    duration: a.termMonths ?? 0,
    emi: toNum(a.emiPerMonth),
    status: toStatus(a.status),
    reason: a.reason ?? null,
    appliedDate: a.appliedDate ?? null,
  };
}

function mapPendingItem(p: PendingItem): LoanApplication | null {
  const a = p?.application;
  if (!a) return null;
  return mapApplication({
    id: a.id,
    accountNumber: a.accountNumber ?? "",
    purpose: a.purpose ?? "",
    termMonths: a.termMonths ?? 0,
    status: a.status ?? "PENDING",
    loanAmount: a.loanAmount ?? 0,
    emiPerMonth: a.emiPerMonth ?? 0,
    totalEmi: a.totalEmi ?? 0,
    appliedDate: a.appliedDate ?? null,
    customerName: a.customerName ?? null,
    reason: a.reason ?? null,
  });
}

/** ---- Admin: fetch all applications ----
 * Tries /admin/applications first (if you added it),
 * falls back to /loan/pending (PendingLoanResponseDto mapping).
 */
export async function fetchAllApplications(): Promise<LoanApplication[]> {
  try {
    const { data } = await api.get<ApiApplication[]>("/admin/applications");
    return (data || []).map(mapApplication);
  } catch (e: any) {
    // Fallback to /loan/pending if /admin/applications doesn't exist
    if (e?.response?.status && [404, 405].includes(e.response.status)) {
      const { data } = await api.get<PendingItem[]>("/loan/pending");
      return (data || [])
        .map(mapPendingItem)
        .filter(Boolean) as LoanApplication[];
    }
    throw e;
  }
}

/** ---- Admin: approve / reject ----
 * Approve: uses POST /loan/approve?loanApplicationId=ID (backend returns a string).
 * Reject: tries PATCH /admin/applications/{id}/status, falls back to POST /loan/reject if available.
 * Returns a minimal LoanApplication so callers don't break (UI doesn't rely on it anyway).
 */
export async function updateApplicationStatus(
  id: string,
  status: "approved" | "rejected",
  reason?: string
): Promise<LoanApplication> {
  if (status === "approved") {
    await api.post("/loan/approve", null, {
      params: { loanApplicationId: id },
    });
    return {
      id,
      accountNumber: "",
      purpose: "",
      amount: 0,
      duration: 0,
      emi: 0,
      status: "approved",
      reason: null,
      appliedDate: null,
    };
  }

  // Try admin PATCH (if you created it)
  try {
    const { data } = await api.patch<ApiApplication>(
      `/admin/applications/${id}/status`,
      { status: "rejected", reason }
    );
    return mapApplication(data);
  } catch {
    // Fallback to POST /loan/reject if you have it
    try {
      await api.post("/loan/reject", null, {
        params: { loanApplicationId: id, reason },
      });
      return {
        id,
        accountNumber: "",
        purpose: "",
        amount: 0,
        duration: 0,
        emi: 0,
        status: "rejected",
        reason: reason ?? null,
        appliedDate: null,
      };
    } catch (err) {
      throw err;
    }
  }
}

/** ---- Customer: applications for own account ---- */
export async function fetchMyApplications(
  accountNumber: string
): Promise<LoanApplication[]> {
  const { data } = await api.get<ApiApplication[]>(
    `/applications/${encodeURIComponent(accountNumber)}`
  );
  return (data || []).map(mapApplication);
}

/** ---- Customer: active loans for own account ---- */
export async function fetchMyLoans(accountNumber: string): Promise<
  {
    id: string;
    accountNumber: string;
    totalLoan: number;
    remainingAmount: number;
    termMonths: number;
    emi: number;
    loanDate?: string | null;
    dueDate?: string | null;
  }[]
> {
  const { data } = await api.get<any[]>(
    `/active/${encodeURIComponent(accountNumber)}`
  );
  return (data || []).map((l) => ({
    id: String(l.id),
    accountNumber: l.accountNumber ?? "",
    totalLoan: toNum(l.totalLoan),
    remainingAmount: toNum(l.remainingAmount),
    termMonths: Number(l.termMonths ?? 0),
    emi: toNum(l.emiAmount),
    loanDate: l.loanDate ?? null,
    dueDate: l.dueDate ?? null,
  }));
}
