# Campus Placement Drive Management System

This is a full-stack, responsive web application for managing campus recruitment placement drives. It allows student registration, automates academic eligibility enforcement, tracks real-time seat counts, and provides administrative controls for placement coordinators.

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

## 🚀 Features
- **Student Dashboard**: Browse active recruitment drives, inspect package details (LPA), check academic qualifications, register, and monitor application status.
- **Admin Control Panel**: Schedule new drives, customize requirements (min CGPA, max backlogs, eligible branches), manage available seats, track registered students, and update candidate statuses.
- **Automated Eligibility Engine**: Validates eligibility constraints (CGPA, backlogs, branch checks) at the moment of registration.
- **Seat Allocation Controller**: Automatically tracks and decrements available seats per drive, blocking further registrations once capacity is exhausted.
- **Secure Role-Based Access (RBAC)**: REST API routes and React views secured by JSON Web Tokens.

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
npm run seed     # Clear DB and seed mock data
npm run dev      # Run in development mode with nodemon
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

## 🌐 Production Deployment

### 1. Backend Deployment on Render
- **Type**: Web Service
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Environment Variables**: Define `PORT`, `MONGODB_URI`, `JWT_SECRET`, and `FRONTEND_URL` (Vercel URL).

### 2. Frontend Deployment on Vercel
- **Framework Preset**: `Vite`
- **Root Directory**: `client`
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**: Define `VITE_API_URL` (Render API URL).

---

## 🧪 Seeding & Test Accounts
Running `npm run seed` in the `server` folder creates:
- **Admin**: `admin@college.edu` / `admin123`
- **CSE Student (Eligible)**: `aarav@college.edu` / `student123`
- **ECE Student (Backlog Check)**: `ananya@college.edu` / `student123`
- **Mech Student (Branch Check)**: `rohan@college.edu` / `student123`
- **Civil Student (High Backlogs/Disqualified)**: `kabir@college.edu` / `student123`
