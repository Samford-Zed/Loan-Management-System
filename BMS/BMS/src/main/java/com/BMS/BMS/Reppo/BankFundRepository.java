package com.BMS.BMS.Reppo;


import org.springframework.data.jpa.repository.JpaRepository;

import com.BMS.BMS.Models.BankFund;

public interface BankFundRepository extends JpaRepository<BankFund, Long> {
}

