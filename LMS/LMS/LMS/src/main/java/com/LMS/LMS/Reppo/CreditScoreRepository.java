package com.LMS.LMS.Reppo;



import com.LMS.LMS.Model.CreditScore;
import com.LMS.LMS.Model.Users;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface CreditScoreRepository extends JpaRepository<CreditScore, Integer> {
    Optional<CreditScore> findByUser(Users user);
}
