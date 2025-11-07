package com.BMS.BMS.Models;


import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class Customer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String accountNumber;
    private String email;
    private String name;

    private BigDecimal amount = BigDecimal.ZERO;
    private BigDecimal loanPaid = BigDecimal.ZERO;
    private BigDecimal loanRemaining = BigDecimal.ZERO;
    private BigDecimal totalLoan = BigDecimal.ZERO;

    public Customer() {}

    public Customer(String accountNumber, String email, String name) {
        this.accountNumber = accountNumber;
        this.email = email;
        this.name = name;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getAccountNumber() { return accountNumber; }
    public void setAccountNumber(String accountNumber) { this.accountNumber = accountNumber; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public BigDecimal getLoanPaid() { return loanPaid; }
    public void setLoanPaid(BigDecimal loanPaid) { this.loanPaid = loanPaid; }

    public BigDecimal getLoanRemaining() { return loanRemaining; }
    public void setLoanRemaining(BigDecimal loanRemaining) { this.loanRemaining = loanRemaining; }

    public BigDecimal getTotalLoan() { return totalLoan; }
    public void setTotalLoan(BigDecimal totalLoan) { this.totalLoan = totalLoan; }
}
