package com.BMS.BMS.Reppo;



import org.springframework.data.jpa.repository.JpaRepository;


import com.BMS.BMS.Models.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Long> {

	
}
