// src/pages/LoanRepaymentPage.tsx
import React from "react";
import RepayLoanForm from "../components/RepayLoanForm";

const LoanRepaymentPage: React.FC = () => {
  const accountNumber = "123456789"; // Ideally, get this from user context or loan data

  return (
    <div className='max-w-md mx-auto mt-10'>
      <h2 className='text-xl font-bold mb-4'>Repay Your Loan</h2>
      <RepayLoanForm accountNumber={accountNumber} />
    </div>
  );
};

export default LoanRepaymentPage;
