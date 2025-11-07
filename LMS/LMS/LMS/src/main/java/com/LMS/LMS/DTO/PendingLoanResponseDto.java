package com.LMS.LMS.DTO;

public class PendingLoanResponseDto {
    private LoanApplicationDto application;
    private LoanSummaryDto loanSummary;

    // getters & setters
    public LoanApplicationDto getApplication() { return application; }
    public void setApplication(LoanApplicationDto application) { this.application = application; }
    public LoanSummaryDto getLoanSummary() { return loanSummary; }
    public void setLoanSummary(LoanSummaryDto loanSummary) { this.loanSummary = loanSummary; }
}