package com.BMS.BMS.Reppo;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.BMS.BMS.Models.Customer;
import com.BMS.BMS.Models.MicroDeposit;

public interface MicroDepositRepository extends JpaRepository<MicroDeposit, Long> {
    Optional<MicroDeposit> findTopByCustomerOrderByIdDesc(Customer customer);
}
