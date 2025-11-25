package com.BMS.BMS.Controller;

import com.BMS.BMS.DTO.LoanSummaryDTO;

import com.BMS.BMS.Service.BankService;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/bank")
public class BankController {

    private final BankService bankService;

    public BankController(BankService bankService) {
        this.bankService = bankService;
    }
    
    @GetMapping("/hello")
    public String Hello() {
    	return "hello";
    }

    @PostMapping("/verify")
    public String verifyAccount(@RequestBody Map<String, String> body) {
        return bankService.sendMicroDeposit(body.get("accountNumber"));
    }

    @PostMapping("/verify-deposit")
    public String verifyMicroDeposit(@RequestBody Map<String, String> payload) {
        return bankService.confirmMicroDeposit(
                payload.get("accountNumber"),
                new BigDecimal(payload.get("microDepositAmount"))
        );
    }

    @PostMapping("/loan")
    public String disburseLoan(@RequestBody Map<String, String> payload) {
        return bankService.disburseLoan(
                payload.get("accountNumber"),
                new BigDecimal(payload.get("loanAmount"))
        );
    }

    @PostMapping("/repay")
    public String repayLoan(@RequestBody Map<String, String> payload) {
        return bankService.repayLoan(
                payload.get("accountNumber"),
                new BigDecimal(payload.get("repaymentAmount"))
        );
    }
    
    /** ✅ Get Loan Summary (loanPaid, loanRemaining, total) */
    @GetMapping("/loan-summary/{accountNumber}")
    public LoanSummaryDTO getLoanSummary(@PathVariable String accountNumber) {
        return bankService.getLoanSummary(accountNumber);
    }
}

