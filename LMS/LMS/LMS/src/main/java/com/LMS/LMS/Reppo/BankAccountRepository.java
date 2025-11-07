package com.LMS.LMS.Reppo;

import org.springframework.data.jpa.repository.JpaRepository;
import com.LMS.LMS.Model.BankAccount;
import com.LMS.LMS.Model.Users;

import java.util.List;
import java.util.Optional;

public interface BankAccountRepository extends JpaRepository<BankAccount, Integer> {
    // Used when confirming micro-deposit
    Optional<BankAccount> findByAccountNumber(String accountNumber);

    // To check if already VERIFIED by another user
    Optional<BankAccount> findByAccountNumberAndStatus(String accountNumber, String status);

    // To clean up fake entries after real owner verifies
    void deleteByAccountNumberAndUserIdNot(String accountNumber, int userId);

    // To check if user already has an account
    Optional<BankAccount> findByUser(Users user);

    // 🔥 New → get all accounts (fake or real) for this account number
    List<BankAccount> findAllByAccountNumber(String accountNumber);
    
    BankAccount findByUserId(int userId);
}
