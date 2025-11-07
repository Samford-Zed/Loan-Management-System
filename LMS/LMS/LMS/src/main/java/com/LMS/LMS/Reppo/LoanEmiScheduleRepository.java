package com.LMS.LMS.Reppo;

import com.LMS.LMS.Model.LoanEmiSchedule;
import com.LMS.LMS.Model.Loan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LoanEmiScheduleRepository extends JpaRepository<LoanEmiSchedule, Integer> {
	List<LoanEmiSchedule> findByLoanOrderByInstallmentNumberAsc(Loan loan);
}
