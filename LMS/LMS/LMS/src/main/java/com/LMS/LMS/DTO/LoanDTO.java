package com.LMS.LMS.DTO;

import java.math.BigDecimal;
import java.util.Date;

public class LoanDTO {
    private int id;
    private String accountNumber;
    private String totalLoan;
    private String remainingAmount;
    private String loanDate;
    private String dueDate;
    private Integer termMonths;
    private String emiAmount;

    public LoanDTO() {}

    public LoanDTO(int id, String accountNumber,
                   BigDecimal totalLoan, BigDecimal remainingAmount,
                   Date loanDate, Date dueDate,
                   Integer termMonths, BigDecimal emiAmount) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.totalLoan = totalLoan != null ? totalLoan.toString() : null;
        this.remainingAmount = remainingAmount != null ? remainingAmount.toString() : null;
        this.loanDate = loanDate != null ? loanDate.toString() : null;
        this.dueDate = dueDate != null ? dueDate.toString() : null;
        this.termMonths = termMonths;
        this.emiAmount = emiAmount != null ? emiAmount.toString() : null;
    }

    // --- Getters and Setters ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getTotalLoan() { return totalLoan; }
    public void setTotalLoan(String totalLoan) { this.totalLoan = totalLoan; }

    public String getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(String remainingAmount) { this.remainingAmount = remainingAmount; }

    public String getLoanDate() { return loanDate; }
    public void setLoanDate(String loanDate) { this.loanDate = loanDate; }

    public String getDueDate() { return dueDate; }
    public void setDueDate(String dueDate) { this.dueDate = dueDate; }

    public Integer getTermMonths() { return termMonths; }
    public void setTermMonths(Integer termMonths) { this.termMonths = termMonths; }

    public String getEmiAmount() { return emiAmount; }
    public void setEmiAmount(String emiAmount) { this.emiAmount = emiAmount; }
}
