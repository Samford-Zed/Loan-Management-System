package com.LMS.LMS.DTO;

import java.math.BigDecimal;

public class LoanAdminResponseDto {
    private String username;
    private String accountNumber;
    private BigDecimal totalLoan;
    private BigDecimal remainingAmount;
    private BigDecimal emiAmount;
    private Integer termMonths;

    public LoanAdminResponseDto(String username, String accountNumber,
                                BigDecimal totalLoan, BigDecimal remainingAmount,
                                BigDecimal emiAmount, Integer termMonths) {
        this.username = username;
        this.accountNumber = accountNumber;
        this.totalLoan = totalLoan;
        this.remainingAmount = remainingAmount;
        this.emiAmount = emiAmount;
        this.termMonths = termMonths;
    }

    public String getUsername() { return username; }
    public String getAccountNumber() { return accountNumber; }
    public BigDecimal getTotalLoan() { return totalLoan; }
    public BigDecimal getRemainingAmount() { return remainingAmount; }
    public BigDecimal getEmiAmount() { return emiAmount; }
    public Integer getTermMonths() { return termMonths; }
}
