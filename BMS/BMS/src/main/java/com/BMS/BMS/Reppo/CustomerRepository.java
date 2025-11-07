package com.BMS.BMS.Reppo;



import org.springframework.data.jpa.repository.JpaRepository;

import com.BMS.BMS.Models.Customer;

import java.util.Optional;

public interface CustomerRepository extends JpaRepository<Customer, Long> {
    Optional<Customer> findByAccountNumber(String accountNumber);
}

