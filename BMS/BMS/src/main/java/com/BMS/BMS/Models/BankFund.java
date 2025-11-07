package com.BMS.BMS.Models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class BankFund {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal fundForLoan = BigDecimal.ZERO;

    public BankFund() {}

    public BankFund(BigDecimal fundForLoan) {
        this.fundForLoan = fundForLoan;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getFundForLoan() { return fundForLoan; }
    public void setFundForLoan(BigDecimal fundForLoan) { this.fundForLoan = fundForLoan; }
}
