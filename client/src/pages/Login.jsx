import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedRole, setSelectedRole] = useState('student'); // 'student' or 'admin'
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, logout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setError('');
      setLoading(true);
      const user = await login(email, password);
      
      // Role validation matching selected portal tab
      if (selectedRole === 'admin' && user.role !== 'admin') {
        logout();
        setError('Access Denied: This account does not have administrator privileges.');
        return;
      }
      
      if (selectedRole === 'student' && user.role !== 'student') {
        logout();
        setError('Access Denied: This account is registered as an Admin. Please use the Admin Portal.');
        return;
      }

      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 px-4">
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-md bg-white border border-slate-200 p-8 rounded-2xl shadow-xl relative z-10 animate-fade-in">
        <div className="text-center mb-6">
          <div className="inline-block bg-orange-500 text-white font-black text-3xl p-3 rounded-2xl mb-4 shadow-lg shadow-orange-500/20">
            CP
          </div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Placement Drive Portal
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Placement Drive Registration Platform</p>
        </div>

        {/* Role Selection Tabs */}
        <div className="flex border border-slate-200 rounded-xl p-1 mb-6 bg-slate-50">
          <button
            type="button"
            onClick={() => {
              setSelectedRole('student');
              setError('');
            }}
            className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
              selectedRole === 'student'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setSelectedRole('admin');
              setError('');
            }}
            className={`flex-1 text-center py-2.5 text-xs font-bold rounded-lg transition-all duration-300 ${
              selectedRole === 'admin'
                ? 'bg-orange-500 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            Admin Login
          </button>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-650 p-4 rounded-xl text-sm flex items-start space-x-2 animate-shake">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              {selectedRole === 'admin' ? 'Admin Email' : 'Student Email Address'}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={selectedRole === 'admin' ? 'e.g. admin@college.edu' : 'e.g. aarav@college.edu'}
              className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-650 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>{selectedRole === 'admin' ? 'Enter Admin Panel' : 'Sign In'}</span>
            )}
          </button>
        </form>

        {selectedRole === 'student' && (
          <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6 font-medium animate-fade-in">
            New Student?{' '}
            <Link to="/signup" className="text-orange-500 hover:text-orange-600 font-bold transition-colors duration-300">
              Create an Account
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
