package com.LMS.LMS.Reppo;

import com.LMS.LMS.Model.LoanApplication;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface LoanApplicationRepository extends JpaRepository<LoanApplication, Integer> {

    // Existing methods
    List<LoanApplication> findByStatus(String status);
    List<LoanApplication> findByAccountAccountNumber(String accountNumber);

    // Add countByStatus for admin dashboard
    @Query("SELECT COUNT(l.id) FROM LoanApplication l WHERE l.status = :status")
    long countByStatus(String status);
}