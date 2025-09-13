# 🏦 Loan Management System (LMS) — React + Spring Boot (with BMS Integration)

A full-stack Loan Management System built with React (TypeScript) on the frontend and Spring Boot (Java) on the backend. It integrates with a lightweight Bank Management System (BMS) for account verification, loan disbursement, and repayments.


## 📌 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Installation](#installation)
- [Usage](#usage)
- [API Reference](#api-reference)
- [Database Schema](#database-schema)
- [Common Pitfalls](#common-pitfalls--fixes)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)


## 🚀 Features

### 👤 For Customers

- Register & login (JWT-based authentication)
- Bank account verification via micro-deposit (BMS)
- Apply for loans (auto-calculated EMI)
- View active loans, applications & EMI schedules
- Repay loan amounts online
- Update profile & change password securely

### 👨‍💼 For Admins

- Dashboard with loan statistics (pending, approved, disbursed, rejected)
- Review loan applications with BMS account snapshots
- Approve & disburse loans (auto-generates EMI schedule)
- Reject loan applications
- View all applications & repayment history


## ⚙️ Tech Stack

### 🎨 Frontend

- React + Vite
- TypeScript
- TailwindCSS
- Axios

### 🔧 Backend

- Spring Boot
- Spring Security + JWT
- Maven

### 💾 Database

- PostgreSQL

### 🌐 Integration

- Bank Management System (BMS) via secured REST APIs


## 🛠️ Installation (Run Locally)

### Prerequisites

- Java 17+
- Maven or Gradle
- Node.js 18+ & npm/yarn
- PostgreSQL 14+ (or Docker)


### 🔧 Backend Setup (Spring Boot)

**Option 1: Manual DB**

```bash
createdb lms
Option 2: Docker

bash
Copy code
docker run --name lms-postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=lms \
  -p 5432:5432 \
  -d postgres:14
Edit backend/src/main/resources/application.properties:

properties
Copy code
server.port=8081

spring.datasource.url=jdbc:postgresql://localhost:5432/lms
spring.datasource.username=postgres
spring.datasource.password=postgres

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true

app.jwt.secret=your-secret-key
app.jwt.expiration=86400000
Run Backend:

bash
Copy code
cd backend
mvn spring-boot:run
💻 Frontend Setup (React + Vite)
bash
Copy code
cd frontend
npm install
npm run dev
Frontend: http://localhost:5173
Backend: http://localhost:8081

🌐 Environment Variables
Create .env in frontend/:

env
Copy code
VITE_API_BASE=http://localhost:8081/api/lms
VITE_PUBLIC_BASE=http://localhost:8081
🔄 Key Flows
1️⃣ Bank Verification
→ LMS → BMS → Micro-deposit → Verification → Credit Score Update

2️⃣ Loan Application
→ Check verified bank → Calculate EMI → Save as PENDING → Update credit score

3️⃣ Admin Approval
→ Fetch BMS snapshot → Approve → LMS disburses loan → EMI schedule generated

4️⃣ Loan Repayment
→ Repayment via BMS → LMS updates EMI & credit score

📡 API Reference
🛡 Authentication
bash
Copy code
POST /login
POST /register
GET  /api/lms/profile
PUT  /api/lms/updatePassword
🏦 Bank APIs
swift
Copy code
POST /api/lms/bank/verify
POST /api/lms/bank/confirm
💳 Loan APIs
swift
Copy code
POST /api/lms/loan/apply
GET  /api/lms/applications/{accountNumber}
GET  /api/lms/active/{accountNumber}
🔐 Admin APIs
swift
Copy code
GET  /api/lms/loan/pending
POST /api/lms/loan/approve
POST /api/lms/loan/reject
GET  /api/lms/admin/dashboard
💰 Repayment
swift
Copy code
POST /api/lms/loan/repay
🪙 Bank Management System (BMS)
A demo banking microservice built using Spring Boot that integrates with LMS via JWT-secured APIs.

Features
REST APIs for micro-deposits, loan disbursements, repayments

JWT authentication & secure ngrok tunneling

Handles account verification & transaction tracking

BMS Endpoints
bash
Copy code
GET  /api/bank/hello             # Health check
GET  /api/bank/verify            # Send micro-deposit
POST /api/bank/verify-deposit   # Confirm deposit
POST /api/bank/loan             # Disburse loan
POST /api/bank/repay            # Repay loan
🗂️ Database Schema (High-Level)
Table	Description
users	Customer & admin profiles
bank_account	Bank verification status
loan_application	Pending loan requests
loan	Approved loans & EMI details
loan_emi_schedule	EMI tracking per loan
repayment	Loan repayments
credit_score	Customer credit scoring

⚠️ Common Pitfalls & Fixes
CORS issues → Add Spring CorsConfig

400 on password update → Use protected API client with JWT

Wrong dates in UI → Ensure appliedDate is formatted correctly in backend

🛤 Roadmap
✅ JWT Auth & BMS Integration

✅ Loan Application, Approval, EMI & Repayment

🔄 Multi-bank account support

📨 Email Notifications

📈 Reports & Analytics

🐳 Docker Compose Setup

🤝 Contributing
Fork the repo

Create a feature branch

Commit changes

Open a PR with screenshots & test notes

📄 License
MIT © 2025 Samuel Zenebe

