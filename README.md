# Campus Placement Drive Registration System

A full-stack, responsive web application for managing campus recruitment placement drives. It allows student registration, academic eligibility enforcement, seat tracking, and administrative controls for coordinate placement cell drives.

---

## Architecture Diagram

```mermaid
graph TD
    subgraph Client [React SPA Client - Port 5173]
        Router[React Router]
        AuthCtx[Auth Context / State]
        AxiosInstance[Axios Interceptor]
        StudentUI[Student Views]
        AdminUI[Admin Views]
    end

    subgraph Server [Express REST API - Port 5000]
        AuthRoutes[/api/auth]
        DriveRoutes[/api/drives]
        RegRoutes[/api/registrations]
        AuthMW[Auth & RBAC Middleware]
        EligUtil[Eligibility Utility]
    end

    subgraph Database [MongoDB]
        Users[(Users Collection)]
        Drives[(Drives Collection)]
        Registrations[(Registrations Collection)]
    end

    StudentUI --> Router
    AdminUI --> Router
    Router --> AuthCtx
    AuthCtx --> AxiosInstance
    AxiosInstance --> AuthMW
    AuthMW --> AuthRoutes
    AuthMW --> DriveRoutes
    AuthMW --> RegRoutes
    AuthRoutes --> Users
    DriveRoutes --> Drives
    RegRoutes --> Registrations
    RegRoutes --> EligUtil
```

---

## Tech Stack
- **Frontend**: React (Vite), React Router, Tailwind CSS, Axios
- **Backend**: Node.js + Express
- **Database**: MongoDB + Mongoose
- **Authentication**: JSON Web Token (JWT) stored in `localStorage`

---

## Core Data Schema

### 1. User
- `name` (String, required)
- `email` (String, required, unique)
- `password` (String, required, hashed using bcrypt)
- `role` (String, enum: `['student', 'admin']`, default: `'student'`)
- `branch` (String, required for student)
- `cgpa` (Number, min: `0`, max: `10`, required for student)
- `backlogs` (Number, min: `0`, required for student)

### 2. Drive
- `companyName` (String, required)
- `role` (String, required)
- `packageLPA` (Number, required)
- `eligibleBranches` (Array of Strings, required)
- `minCGPA` (Number, required)
- `maxBacklogs` (Number, required)
- `driveDate` (Date, required)
- `description` (String, required)
- `seatsAvailable` (Number, default: `30`)
- `createdBy` (ObjectId ref User, Admin only)

### 3. Registration
- `userId` (ObjectId ref User)
- `driveId` (ObjectId ref Drive)
- `status` (String, enum: `['Registered', 'Shortlisted', 'Rejected', 'Selected']`, default: `'Registered'`)
- `registeredAt` (Date, default: `Date.now`)
- *Composite unique index on (userId, driveId)*

---

## Seeding & Test Credentials

Running the seeding script clears existing data and loads:
- **1 Admin Account**:
  - Email: `admin@college.edu`
  - Password: `admin123`
- **4 Sample Student Accounts**:
  - `aarav@college.edu` / `student123` (CSE, CGPA: 9.20, Backlogs: 0) — *Eligible for Google, Wipro, Capgemini, TCS*
  - `ananya@college.edu` / `student123` (ECE, CGPA: 7.80, Backlogs: 1) — *Eligible for Wipro, Capgemini, TCS. Ineligible for Google (CGPA/Backlogs)*
  - `rohan@college.edu` / `student123` (MECH, CGPA: 6.50, Backlogs: 0) — *Eligible for TCS Ninja only. Ineligible for others due to Branch*
  - `kabir@college.edu` / `student123` (CIVIL, CGPA: 5.80, Backlogs: 3) — *Ineligible for all drives due to high backlogs or low CGPA*
- **6 Sample Placement Drives**:
  - **Google** (CSE/ECE, min CGPA: 8.5, max backlogs: 0, Package: 22.0 LPA, Seats: 5)
  - **TCS Ninja** (All Branches, min CGPA: 6.0, max backlogs: 2, Package: 3.6 LPA, Seats: 50)
  - **Infosys** (CSE/ECE/EEE, min CGPA: 7.5, max backlogs: 0, Package: 6.2 LPA, Seats: 15)
  - **Wipro Turbo** (CSE/ECE, min CGPA: 7.0, max backlogs: 1, Package: 6.5 LPA, Seats: 20)
  - **Capgemini** (CSE/ECE/EEE, min CGPA: 6.5, max backlogs: 1, Package: 4.0 LPA, Seats: 25)
  - **Cognizant GenC Elevate** (CSE/ECE, min CGPA: 6.5, max backlogs: 0, Package: 4.5 LPA, Seats: 0) — *Used to verify seat-exhaustion blocking*

---

## Local Setup & Installation

### Prerequisites
- Node.js installed locally
- MongoDB running locally (default: `mongodb://127.0.0.1:27017/campus_placement`)

### 1. Backend Server Setup
```bash
cd server
npm install
# Create .env file matching .env.example
npm run seed
npm start
```

### 2. Frontend Client Setup
```bash
cd client
npm install
# Create .env file matching .env.example
npm run dev
```
The client application will run at [http://localhost:5173](http://localhost:5173).
