package com.LMS.LMS.Model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.util.Date;

@Entity
public class Repayment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    @ManyToOne
    @JoinColumn(name = "loan_id")
    private Loan loan;

    private BigDecimal amount;
    private Date repaymentDate;
    private String status; // WAITING / PAID / FAILED

    public Repayment() {}

    public int getId() { return id; }
    public void setId(int id) { this.id = id; }

    public Loan getLoan() { return loan; }
    public void setLoan(Loan loan) { this.loan = loan; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public Date getRepaymentDate() { return repaymentDate; }
    public void setRepaymentDate(Date repaymentDate) { this.repaymentDate = repaymentDate; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
