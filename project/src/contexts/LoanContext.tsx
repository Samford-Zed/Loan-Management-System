import React, { createContext, useContext, useEffect, useState } from "react";

export interface LoanApplication {
  id: string;
  customerId: string;
  customerName: string;
  accountNumber: string;
  purpose: string;
  amount: number;
  duration: number;
  emi: number;
  interestRate: number;
  status: "pending" | "approved" | "rejected";
  appliedDate: string;
  reason?: string;
}

export interface Repayment {
  id: string;
  loanId: string;
  customerId: string;
  accountNumber: string;
  amount: number;
  paidAt: string;
}

interface LoanContextType {
  applications: LoanApplication[];
  repayments: Repayment[];

  addApplication: (
    application: Omit<LoanApplication, "id" | "status" | "appliedDate">
  ) => void;
  updateApplicationStatus: (
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) => void;

  addRepayment: (
    loanId: string,
    customerId: string,
    accountNumber: string,
    amount: number
  ) => void;
  getCustomerApplications: (customerId: string) => LoanApplication[];
  getCustomerRepayments: (customerId: string) => Repayment[];
}

const LoanContext = createContext<LoanContextType | undefined>(undefined);

export const useLoan = () => {
  const ctx = useContext(LoanContext);
  if (!ctx) throw new Error("useLoan must be used within a LoanProvider");
  return ctx;
};

const APPS_KEY = "loanApplications";
const REPAID_KEY = "loanRepayments";

// Seed data
const SEED: LoanApplication[] = [
  {
    id: "la-1",
    customerId: "u-john",
    customerName: "John Doe",
    accountNumber: "1234567890123456",
    purpose: "Personal",
    amount: 5000,
    duration: 12,
    interestRate: 12,
    emi: 445,
    status: "approved",
    appliedDate: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30).toISOString(),
  },
  {
    id: "la-2",
    customerId: "u-john",
    customerName: "John Doe",
    accountNumber: "1234567890123456",
    purpose: "Car",
    amount: 12000,
    duration: 24,
    interestRate: 11,
    emi: 558,
    status: "pending",
    appliedDate: new Date().toISOString(),
  },
];

export const LoanProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [applications, setApplications] = useState<LoanApplication[]>([]);
  const [repayments, setRepayments] = useState<Repayment[]>([]);

  // hydrate
  useEffect(() => {
    const rawA = localStorage.getItem(APPS_KEY);
    setApplications(rawA ? JSON.parse(rawA) : SEED);

    const rawR = localStorage.getItem(REPAID_KEY);
    setRepayments(rawR ? JSON.parse(rawR) : []);
  }, []);

  // persist
  useEffect(() => {
    localStorage.setItem(APPS_KEY, JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem(REPAID_KEY, JSON.stringify(repayments));
  }, [repayments]);

  // auto-approve new applications so Repay shows right away
  const addApplication = (
    data: Omit<LoanApplication, "id" | "status" | "appliedDate">
  ) => {
    const newApp: LoanApplication = {
      ...data,
      id: `la-${Date.now()}`,
      status: "approved",
      appliedDate: new Date().toISOString(),
    };
    setApplications((prev) => [newApp, ...prev]);
  };

  const updateApplicationStatus = (
    id: string,
    status: "approved" | "rejected",
    reason?: string
  ) => {
    setApplications((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status, reason } : a))
    );
  };

  const addRepayment = (
    loanId: string,
    customerId: string,
    accountNumber: string,
    amount: number
  ) => {
    const rec: Repayment = {
      id: `rp-${Date.now()}`,
      loanId,
      customerId,
      accountNumber,
      amount,
      paidAt: new Date().toISOString(),
    };
    setRepayments((prev) => [rec, ...prev]);
  };

  const getCustomerApplications = (customerId: string) =>
    applications.filter((a) => a.customerId === customerId);

  const getCustomerRepayments = (customerId: string) =>
    repayments.filter((r) => r.customerId === customerId);

  return (
    <LoanContext.Provider
      value={{
        applications,
        repayments,
        addApplication,
        updateApplicationStatus,
        addRepayment,
        getCustomerApplications,
        getCustomerRepayments,
      }}
    >
      {children}
    </LoanContext.Provider>
  );
};
