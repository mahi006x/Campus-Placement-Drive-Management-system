import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Landing = () => {
  const { user, loading } = useAuth();

  // If user is already authenticated, direct them straight to their dashboard
  if (user && !loading) {
    return user.role === 'admin' ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/dashboard" replace />
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      {/* Decorative background glows */}
      <div className="absolute top-0 left-1/4 -translate-x-1/2 w-[500px] h-[500px] bg-orange-500/5 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-1/4 right-0 w-[600px] h-[600px] bg-amber-500/5 rounded-full blur-3xl -z-10"></div>

      {/* Main Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16 max-w-5xl mx-auto z-10 animate-fade-in">
        <div className="inline-flex items-center space-x-2 bg-orange-50 border border-orange-200/50 rounded-full px-4 py-1.5 mb-6 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-orange-500 animate-ping"></span>
          <span className="text-xs font-bold text-orange-650 tracking-wide uppercase">Unified Recruitment Hub</span>
        </div>

        <h1 className="text-4xl md:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          College Placement Drive <br />
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 bg-clip-text text-transparent">
            Management System
          </span>
        </h1>

        <p className="mt-6 text-base md:text-lg text-slate-500 max-w-2xl font-medium leading-relaxed">
          An automated coordination portal bridging students and recruitment placement drives. Enforcing real-time eligibility checks, live capacity constraints, and streamlined status tracking.
        </p>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
          <Link
            to="/login"
            className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-2xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-300 transform hover:-translate-y-0.5 text-center"
          >
            Enter Portal
          </Link>
          <Link
            to="/signup"
            className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 font-bold rounded-2xl shadow-md transition-all duration-300 text-center"
          >
            Student Registration
          </Link>
        </div>

        {/* Features Matrix Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8 w-full text-left">
          {/* Card 1 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-5 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Eligibility Engine</h3>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              Auto-validates your branch, CGPA, and backlog metrics before allowing registration. No unqualified submissions.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-5 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Seat Counter Checks</h3>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              Monitors and limits dynamic registration counts in real time, preventing company over-allocation issues.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 group hover:-translate-y-1">
            <div className="w-12 h-12 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-500 mb-5 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2z" />
              </svg>
            </div>
            <h3 className="text-base font-extrabold text-slate-800">Coordinator View</h3>
            <p className="mt-2 text-sm text-slate-500 font-medium leading-relaxed">
              Provides dedicated control portals for college placement cells to create, edit, filter, and shortlist student profiles.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
