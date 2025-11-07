package com.LMS.LMS.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
public class LoanApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private Users user;

    @ManyToOne
    @JoinColumn(name = "account_id")
    private BankAccount account;

    private BigDecimal loanAmount;
    private String purpose;
    private int termMonths;
    private String status; // PENDING / APPROVED / REJECTED

    private BigDecimal emiPerMonth;
    private BigDecimal totalEmi;

    public LoanApplication() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Users getUser() { return user; }
    public void setUser(Users user) { this.user = user; }

    public BankAccount getAccount() { return account; }
    public void setAccount(BankAccount account) { this.account = account; }

    public BigDecimal getLoanAmount() { return loanAmount; }
    public void setLoanAmount(BigDecimal loanAmount) { this.loanAmount = loanAmount; }

    public String getPurpose() { return purpose; }
    public void setPurpose(String purpose) { this.purpose = purpose; }

    public int getTermMonths() { return termMonths; }
    public void setTermMonths(int termMonths) { this.termMonths = termMonths; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public BigDecimal getEmiPerMonth() { return emiPerMonth; }
    public void setEmiPerMonth(BigDecimal emiPerMonth) { this.emiPerMonth = emiPerMonth; }

    public BigDecimal getTotalEmi() { return totalEmi; }
    public void setTotalEmi(BigDecimal totalEmi) { this.totalEmi = totalEmi; }
}
