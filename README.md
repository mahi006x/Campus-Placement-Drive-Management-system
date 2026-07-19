# Campus Placement Drive Management System

A full-stack, responsive web application designed to coordinate university campus recruitment placement drives. It manages student profiles, automates academic eligibility enforcement, supports real-time seat tracking, and provides administrative dashboards for placement coordinators.

**Live Deployment URL**: [https://campus-placement-drive-management-s.vercel.app](https://campus-placement-drive-management-s.vercel.app)

---

## 🏗️ Folder Structure

```
Campus-Placement-Drive-Management-system/
├── client/                 # Frontend React SPA (Vite + Tailwind CSS)
│   ├── public/             # Static public assets
│   ├── src/                # React components, pages, and application logic
│   ├── vercel.json         # Vercel deployment rewrite configurations
│   ├── vite.config.js      # Vite build configuration
│   └── package.json        # Frontend dependencies & scripts
├── server/                 # Backend REST API (Node.js + Express)
│   ├── config/             # Database connection setups
│   ├── middleware/         # Custom authentication and access control rules
│   ├── models/             # Mongoose database schemas
│   ├── routes/             # Express API endpoints
│   ├── scripts/            # Database seeding and mock generation utilities
│   ├── index.js            # Main backend application entry point
│   └── package.json        # Backend dependencies & scripts
├── .gitignore              # Project-wide Git ignore rules
└── README.md               # Project documentation
```

---

## 🎨 Tech Stack
- **Frontend**: React (Vite), React Router DOM (v7), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js
- **Database**: MongoDB + Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens) with client-side storage, password hashing using `bcryptjs`

---

## 🚀 Key Features

- **Product Landing Page**: A landing page (`/`) introducing the platform and providing direct paths to sign in or create accounts.
- **Tabbed Login Portal (Industry Standard)**: A unified sign-in component with tabs for **Student Login** and **Admin Login**. Validates student/admin roles against credentials in the database to prevent cross-login security breaches.
- **Real-Time Data Syncing**: Automatic background polling fetches placement drives and coordinate statistics every **10 seconds** without page refreshes or blocking loaders.
- **Automated Eligibility Engine**: Validates candidate parameters (branch, CGPA, and backlogs) at the moment of registration.
- **Seat Allocation Controller**: Tracks company drive capacity in real time, decrementing seats automatically on application and blocking registration when seats are exhausted.
- **Admin Command Center**: Interfaces to schedule, edit, or delete drives, manage applicant lists, filter registered candidates by qualifications, and update hiring statuses.

---

## 🛠️ Installation & Local Setup

### Prerequisites
- Node.js (v16+) installed locally
- MongoDB running locally or a MongoDB Atlas Cloud URI

### 1. Backend Server Setup
```bash
cd server
npm install
# Create a .env file (see Environment Variables section below)
npm run seed     # Clear database and seed mock data
npm run dev      # Run server in development mode with nodemon
```

### 2. Frontend Client Setup
```bash
cd ../client
npm install
# Create a .env file (see Environment Variables section below)
npm run dev      # Launch local development server
```

The application will run locally at [http://localhost:5173](http://localhost:5173), forwarding API requests to [http://localhost:5000](http://localhost:5000).

---

## 🔑 Environment Variables

### Backend Server (`server/.env`)
Create a `.env` file in the `server` directory:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/campus_placement
JWT_SECRET=your_jwt_secret_here
FRONTEND_URL=http://localhost:5173
```
*Note: In production, `MONGODB_URI` must point to your MongoDB Atlas cluster, and `FRONTEND_URL` must point to your deployed Vercel domain.*

### Frontend Client (`client/.env`)
Create a `.env` file in the `client` directory:
```env
VITE_API_URL=http://127.0.0.1:5000/api
```
*Note: In production, `VITE_API_URL` must point to your deployed Render URL (e.g., `https://campus-placement-api.onrender.com/api`).*

---

## 🌐 Production Deployment Guide

### 1. Backend Deployment (Render)
- **Service Type**: Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Define `PORT`, `MONGODB_URI` (Atlas connection string), `JWT_SECRET`, and `FRONTEND_URL` (your Vercel URL).
- **MongoDB Atlas Setup**: Ensure Atlas **Network Access** includes `0.0.0.0/0` (Allow access from anywhere) since Render instances operate on dynamic IP addresses.

### 2. Frontend Deployment (Vercel)
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Define `VITE_API_URL` pointing to your deployed Render service endpoint (e.g. `https://xxx.onrender.com/api`).

---

## 🧪 Seeding & Test Accounts
Running `npm run seed` in the `server` folder creates:
- **Admin Account**: `admin@college.edu` / `admin123`
- **CSE Student (Eligible for Google)**: `aarav@college.edu` / `student123` (CGPA: 9.20, Backlogs: 0)
- **ECE Student (Backlog Check)**: `ananya@college.edu` / `student123` (CGPA: 7.80, Backlogs: 1)
- **Mech Student (Branch Check)**: `rohan@college.edu` / `student123` (CGPA: 6.50, Backlogs: 0)
- **Civil Student (Disqualified by Backlogs)**: `kabir@college.edu` / `student123` (CGPA: 5.80, Backlogs: 3)
