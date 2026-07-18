import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const MyRegistrations = () => {
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchRegistrations = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/registrations/my-registrations`);
        setRegistrations(response.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load your registrations');
      } finally {
        setLoading(false);
      }
    };
    fetchRegistrations();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Registered':
        return 'bg-blue-50 text-blue-700 border border-blue-200';
      case 'Shortlisted':
        return 'bg-amber-50 text-amber-700 border border-amber-200';
      case 'Selected':
        return 'bg-emerald-50 text-emerald-750 border border-emerald-200';
      case 'Rejected':
        return 'bg-red-50 text-red-700 border border-red-200';
      default:
        return 'bg-slate-100 text-slate-600 border border-slate-200';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
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
    <div className="max-w-6xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold text-slate-900">My Applications</h1>
        <p className="text-sm text-slate-500 font-medium mt-1">Track the live progress of your registered campus recruitment drives</p>
      </div>

      {error && (
        <div className="bg-red-55/10 border border-red-200 text-red-700 p-4 rounded-xl text-sm mb-6 font-semibold">
          {error}
        </div>
      )}

      {registrations.length === 0 ? (
        <div className="text-center py-20 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <p className="text-slate-500 font-medium mb-4">You have not registered for any placement drives yet.</p>
          <Link
            to="/dashboard"
            className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/15 transition-all duration-300"
          >
            Browse Active Drives
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200 text-xs text-slate-500 uppercase tracking-wider font-bold">
                  <th className="px-6 py-4">Company</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">CTC Package</th>
                  <th className="px-6 py-4">Applied Date</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4 text-right">Details</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                {registrations.map((reg) => {
                  const drive = reg.driveId;
                  if (!drive) return null;
                  return (
                    <tr key={reg._id} className="hover:bg-slate-50/50 transition-colors duration-200">
                      <td className="px-6 py-4 font-bold text-slate-900">{drive.companyName}</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{drive.role}</td>
                      <td className="px-6 py-4 text-emerald-600 font-bold">{drive.packageLPA.toFixed(1)} LPA</td>
                      <td className="px-6 py-4 text-slate-500 font-medium">{formatDate(reg.registeredAt)}</td>
                      <td className="px-6 py-4">
                        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${getStatusBadge(reg.status)}`}>
                          {reg.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link
                          to={`/drive/${drive._id}`}
                          className="text-orange-500 hover:text-orange-600 font-bold text-xs transition-colors"
                        >
                          View Info &rarr;
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyRegistrations;
