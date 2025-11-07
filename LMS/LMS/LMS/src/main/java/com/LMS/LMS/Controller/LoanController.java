package com.LMS.LMS.Controller;

import com.LMS.LMS.DTO.LoanAdminResponseDto;
import com.LMS.LMS.DTO.LoanAppDto;
import com.LMS.LMS.DTO.LoanDTO;
import com.LMS.LMS.DTO.PendingLoanResponseDto;
import com.LMS.LMS.DTO.ProfileDto;               // ✅ add
import com.LMS.LMS.Model.BankAccount;
import com.LMS.LMS.Model.Users;
import com.LMS.LMS.Reppo.BankAccountRepository;
import com.LMS.LMS.Reppo.UserReppo;
import com.LMS.LMS.Service.JwtService;
import com.LMS.LMS.Service.LoanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jakarta.servlet.http.HttpServletRequest;
import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/lms")
public class LoanController {

    @Autowired
    private LoanService loanService;

    @Autowired
    private JwtService jwtService;

    @Autowired
    private UserReppo userReppo;

    @Autowired
    private BankAccountRepository bankAccountRepo;

    private Users getCurrentUser(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || authHeader.isEmpty()) return null;
        String token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;
        String username = jwtService.extractUsername(token);
        return userReppo.findByUsername(username);
    }

    /** ✅ NEW: Return current user's profile + bank verification info */
    /** Return the signed-in user's profile (+ bank verification info) */
    @GetMapping("/profile")
    public ResponseEntity<?> myProfile(HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid or missing token");
        }

        BankAccount account = bankAccountRepo.findByUserId(currentUser.getId());
        boolean verified = account != null && "VERIFIED".equalsIgnoreCase(account.getStatus());
        String acctNo = account != null ? account.getAccountNumber() : null;

        ProfileDto dto = new ProfileDto(
                currentUser.getId(),
                currentUser.getFullName(),    // 👈 fullName from your entity
                currentUser.getUsername(),
                currentUser.getEmail(),
                currentUser.getRole(),
                verified,
                acctNo
        );
        return ResponseEntity.ok(dto);
    }

    @PostMapping("/account/send")
    public ResponseEntity<?> sendAccountToBms(@RequestBody Map<String, String> payload,
                                              HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_USER".equals(currentUser.getRole()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only users can send accounts");

        return ResponseEntity.ok(loanService.sendAccountToBms(payload.get("accountNumber"), currentUser));
    }

    @PostMapping("/account/confirm-deposit")
    public ResponseEntity<?> confirmDeposit(@RequestBody Map<String, String> payload,
                                            HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_USER".equals(currentUser.getRole()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only users can confirm deposit");

        return loanService.confirmMicroDeposit(
                payload.get("accountNumber"),
                new BigDecimal(payload.get("microDepositAmount")),
                currentUser
        );
    }

    @PostMapping("/loan/apply")
    public ResponseEntity<?> applyLoan(@RequestBody Map<String, String> payload,
                                       HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_USER".equals(currentUser.getRole()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only users can apply for loans");

        return ResponseEntity.ok(loanService.applyLoan(
                payload.get("accountNumber"),
                new BigDecimal(payload.get("loanAmount")),
                payload.get("purpose"),
                Integer.parseInt(payload.get("termMonths")),
                currentUser
        ));
    }

    @PostMapping("/loan/repay")
    public ResponseEntity<?> repayLoan(@RequestBody Map<String, String> payload,
                                       HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_USER".equals(currentUser.getRole()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only users can repay loans");

        return loanService.repayLoan(payload.get("accountNumber"), new BigDecimal(payload.get("amount")), currentUser);
    }

    @PostMapping("/loan/approve")
    public ResponseEntity<?> approveLoan(@RequestParam int loanApplicationId,
                                         HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getRole()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only admin can approve loans");

        return ResponseEntity.ok(loanService.approveLoan(loanApplicationId));
    }
    // this is what i added the reject endpoint
    @PostMapping("/loan/reject")
    public ResponseEntity<?> rejectLoan(@RequestParam int loanApplicationId,
                                        HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ Only admin can reject loans");
        }

        return ResponseEntity.ok(loanService.rejectLoan(loanApplicationId));
    }

    /** ADMIN: view pending applications with BMS summary */
    @GetMapping("/loan/pending")
    public ResponseEntity<?> pendingApplications(HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getRole()))
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only admin can view pending loans");

        List<PendingLoanResponseDto> pending = loanService.getPendingLoansForAdmin();
        return ResponseEntity.ok(pending);
    }

    // 👉 Get Loan Applications for the logged-in user by accountNumber
    @GetMapping("/applications/{accountNumber}")
    public ResponseEntity<?> getUserLoanApplications(
            @PathVariable String accountNumber,
            HttpServletRequest request) {

        Users currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid or missing token");
        }

        // fetch user's bank account
        BankAccount account = bankAccountRepo.findByUserId(currentUser.getId());
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ No bank account found for this user");
        }

        // check if path accountNumber matches user's account
        if (!account.getAccountNumber().equals(accountNumber)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("❌ You can only access your own account data");
        }

        List<LoanAppDto> applications = loanService.getLoanApplicationsByAccountNumber(accountNumber);
        return ResponseEntity.ok(applications);
    }

    // 👉 Similarly, you can do Loans endpoint
    @GetMapping("/active/{accountNumber}")
    public ResponseEntity<?> getUserLoans(
            @PathVariable String accountNumber,
            HttpServletRequest request) {

        Users currentUser = getCurrentUser(request);
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Invalid or missing token");
        }

        // fetch user's bank account
        BankAccount account = bankAccountRepo.findByUserId(currentUser.getId());
        if (account == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("❌ No bank account found for this user");
        }

        // check if path accountNumber matches user's account
        if (!account.getAccountNumber().equals(accountNumber)) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("❌ You can only access your own account data");
        }

        List<LoanDTO> loans = loanService.getLoansByAccountNumber(accountNumber);
        return ResponseEntity.ok(loans);
    }

    /** ADMIN: view all loans with summary */
    @GetMapping("/loan/admin-summary")
    public ResponseEntity<?> getLoansForAdmin(HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("❌ Only admin can view loan summaries");
        }

        List<LoanAdminResponseDto> loans = loanService.getLoansForAdmin();
        return ResponseEntity.ok(loans);
    }  /** ADMIN: Dashboard with stats */
    @GetMapping("/admin/dashboard")
    public ResponseEntity<?> getAdminDashboard(HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only admin can access the dashboard");
        }

        // Fetch dashboard stats
        Map<String, Object> dashboardData = loanService.getAdminDashboardData();
        return ResponseEntity.ok(dashboardData);
    }

    /** ADMIN: View all loan applications */
    @GetMapping("/admin/applications")
    public ResponseEntity<?> getAdminApplications(HttpServletRequest request) {
        Users currentUser = getCurrentUser(request);
        if (currentUser == null || !"ROLE_ADMIN".equals(currentUser.getRole())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("❌ Only admin can view applications");
        }

        List<LoanAppDto> loanApplications = loanService.getAllLoanApplicationsForAdmin();
        return ResponseEntity.ok(loanApplications);
    }
}

