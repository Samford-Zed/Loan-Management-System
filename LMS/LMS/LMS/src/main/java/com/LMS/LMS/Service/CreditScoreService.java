package com.LMS.LMS.Service;

import com.LMS.LMS.Model.CreditScore;
import com.LMS.LMS.Model.Users;
import com.LMS.LMS.Reppo.CreditScoreRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Date;

@Service
public class CreditScoreService {

    @Autowired
    private CreditScoreRepository creditScoreRepo;

    public CreditScore getOrCreateCreditScore(Users user) {
        return creditScoreRepo.findByUser(user).orElseGet(() -> {
            CreditScore cs = new CreditScore(user);
            return creditScoreRepo.save(cs);
        });
    }

    public void updateScore(Users user, int delta) {
        CreditScore cs = getOrCreateCreditScore(user);

        int newScore = Math.max(300, Math.min(900, cs.getScore() + delta));
        cs.setScore(newScore);
        cs.setLastUpdated(new Date());

        creditScoreRepo.save(cs);
    }
}
