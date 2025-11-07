package com.LMS.LMS.Reppo;



import org.springframework.data.jpa.repository.JpaRepository;
import com.LMS.LMS.Model.Loan;

import java.util.List;


public interface LoanRepository extends JpaRepository<Loan, Integer> {
    
    List<Loan> findByAccountAccountNumber(String accountNumber);
    List<Loan> findByUserId(int userId);
}
