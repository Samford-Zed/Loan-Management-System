package com.BMS.BMS.Models;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
public class MicroDeposit {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private BigDecimal amount;
    private String status; // PENDING_VERIFICATION, VERIF

    @ManyToOne
    @JoinColumn(name = "customer_id")
    private Customer customer;

    public MicroDeposit() {}

    public MicroDeposit(BigDecimal amount, String status, Customer customer) {
        this.amount = amount;
        this.status = status;
        this.customer = customer;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public BigDecimal getAmount() { return amount; }
    public void setAmount(BigDecimal amount) { this.amount = amount; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Customer getCustomer() { return customer; }
    public void setCustomer(Customer customer) { this.customer = customer; }
}

