package com.LMS.LMS.Reppo;



import org.springframework.data.jpa.repository.JpaRepository;
import com.LMS.LMS.Model.Repayment;

import java.util.List;

public interface RepaymentRepository extends JpaRepository<Repayment, Integer> {
    List<Repayment> findByLoanId(int loanId);
}
