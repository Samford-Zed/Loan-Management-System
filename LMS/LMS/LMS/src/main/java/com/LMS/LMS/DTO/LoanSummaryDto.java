package com.LMS.LMS.DTO;

import java.math.BigDecimal;

public class LoanSummaryDto {
    private BigDecimal loanPaid;
    private BigDecimal loanRemaining;
    private BigDecimal totalLoan;

    // getters & setters
    public BigDecimal getLoanPaid() { return loanPaid; }
    public void setLoanPaid(BigDecimal loanPaid) { this.loanPaid = loanPaid; }
    public BigDecimal getLoanRemaining() { return loanRemaining; }
    public void setLoanRemaining(BigDecimal loanRemaining) { this.loanRemaining = loanRemaining; }
    public BigDecimal getTotalLoan() { return totalLoan; }
    public void setTotalLoan(BigDecimal totalLoan) { this.totalLoan = totalLoan; }
}


