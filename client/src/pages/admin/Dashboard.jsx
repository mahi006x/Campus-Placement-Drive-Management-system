import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [statsRes, drivesRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/registrations/stats`),
        axios.get(`${import.meta.env.VITE_API_URL}/drives`),
      ]);
      
      setStats(statsRes.data);
      setDrives(drivesRes.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve admin dashboard stats');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleDeleteDrive = async (driveId, companyName) => {
    if (!window.confirm(`Are you sure you want to delete the drive for ${companyName}? This action cannot be undone.`)) {
      return;
    }

    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/drives/${driveId}`);
      // Refresh dashboard
      await fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete drive');
    }
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  // Draw custom SVG chart metrics
  const chartData = stats?.regPerDrive || [];
  const maxCount = Math.max(...chartData.map((d) => d.count), 5); // Fallback min height to avoid division by 0

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {/* Title */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-black text-slate-900">Placement Admin Dashboard</h1>
          <p className="text-sm text-slate-500 font-medium mt-1">Manage drives, monitor student applications, and review stats</p>
        </div>

        <Link
          to="/admin/create"
          className="px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/15 transition-all duration-300 self-start"
        >
          + Create Placement Drive
        </Link>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 font-semibold">
          {error}
        </div>
      )}

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-xl"></div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Active Drives</span>
          <div className="text-3xl font-black text-slate-900 mt-2">{stats?.totalDrives || 0}</div>
          <p className="text-xs text-slate-400 font-semibold mt-2">Drives with scheduling set in database</p>
        </div>

        <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/3 rounded-full blur-xl"></div>
          <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Total Student Registrations</span>
          <div className="text-3xl font-black text-emerald-600 mt-2">{stats?.totalRegistrations || 0}</div>
          <p className="text-xs text-slate-400 font-semibold mt-2">Accumulated registration counts across all drives</p>
        </div>
      </div>

      {/* Render Chart (SVG component) */}
      <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-sm mb-10">
        <h3 className="text-base font-bold text-slate-800 mb-6">Student Registrations Per Drive</h3>

        {chartData.length === 0 ? (
          <div className="text-center py-12 text-slate-500 font-semibold text-sm">
            No registration data available to draw chart metrics.
          </div>
        ) : (
          <div className="w-full overflow-x-auto pb-4">
            <div className="min-w-[600px] h-64 flex items-end justify-between px-6 pt-10 pb-6 border-b border-l border-slate-200 relative">
              {/* Chart Grid Lines */}
              <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pr-6 pl-10 pt-10 pb-6">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-full border-t border-slate-100 h-0"></div>
                ))}
              </div>

              {/* Chart Bars */}
              <div className="w-full h-full flex items-end justify-around relative z-10 pl-6">
                {chartData.map((d, index) => {
                  const heightPercent = (d.count / maxCount) * 100;
                  return (
                    <div key={d._id || index} className="flex flex-col items-center flex-1 max-w-[80px] group">
                      {/* Count tooltip */}
                      <span className="bg-orange-600 text-white font-bold text-[10px] px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-2 shadow-md">
                        {d.count} Applied
                      </span>

                      {/* Bar fill */}
                      <div
                        style={{ height: `${Math.max(heightPercent, 4)}%` }}
                        className="w-full max-w-[32px] bg-gradient-to-t from-orange-600 to-orange-400 rounded-t-lg shadow-sm group-hover:from-orange-500 group-hover:to-orange-350 transition-all duration-300 cursor-pointer"
                      ></div>

                      {/* Labels */}
                      <span className="text-[10px] text-slate-700 font-bold mt-3 text-center truncate w-full" title={d.companyName}>
                        {d.companyName}
                      </span>
                      <span className="text-[8px] text-slate-500 font-semibold text-center truncate w-full">
                        {d.role}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Drives list table */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 bg-slate-50/50">
          <h3 className="text-base font-bold text-slate-800">Active Placement Drives</h3>
        </div>

        {drives.length === 0 ? (
          <div className="text-center py-16 text-slate-500 font-semibold text-sm">
            No recruitment drives registered in the system.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Eligibility Requirements</th>
                  <th className="px-6 py-4">Seats Left</th>
                  <th className="px-6 py-4 text-center">Registrations</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {drives.map((drive) => (
                  <tr key={drive._id} className="hover:bg-slate-50/50 transition-colors duration-200">
                    <td className="px-6 py-4">
                      <div>
                        <span className="font-bold text-slate-900 block">{drive.companyName}</span>
                        <span className="text-xs text-orange-600 font-bold mt-0.5 block">{drive.packageLPA.toFixed(1)} LPA</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-semibold">{drive.role}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs space-y-0.5 text-slate-500 font-medium">
                        <div>Branches: <span className="text-slate-800 font-bold">{drive.eligibleBranches.join(', ')}</span></div>
                        <div>Min CGPA: <span className="text-slate-800 font-bold">{drive.minCGPA.toFixed(2)}</span></div>
                        <div>Max Backlogs: <span className="text-slate-800 font-bold">{drive.maxBacklogs}</span></div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`font-bold ${drive.seatsAvailable > 0 ? 'text-orange-600' : 'text-red-600'}`}>
                        {drive.seatsAvailable} Left
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <Link
                        to={`/admin/registrations/${drive._id}`}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-orange-600 hover:text-orange-700 font-bold text-xs rounded-lg transition-colors inline-block border border-slate-200 shadow-sm"
                      >
                        View Applicants
                      </Link>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end items-center space-x-3">
                        <button
                          onClick={() => navigate(`/admin/edit/${drive._id}`)}
                          className="text-slate-400 hover:text-orange-500 transition-colors"
                          title="Edit Drive"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDeleteDrive(drive._id, drive.companyName)}
                          className="text-slate-400 hover:text-red-500 transition-colors"
                          title="Delete Drive"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
