package com.LMS.LMS.DTO;

import java.math.BigDecimal;

public class LoanAppDto {
    private int id;
    private String accountNumber;
    private String loanAmount;
    private String purpose;
    private int termMonths;
    private String status;
    private String emiPerMonth;
    private String totalEmi;

    public LoanAppDto() {}

    public LoanAppDto(int id, String accountNumber,
                              BigDecimal loanAmount, String purpose, int termMonths,
                              String status, BigDecimal emiPerMonth, BigDecimal totalEmi) {
        this.id = id;
        this.accountNumber = accountNumber;
        this.loanAmount = loanAmount != null ? loanAmount.toString() : null;
        this.purpose = purpose;
        this.termMonths = termMonths;
        this.status = status;
        this.emiPerMonth = emiPerMonth != null ? emiPerMonth.toString() : null;
        this.totalEmi = totalEmi != null ? totalEmi.toString() : null;
    }

    // --- Getters and Setters ---
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getLoanAmount() { return loanAmount; }
    public void setLoanAmount(String loanAmount) { this.loanAmount = loanAmount; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getTermMonths() { return termMonths; }
    public void setTermMonths(int termMonths) { this.termMonths = termMonths; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getEmiPerMonth() { return emiPerMonth; }
    public void setEmiPerMonth(String emiPerMonth) { this.emiPerMonth = emiPerMonth; }

    public String getTotalEmi() { return totalEmi; }
    public void setTotalEmi(String totalEmi) { this.totalEmi = totalEmi; }
}
