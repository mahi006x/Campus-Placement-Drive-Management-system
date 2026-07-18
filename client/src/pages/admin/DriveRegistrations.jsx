import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const DriveRegistrations = () => {
  const { driveId } = useParams();
  const [drive, setDrive] = useState(null);
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Filter States
  const [branchFilter, setBranchFilter] = useState('');
  const [cgpaFilter, setCgpaFilter] = useState('');
  
  const branchesList = ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];

  const fetchRegistrations = async () => {
    try {
      setLoading(true);
      setError('');

      // Build query string based on filters
      const queryParams = [];
      if (branchFilter) queryParams.push(`branch=${branchFilter}`);
      if (cgpaFilter) queryParams.push(`minCGPA=${cgpaFilter}`);
      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';

      const [driveRes, regRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/drives/${driveId}`),
        axios.get(`${import.meta.env.VITE_API_URL}/registrations/drive/${driveId}${queryString}`),
      ]);

      setDrive(driveRes.data);
      setRegistrations(regRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch applicants');
    } finally {
      setLoading(false);
    }
  };

  // Re-fetch when filters change
  useEffect(() => {
    fetchRegistrations();
  }, [driveId, branchFilter, cgpaFilter]);

  const handleStatusChange = async (regId, newStatus) => {
    try {
      const response = await axios.put(`${import.meta.env.VITE_API_URL}/registrations/${regId}/status`, {
        status: newStatus,
      });

      // Update local item
      setRegistrations(registrations.map((r) => (r._id === regId ? response.data : r)));
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update registration status');
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Registered':
        return 'text-blue-755 border border-blue-200 bg-blue-50';
      case 'Shortlisted':
        return 'text-amber-705 border border-amber-250 bg-amber-50';
      case 'Selected':
        return 'text-emerald-755 border border-emerald-250 bg-emerald-50';
      case 'Rejected':
        return 'text-red-705 border border-red-200 bg-red-50';
      default:
        return 'text-slate-600 border border-slate-200 bg-slate-100';
    }
  };

  if (loading && !drive) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-6">
        <Link to="/admin" className="text-slate-500 hover:text-slate-800 transition-colors duration-200 text-sm font-semibold">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      {/* Header card details */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-sm">
        <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
          Drive Applicants Manager
        </span>
        <h1 className="text-2xl font-extrabold text-slate-900 mt-3">{drive?.companyName} &bull; {drive?.role}</h1>
        <p className="text-sm text-slate-500 font-semibold mt-1">Package: {drive?.packageLPA.toFixed(1)} LPA | Date: {drive && new Date(drive.driveDate).toLocaleDateString()}</p>
      </div>

      {/* Filter panel */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl mb-8 shadow-sm flex flex-col md:flex-row items-end gap-6">
        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Filter by Branch
          </label>
          <select
            value={branchFilter}
            onChange={(e) => setBranchFilter(e.target.value)}
            className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 outline-none transition-colors cursor-pointer"
          >
            <option value="">All Branches</option>
            {branchesList.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div className="flex-1 w-full">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
            Min Student CGPA
          </label>
          <input
            type="number"
            step="0.1"
            value={cgpaFilter}
            onChange={(e) => setCgpaFilter(e.target.value)}
            placeholder="e.g. 7.5"
            className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-2.5 text-sm text-slate-800 placeholder-slate-400 outline-none transition-colors"
          />
        </div>

        <button
          onClick={() => {
            setBranchFilter('');
            setCgpaFilter('');
          }}
          className="w-full md:w-auto px-6 py-2.5 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-colors duration-200"
        >
          Reset Filters
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 font-semibold">
          {error}
        </div>
      )}

      {/* Applicants Grid/Table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        {registrations.length === 0 ? (
          <div className="text-center py-20 text-slate-500 font-semibold text-sm">
            {loading ? 'Fetching records...' : 'No registered applicants matches the selected filter.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Student Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">Branch</th>
                  <th className="px-6 py-4 text-center">CGPA</th>
                  <th className="px-6 py-4 text-center">Backlogs</th>
                  <th className="px-6 py-4 text-right">Application Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {registrations.map((reg) => {
                  const student = reg.userId;
                  if (!student) return null;
                  return (
                    <tr key={reg._id} className="hover:bg-slate-50/50 transition-all duration-200">
                      <td className="px-6 py-4 font-bold text-slate-900">{student.name}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{student.email}</td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 px-2.5 py-1 rounded text-xs font-bold text-slate-600 border border-slate-200">
                          {student.branch}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center font-bold text-slate-900">{student.cgpa.toFixed(2)}</td>
                      <td className="px-6 py-4 text-center font-semibold">
                        <span className={student.backlogs > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                          {student.backlogs}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <select
                          value={reg.status}
                          onChange={(e) => handleStatusChange(reg._id, e.target.value)}
                          className={`bg-white border border-slate-200 focus:border-orange-500 text-xs font-bold px-3 py-1.5 rounded-lg outline-none cursor-pointer text-center ${getStatusClass(reg.status)}`}
                        >
                          <option value="Registered">Registered</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Selected">Selected</option>
                          <option value="Rejected">Rejected</option>
                        </select>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriveRegistrations;
