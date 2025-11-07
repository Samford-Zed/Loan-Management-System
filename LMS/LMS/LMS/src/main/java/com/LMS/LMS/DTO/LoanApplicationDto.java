package com.LMS.LMS.DTO;

import java.math.BigDecimal;

public class LoanApplicationDto {
    private int id;
    private BigDecimal loanAmount;
    private String purpose;
    private String status;


    // getters & setters
    public int getId() { return id; }
    public void setId(int id) { this.id = id; }
    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }
    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

}