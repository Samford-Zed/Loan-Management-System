
# 💰 Loan Management System (LMS) - Demo

A simple **Loan Management System** built with **Spring Boot**.
Users can **apply for loans**, **repay loans**, and **send account info** to the Bank Management System (BMS) for verification.
Admins can approve loans. All endpoints are secured with **JWT authentication**.

## 📝 APIs

* `POST /api/lms/account/send` → Send account info to BMS (USER)
* `POST /api/lms/account/confirm-deposit` → Confirm micro-deposit (USER)
* `POST /api/lms/loan/apply` → Apply for a loan (USER)
* `POST /api/lms/loan/repay` → Repay a loan (USER)
* `POST /api/lms/loan/approve` → Approve a loan (ADMIN)
