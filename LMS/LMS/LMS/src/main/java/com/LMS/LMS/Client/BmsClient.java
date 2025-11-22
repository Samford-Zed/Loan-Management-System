package com.LMS.LMS.Client;

import org.springframework.http.*;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import com.LMS.LMS.DTO.LoanSummaryDto;
import com.LMS.LMS.Util.JwtUtil;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@Component
public class BmsClient {

    private final RestTemplate restTemplate = new RestTemplate();
    private final String baseUrl = "http://localhost:8080/api/bank";

    private HttpHeaders buildHeaders(String accountNumber) {
        String jwt = JwtUtil.generateToken(accountNumber);
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + jwt);
        return headers;
    }

    // Verify account (micro deposit initial)
    public String verifyAccount(String accountNumber) {
        Map<String, String> body = new HashMap<>();
        body.put("accountNumber", accountNumber);
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, buildHeaders(accountNumber));
        return restTemplate.postForEntity(baseUrl + "/verify", request, String.class).getBody();
    }

    // Confirm micro deposit amount
    public String confirmMicroDeposit(String accountNumber, BigDecimal amount) {
        Map<String, String> body = new HashMap<>();
        body.put("accountNumber", accountNumber);
        body.put("microDepositAmount", amount.toString());
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, buildHeaders(accountNumber));
        return restTemplate.postForEntity(baseUrl + "/verify-deposit", request, String.class).getBody();
    }

    // Disburse loan
    public String disburseLoan(String accountNumber, BigDecimal loanAmount) {
        Map<String, String> body = new HashMap<>();
        body.put("accountNumber", accountNumber);
        body.put("loanAmount", loanAmount.toString());
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, buildHeaders(accountNumber));
        return restTemplate.postForEntity(baseUrl + "/loan", request, String.class).getBody();
    }

    // Repay loan
    public String repayLoan(String accountNumber, BigDecimal repaymentAmount) {
        Map<String, String> body = new HashMap<>();
        body.put("accountNumber", accountNumber);
        body.put("repaymentAmount", repaymentAmount.toString());
        HttpEntity<Map<String, String>> request = new HttpEntity<>(body, buildHeaders(accountNumber));
        return restTemplate.postForEntity(baseUrl + "/repay", request, String.class).getBody();
    }

    // Fetch loan summary
    public LoanSummaryDto getLoanSummary(String accountNumber) {
        HttpEntity<Void> request = new HttpEntity<>(buildHeaders(accountNumber));
        ResponseEntity<LoanSummaryDto> response = restTemplate.exchange(
                baseUrl + "/loan-summary/" + accountNumber,
                HttpMethod.GET,
                request,
                LoanSummaryDto.class
        );
        return response.getBody();
    }
}

