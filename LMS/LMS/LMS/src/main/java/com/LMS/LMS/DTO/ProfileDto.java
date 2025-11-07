package com.LMS.LMS.DTO;

public class ProfileDto {
    public Integer id;
    public String fullName;
    public String username;
    public String email;
    public String role;               // e.g. "ROLE_USER" | "ROLE_ADMIN"
    public Boolean accountVerified;   // derived from BankAccount.status == VERIFIED
    public String bankAccountNumber;  // may be null if not linked

    public ProfileDto() {}

    public ProfileDto(Integer id, String fullName, String username, String email,
                      String role, Boolean accountVerified, String bankAccountNumber) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.email = email;
        this.role = role;
        this.accountVerified = accountVerified;
        this.bankAccountNumber = bankAccountNumber;
    }
}
