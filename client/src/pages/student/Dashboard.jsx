import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const [drives, setDrives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/drives`);
        setDrives(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load placement drives');
      } finally {
        setLoading(false);
      }
    };
    fetchDrives();
  }, []);

  // Inlined client-side eligibility logic for immediate visual feedback
  const getEligibility = (drive) => {
    if (!user) return { eligible: false, reason: '' };

    const branchMatch = drive.eligibleBranches.some(
      (b) => b.toLowerCase() === user.branch.toLowerCase()
    );
    if (!branchMatch) {
      return { eligible: false, reason: `Branch '${user.branch}' not eligible.` };
    }

    if (user.cgpa < drive.minCGPA) {
      return { eligible: false, reason: `CGPA too low (min ${drive.minCGPA.toFixed(2)}).` };
    }

    if (user.backlogs > drive.maxBacklogs) {
      return { eligible: false, reason: `Backlogs exceed limit (max ${drive.maxBacklogs}).` };
    }

    return { eligible: true };
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 animate-fade-in">
      {/* Student Profile Card Header */}
      <div className="relative overflow-hidden bg-white border border-slate-200 p-6 rounded-2xl mb-10 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-2xl"></div>
        <div>
          <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
            Student Profile
          </span>
          <h1 className="text-2xl font-extrabold text-slate-900 mt-3">{user?.name}</h1>
          <p className="text-sm text-slate-500 font-medium">{user?.email}</p>
        </div>

        <div className="grid grid-cols-3 gap-6 md:gap-12 border-t md:border-t-0 md:border-l border-slate-100 pt-6 md:pt-0 md:pl-12">
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Branch</span>
            <span className="text-lg font-extrabold text-slate-800 mt-1 block">{user?.branch}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">CGPA</span>
            <span className="text-lg font-extrabold text-slate-800 mt-1 block">{user?.cgpa?.toFixed(2)}</span>
          </div>
          <div>
            <span className="block text-[10px] text-slate-500 uppercase font-bold tracking-wider">Backlogs</span>
            <span className={`text-lg font-extrabold mt-1 block ${user?.backlogs > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {user?.backlogs}
            </span>
          </div>
        </div>
      </div>

      {/* Headline */}
      <div className="mb-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Upcoming Placement Drives</h2>
          <p className="text-sm text-slate-500 font-medium mt-1">Browse and apply for drives that match your qualifications</p>
        </div>
        <div className="flex items-center space-x-2 text-xs text-slate-500 font-semibold">
          <span className="inline-block w-3 h-3 bg-emerald-500 rounded-full"></span>
          <span>Eligible</span>
          <span className="inline-block w-3 h-3 bg-red-500 rounded-full ml-2"></span>
          <span>Ineligible</span>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 font-semibold">
          {error}
        </div>
      )}

      {drives.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 font-medium">No upcoming recruitment drives scheduled at this time.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {drives.map((drive) => {
            const { eligible, reason } = getEligibility(drive);
            return (
              <div
                key={drive._id}
                onClick={() => navigate(`/drive/${drive._id}`)}
                className="group relative bg-white hover:bg-slate-50/50 border border-slate-200 hover:border-orange-300 p-6 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer flex flex-col justify-between"
              >
                <div>
                  {/* Card Badge Header */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-semibold text-slate-600 uppercase bg-slate-100 px-2.5 py-1 rounded-md border border-slate-200">
                      {drive.role}
                    </span>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        eligible
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-red-50 text-red-700 border border-red-200'
                      }`}
                    >
                      {eligible ? 'Eligible' : 'Ineligible'}
                    </span>
                  </div>

                  {/* Company and CTC */}
                  <h3 className="text-lg font-bold text-slate-800 group-hover:text-orange-500 transition-colors duration-300">
                    {drive.companyName}
                  </h3>
                  <p className="text-xl font-extrabold text-orange-500 mt-2">
                    {drive.packageLPA.toFixed(1)} <span className="text-xs font-normal text-slate-500">LPA</span>
                  </p>

                  <p className="text-sm text-slate-500 font-medium mt-4 line-clamp-2 leading-relaxed">
                    {drive.description}
                  </p>
                </div>

                <div className="mt-6 border-t border-slate-100 pt-4 flex items-center justify-between text-xs text-slate-500">
                  <div>
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Drive Date</span>
                    <span className="font-semibold text-slate-700 mt-0.5 block">{formatDate(drive.driveDate)}</span>
                  </div>

                  <div className="text-right">
                    <span className="block text-[10px] text-slate-400 uppercase tracking-wider font-bold">Seats Left</span>
                    <span className={`font-semibold mt-0.5 block ${drive.seatsAvailable > 0 ? 'text-orange-600' : 'text-red-650 font-bold'}`}>
                      {drive.seatsAvailable > 0 ? `${drive.seatsAvailable} Seats` : 'Full / No Seats'}
                    </span>
                  </div>
                </div>

                {/* Hover overlay reason text if ineligible */}
                {!eligible && reason && (
                  <div className="absolute inset-x-0 bottom-0 bg-red-50/98 border-t border-red-200 p-3 rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center text-xs text-red-700 font-semibold shadow-inner">
                    {reason}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
