
# 🏦 Bank Management System (BMS) - Demo

This is a **Bank Management System (BMS)** demo project built with **Spring Boot**.
It exposes **5 REST APIs** (with 1 more under development) and securely communicates with the **Loan Management System (LMS)** using **JWT authentication** and **ngrok tunneling**.

The project demonstrates a **microservice architecture**, where **BMS handles banking operations** and integrates with **LMS for loan services**.


## ⚙️ Features

* ✅ RESTful APIs for bank & loan operations
* ✅ JWT-based authentication & authorization
* ✅ Integration with **Loan Management System (LMS)** via **ngrok tunnel**
* ✅ Error handling with readable responses
* ✅ Modular Spring Boot architecture (Controller → Service → Repository → Entity → DTO)


## 📡 APIs in BMS

### ✅ Completed APIs

1. **Hello (Health Check)**
   `GET /api/bank/hello`
   → Returns `"hello"` (used for testing connection).

2. **Send Micro-Deposit**
   `POST /api/bank/verify`
   → Sends a micro-deposit to initiate account verification.

   **Request:**

   ```json
   {
     "accountNumber": "1234567890"
   }
   ```

3. **Confirm Micro-Deposit**
   `POST /api/bank/verify-deposit`
   → Confirms the micro-deposit to verify the bank account.

   **Request:**

   ```json
   {
     "accountNumber": "1234567890",
     "microDepositAmount": "1.50"
   }
   ```

4. **Disburse Loan**
   `POST /api/bank/loan`
   → Disburses a loan to a verified account.

   **Request:**

   ```json
   {
     "accountNumber": "1234567890",
     "loanAmount": "5000"
   }
   ```

5. **Repay Loan**
   `POST /api/bank/repay`
   → Makes a loan repayment to the bank.

   **Request:**

   ```json
   {
     "accountNumber": "1234567890",
     "repaymentAmount": "200"
   }
   ```

---

### 🚧 Work in Progress

6. **\[Upcoming Endpoint]** → To be added (e.g., account management, loan history, etc.)


## 🔗 Communication with LMS

* BMS communicates with **Loan Management System (LMS)** using **JWT-secured requests**.
* Since services may run on different machines, **ngrok** is used to expose public URLs for inter-service communication.


