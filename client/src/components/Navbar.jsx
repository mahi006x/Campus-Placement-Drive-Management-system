import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
      isActive(path)
        ? 'bg-orange-500 text-white shadow-md shadow-orange-500/15'
        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 px-6 py-4 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <div className="bg-orange-500 p-2 rounded-xl text-white font-black text-xl shadow-lg shadow-orange-500/20">
            CP
          </div>
          <span className="hidden sm:inline font-extrabold text-lg bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Campus Placement
          </span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center space-x-2">
          {user.role === 'student' ? (
            <>
              <Link to="/dashboard" className={linkClass('/dashboard')}>
                Drives
              </Link>
              <Link to="/my-registrations" className={linkClass('/my-registrations')}>
                My Applications
              </Link>
            </>
          ) : (
            <>
              <Link to="/admin" className={linkClass('/admin')}>
                Dashboard
              </Link>
              <Link to="/admin/create" className={linkClass('/admin/create')}>
                Create Drive
              </Link>
            </>
          )}
        </div>

        {/* Profile and Logout */}
        <div className="flex items-center space-x-4">
          <div className="hidden md:flex flex-col items-end text-xs">
            <span className="font-bold text-slate-800">{user.name}</span>
            <span className="text-slate-600 capitalize bg-slate-100 px-2 py-0.5 rounded-full text-[10px] mt-0.5 font-medium border border-slate-200">
              {user.role} {user.role === 'student' && `• ${user.branch}`}
            </span>
          </div>

          <button
            onClick={handleLogout}
            className="px-4 py-2 border border-slate-200 hover:border-red-500 hover:bg-red-50 text-slate-600 hover:text-red-500 rounded-lg text-sm font-semibold transition-all duration-300 flex items-center space-x-1"
          >
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
