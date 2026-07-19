import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';

// Student Page Modules
import StudentDashboard from './pages/student/Dashboard';
import StudentDriveDetails from './pages/student/DriveDetails';
import StudentRegistrations from './pages/student/MyRegistrations';

// Admin Page Modules
import AdminDashboard from './pages/admin/Dashboard';
import AdminManageDrive from './pages/admin/ManageDrive';
import AdminDriveRegistrations from './pages/admin/DriveRegistrations';

const AppContent = () => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 flex flex-col">
      <Navbar />
      <main className="flex-1 w-full">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />

          {/* Student Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/dashboard" element={<StudentDashboard />} />
            <Route path="/drive/:id" element={<StudentDriveDetails />} />
            <Route path="/my-registrations" element={<StudentRegistrations />} />
          </Route>

          {/* Admin Role Routes */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<AdminManageDrive />} />
            <Route path="/admin/edit/:id" element={<AdminManageDrive />} />
            <Route path="/admin/registrations/:driveId" element={<AdminDriveRegistrations />} />
          </Route>

          {/* Catch-all Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
