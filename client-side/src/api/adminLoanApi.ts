import api from "../lib/api";

export type PendingApplication = {
  application: {
    id: number;
    loanAmount: number | string;
    purpose: string;
    status: "PENDING" | "APPROVED" | "REJECTED";
  };
  loanSummary: {
    loanPaid: number | string;
    loanRemaining: number | string;
    totalLoan: number | string;
  };
};

const toNum = (v: number | string) => (typeof v === "number" ? v : Number(v));

export async function fetchPendingForAdmin(): Promise<
  Array<{
    id: number;
    purpose: string;
    amount: number;
    bmsPaid: number;
    bmsRemaining: number;
    bmsTotal: number;
  }>
> {
  const { data } = await api.get<PendingApplication[]>("/loan/pending");
  return data.map((row) => ({
    id: row.application.id,
    purpose: row.application.purpose,
    amount: toNum(row.application.loanAmount),
    bmsPaid: toNum(row.loanSummary.loanPaid),
    bmsRemaining: toNum(row.loanSummary.loanRemaining),
    bmsTotal: toNum(row.loanSummary.totalLoan),
  }));
}

export async function approveApplication(
  loanApplicationId: number
): Promise<string> {
  const { data } = await api.post<string>("/loan/approve", null, {
    params: { loanApplicationId },
  });
  return typeof data === "string" ? data : "OK";
}

/** POST /loan/reject?loanApplicationId=ID   */
export async function rejectApplication(
  loanApplicationId: number
): Promise<string> {
  const { data } = await api.post<string>("/loan/reject", null, {
    params: { loanApplicationId },
  });
  return typeof data === "string" ? data : "Application rejected";
}

