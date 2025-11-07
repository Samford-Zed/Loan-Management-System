package com.BMS.BMS.Service;

import com.BMS.BMS.DTO.LoanSummaryDTO;

import com.BMS.BMS.Models.*;
import com.BMS.BMS.Reppo.*;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import java.util.Optional;


@Service
public class BankService {
	
	@Autowired
	private MailService mailService;

    private final CustomerRepository customerRepository;
    private final BankFundRepository bankFundRepository;
    private final MicroDepositRepository microDepositRepository;
    private final TransactionRepository transactionRepository;

    public BankService(CustomerRepository customerRepository,
                       BankFundRepository bankFundRepository,
                       MicroDepositRepository microDepositRepository,
                       TransactionRepository transactionRepository) {
        this.customerRepository = customerRepository;
        this.bankFundRepository = bankFundRepository;
        this.microDepositRepository = microDepositRepository;
        this.transactionRepository = transactionRepository;
    }

    public String sendMicroDeposit(String accountNumber) {
        Optional<Customer> customerOpt = customerRepository.findByAccountNumber(accountNumber);
        if (customerOpt.isEmpty()) return "Account not found";

        Customer customer = customerOpt.get();
        BigDecimal microDepositAmount = BigDecimal.valueOf(0.50);

        // Deduct from BankFund
        BankFund bankFund = getBankFund();
        if (bankFund.getFundForLoan().compareTo(microDepositAmount) < 0) {
            return "Insufficient bank funds for micro deposit";
        }
        bankFund.setFundForLoan(bankFund.getFundForLoan().subtract(microDepositAmount));
        bankFundRepository.save(bankFund);

        // Save micro deposit record
        MicroDeposit microDeposit = new MicroDeposit(microDepositAmount, "PENDING_VERIFICATION", customer);
        microDepositRepository.save(microDeposit);

        // Save transaction
        Transaction tx = new Transaction(microDepositAmount, "MICRO_DEPOSIT", LocalDateTime.now(), customer);
        transactionRepository.save(tx);

        // ✅ Send email to customer
        try {
            String subject = "💰 Micro Deposit Sent to Your Account";
            String text = "Hello " + customer.getName() + ",\n\n" +
                          "A micro deposit of $" + microDepositAmount + " has been sent to your account (" +
                          accountNumber + ").\n" +
                          "Please check your bank account and verify the amount.\n\n" +
                          "Thank you!";
            mailService.sendSimpleEmail(customer.getEmail(), subject, text);
        } catch (Exception e) {
            e.printStackTrace(); 
        }

        return "A micro deposit has been sent to your account " + accountNumber + 
        	       ". You can check your email to verify your account, or visit the bank to view the transaction and complete verification.";

    }

    public String confirmMicroDeposit(String accountNumber, BigDecimal depositAmount) {
        Optional<Customer> customerOpt = customerRepository.findByAccountNumber(accountNumber);
        if (customerOpt.isEmpty()) return "Account not found";

        Customer customer = customerOpt.get();
        Optional<MicroDeposit> latestDepositOpt = microDepositRepository.findTopByCustomerOrderByIdDesc(customer);

        if (latestDepositOpt.isEmpty()) return "No micro deposit found.";
        MicroDeposit latestDeposit = latestDepositOpt.get();

        if (latestDeposit.getAmount().compareTo(depositAmount) == 0) {
            latestDeposit.setStatus("VERIFIED");
            microDepositRepository.save(latestDeposit);
            return "Account verified successfully.";
        }
        return "Micro deposit amount does not match.";
    }

    public String disburseLoan(String accountNumber, BigDecimal loanAmount) {
        Optional<Customer> customerOpt = customerRepository.findByAccountNumber(accountNumber);
        if (customerOpt.isEmpty()) return "Account not found";

        Customer customer = customerOpt.get();

        // ✅ Check if the microdeposit status is VERIFIED
        Optional<MicroDeposit> latestDepositOpt = microDepositRepository.findTopByCustomerOrderByIdDesc(customer);
        if (latestDepositOpt.isEmpty() || !"VERIFIED".equalsIgnoreCase(latestDepositOpt.get().getStatus())) {
            return "Account is not verified for loan disbursement.";
        }

        // ✅ Check if customer has fully repaid previous loan
        if (customer.getLoanRemaining().compareTo(BigDecimal.ZERO) > 0) {
            return "Cannot take a new loan until previous loan is fully repaid.";
        }

        BankFund bankFund = getBankFund();

        if (bankFund.getFundForLoan().compareTo(loanAmount) < 0) {
            return "Insufficient bank funds";
        }

        // Deduct from BankFund
        bankFund.setFundForLoan(bankFund.getFundForLoan().subtract(loanAmount));
        bankFundRepository.save(bankFund);

        // Update customer loan details
        customer.setAmount(customer.getAmount().add(loanAmount));           // money in account increases
        customer.setLoanRemaining(customer.getLoanRemaining().add(loanAmount)); // how much needs to be paid
        customer.setTotalLoan(customer.getTotalLoan().add(loanAmount));     // total loan ever
        customerRepository.save(customer);

        // Save transaction
        Transaction tx = new Transaction(loanAmount, "LOAN_DISBURSE", LocalDateTime.now(), customer);
        transactionRepository.save(tx);

        return "Loan of $" + loanAmount + " disbursed to account: " + accountNumber;
    }


    public String repayLoan(String accountNumber, BigDecimal repaymentAmount) {
        Optional<Customer> customerOpt = customerRepository.findByAccountNumber(accountNumber);
        if (customerOpt.isEmpty()) return "Account not found";

        Customer customer = customerOpt.get();
        BankFund bankFund = getBankFund();

        // Determine actual repayment amount
        BigDecimal maxRepayable = customer.getLoanRemaining().min(customer.getAmount());
        BigDecimal actualRepayment = repaymentAmount.min(maxRepayable);

        if (actualRepayment.compareTo(BigDecimal.ZERO) <= 0) {
            return "No repayment possible: either no loan remaining or insufficient balance.";
        }

        // Deduct from customer's balance
        customer.setAmount(customer.getAmount().subtract(actualRepayment));
        // Update loan details
        customer.setLoanRemaining(customer.getLoanRemaining().subtract(actualRepayment));
        customer.setLoanPaid(customer.getLoanPaid().add(actualRepayment));
        customerRepository.save(customer);

        // Add to BankFund
        bankFund.setFundForLoan(bankFund.getFundForLoan().add(actualRepayment));
        bankFundRepository.save(bankFund);

        // Save transaction
        Transaction tx = new Transaction(actualRepayment, "LOAN_REPAYMENT", LocalDateTime.now(), customer);
        transactionRepository.save(tx);

        return "Repayment of $" + actualRepayment + " received from account: " + accountNumber;
    }


    private BankFund getBankFund() {
        return bankFundRepository.findAll().stream()
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Bank fund record missing"));
    }
    
    public LoanSummaryDTO getLoanSummary(String accountNumber) {
        Optional<Customer> customerOpt = customerRepository.findByAccountNumber(accountNumber);
        if (customerOpt.isEmpty()) {
            throw new RuntimeException("Account not found");
        }

        Customer customer = customerOpt.get();
        return new LoanSummaryDTO(
                customer.getLoanPaid(),
                customer.getLoanRemaining(),
                customer.getTotalLoan()
        );
    }
}

