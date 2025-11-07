package com.BMS.BMS.DTO;

import java.math.BigDecimal;

public class LoanSummaryDTO {
    private BigDecimal loanPaid;
    private BigDecimal loanRemaining;
    private BigDecimal totalLoan;

    public LoanSummaryDTO(BigDecimal loanPaid, BigDecimal loanRemaining, BigDecimal totalLoan) {
        this.loanPaid = loanPaid;
        this.loanRemaining = loanRemaining;
        this.totalLoan = totalLoan;
    }

    public BigDecimal getLoanPaid() { return loanPaid; }
    public BigDecimal getLoanRemaining() { return loanRemaining; }
    public BigDecimal getTotalLoan() { return totalLoan; }
}
