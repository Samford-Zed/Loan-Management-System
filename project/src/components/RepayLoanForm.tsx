// src/components/RepayLoanForm.tsx
import React, { useState } from "react";
import { repayLoan } from "../services/loan";

interface Props {
  accountNumber: string;
}

const RepayLoanForm: React.FC<Props> = ({ accountNumber }) => {
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await repayLoan(accountNumber, parseFloat(amount));
      setMessage("✅ Loan repayment successful");
    } catch (err: any) {
      setMessage(err?.response?.data || "❌ Repayment failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} className='space-y-4'>
      <div>
        <label className='block text-sm font-medium'>Repayment Amount</label>
        <input
          type='number'
          step='0.01'
          className='border p-2 w-full'
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <button
        type='submit'
        className='bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700'
      >
        Repay Loan
      </button>
      {message && <p className='text-sm mt-2'>{message}</p>}
    </form>
  );
};

export default RepayLoanForm;
