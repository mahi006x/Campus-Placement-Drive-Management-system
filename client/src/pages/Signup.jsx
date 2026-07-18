import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    branch: 'CSE',
    cgpa: '',
    backlogs: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password, confirmPassword, branch, cgpa, backlogs } = formData;

    // Field check
    if (!name || !email || !password || !confirmPassword || !branch || cgpa === '' || backlogs === '') {
      setError('Please fill in all required fields');
      return;
    }

    // Passwords mismatch
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // CGPA limit validation
    const parsedCGPA = parseFloat(cgpa);
    if (isNaN(parsedCGPA) || parsedCGPA < 0 || parsedCGPA > 10) {
      setError('CGPA must be a valid number between 0.0 and 10.0');
      return;
    }

    // Backlog validation
    const parsedBacklogs = parseInt(backlogs, 10);
    if (isNaN(parsedBacklogs) || parsedBacklogs < 0) {
      setError('Backlogs count cannot be negative');
      return;
    }

    try {
      setError('');
      setLoading(true);
      await register(name, email, password, branch, parsedCGPA, parsedBacklogs);
      navigate('/dashboard');
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-55 px-4 py-12">
      {/* Background decorations */}
      <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl"></div>

      <div className="w-full max-w-lg bg-white border border-slate-200 p-8 rounded-2xl shadow-xl relative z-10 animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-block bg-orange-500 text-white font-black text-3xl p-3 rounded-2xl mb-4 shadow-lg shadow-orange-500/20">
            CP
          </div>
          <h2 className="text-2xl font-extrabold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Student Registration
          </h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Create your account to view eligible drives</p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm flex items-start space-x-2">
            <svg className="w-5 h-5 flex-shrink-0 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g. Aarav Sharma"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="e.g. aarav@college.edu"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Confirm Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm password"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-4 pt-4">
            <h4 className="text-xs font-extrabold text-orange-500 uppercase tracking-wider mb-3">Academic Qualifications</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Branch
                </label>
                <select
                  name="branch"
                  value={formData.branch}
                  onChange={handleChange}
                  className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-3 py-2 text-sm text-slate-800 outline-none transition-all duration-300 cursor-pointer"
                >
                  <option value="CSE">CSE</option>
                  <option value="ECE">ECE</option>
                  <option value="MECH">MECH</option>
                  <option value="EEE">EEE</option>
                  <option value="CIVIL">CIVIL</option>
                </select>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  CGPA (0 - 10)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="cgpa"
                  value={formData.cgpa}
                  onChange={handleChange}
                  placeholder="e.g. 8.5"
                  className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Active Backlogs
                </label>
                <input
                  type="number"
                  name="backlogs"
                  value={formData.backlogs}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-650 text-white font-bold py-3 rounded-xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500 border-t border-slate-100 pt-6 font-medium">
          Already registered?{' '}
          <Link to="/login" className="text-orange-500 hover:text-orange-600 font-bold transition-colors duration-300">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
