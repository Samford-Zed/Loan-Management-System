// src/services/loan.ts
import api from "../lib/api";
import { repayLoan } from "../services/loan";

/** Send account number to BMS (micro-deposit initiation) */
export function sendAccountToBms(accountNumber: string) {
  // POST http://localhost:8081/api/lms/account/send
  return api.post<string>("/account/send", { accountNumber });
}

/** Confirm the micro-deposit amount */
export function confirmDeposit(
  accountNumber: string,
  microDepositAmount: number
) {
  // Controller expects strings in Map<String, String>
  return api.post<string>("/account/confirm-deposit", {
    accountNumber,
    microDepositAmount: String(microDepositAmount),
  });
}

/** Apply for a loan */
export function applyLoan(params: {
  accountNumber: string;
  loanAmount: number;
  purpose: string;
  termMonths: number;
}) {
  return api.post<string>("/loan/apply", {
    accountNumber: params.accountNumber,
    loanAmount: String(params.loanAmount),
    purpose: params.purpose,
    termMonths: String(params.termMonths),
  });
}

/** Repay a loan */
export async function repayLoan(accountNumber: string, amount: number) {
  return api.post("/loan/repay", {
    accountNumber,
    amount: String(amount),
  });
}

/** ADMIN: approve a pending loan (decision handled in backend) */
export function approveLoan(loanApplicationId: number) {
  // POST http://localhost:8081/api/lms/loan/approve?loanApplicationId=#
  return api.post<string>("/loan/approve", null, {
    params: { loanApplicationId },
  });
}

/** ADMIN: list all pending applications (with BMS summary) */
export type PendingLoanItem = {
  application: {
    id: number;
    loanAmount: number;
    purpose: string;
    status: string;
  };
  loanSummary: {
    loanPaid: number;
    loanRemaining: number;
    totalLoan: number;
  };
};

export async function getPendingLoans() {
  const { data } = await api.get<PendingLoanItem[]>("/loan/pending");
  return data;
}

/** --- Types from backend --- */
export type LoanApplicationDto = {
  id: number;
  accountNumber: string;
  loanAmount: number | string;
  purpose: string;
  termMonths: number;
  status: "PENDING" | "APPROVED" | "REJECTED" | string;
  emiPerMonth: number | string;
  totalEmi: number | string;
  appliedDate?: string;
};

export type LoanDto = {
  id: number;
  accountNumber: string;
  totalLoan: number | string;
  remainingAmount: number | string;
  loanDate: string;
  dueDate: string;
  termMonths: number;
  emiAmount: number | string;
};

/** Customer: fetch your own loan applications by account number */
export async function getMyApplications(accountNumber: string) {
  const { data } = await api.get<LoanApplicationDto[]>(
    `/applications/${encodeURIComponent(accountNumber)}`
  );
  return data;
}

/** Customer: fetch your active loans by account number */
export async function getMyActiveLoans(accountNumber: string) {
  const { data } = await api.get<LoanDto[]>(
    `/active/${encodeURIComponent(accountNumber)}`
  );
  return data;
}
