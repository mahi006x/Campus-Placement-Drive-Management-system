import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../context/AuthContext';

const DriveDetails = () => {
  const { id } = useParams();
  const { user } = useAuth();
  
  const [drive, setDrive] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [registerError, setRegisterError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchDetails = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [driveRes, regRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_URL}/drives/${id}`),
        axios.get(`${import.meta.env.VITE_API_URL}/registrations/my-registrations`),
      ]);
      
      setDrive(driveRes.data);
      const alreadyApplied = regRes.data.some(
        (reg) => reg.driveId?._id === id || reg.driveId === id
      );
      setRegistered(alreadyApplied);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to retrieve details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetails();
  }, [id]);

  const handleRegister = async () => {
    try {
      setRegisterError('');
      setSuccess(false);
      
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/registrations`, {
        driveId: id,
      });

      if (response.status === 201) {
        setSuccess(true);
        setRegistered(true);
        // Refresh details to update seat counts
        await fetchDetails();
      }
    } catch (err) {
      setRegisterError(err.response?.data?.message || 'Failed to submit registration');
    }
  };

  // Eligibility evaluation utility for display
  const checkDetailedEligibility = () => {
    if (!user || !drive) return { eligible: false, reasons: [] };
    const reasons = [];

    const isBranchMatch = drive.eligibleBranches.some(
      (branch) => branch.toLowerCase() === user.branch.toLowerCase()
    );
    if (!isBranchMatch) {
      reasons.push(`Your branch '${user.branch}' is not in the eligible list: ${drive.eligibleBranches.join(', ')}`);
    }

    if (user.cgpa < drive.minCGPA) {
      reasons.push(`Your CGPA of ${user.cgpa.toFixed(2)} is below the required ${drive.minCGPA.toFixed(2)}`);
    }

    if (user.backlogs > drive.maxBacklogs) {
      reasons.push(`You have ${user.backlogs} backlog(s). Maximum allowed is ${drive.maxBacklogs}`);
    }

    return {
      eligible: reasons.length === 0,
      reasons,
    };
  };

  if (loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error || !drive) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12 text-center">
        <div className="bg-red-50 border border-red-200 text-red-750 p-6 rounded-2xl mb-6 font-semibold">
          <p className="text-lg">Error loading drive details</p>
          <p className="text-sm mt-1">{error || 'Placement drive not found.'}</p>
        </div>
        <Link to="/dashboard" className="text-orange-500 hover:underline font-bold">
          &larr; Back to Dashboard
        </Link>
      </div>
    );
  }

  const { eligible, reasons } = checkDetailedEligibility();
  const seatsLeft = drive.seatsAvailable;

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      {/* Header breadcrumb */}
      <div className="mb-6">
        <Link to="/dashboard" className="text-slate-500 hover:text-slate-800 transition-colors duration-200 text-sm font-semibold">
          &larr; Back to Placement Drives
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        {/* Top Info Banner */}
        <div className="border-b border-slate-100 p-8 bg-slate-50/50 relative">
          <div className="absolute top-0 right-0 w-48 h-48 bg-orange-500/5 rounded-full blur-xl"></div>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs font-bold text-orange-600 uppercase tracking-widest bg-orange-50 px-3 py-1 rounded-full border border-orange-200">
                {drive.role}
              </span>
              <h1 className="text-3xl font-extrabold text-slate-900 mt-3">{drive.companyName}</h1>
            </div>
            
            <div className="text-right">
              <span className="block text-[10px] text-slate-500 uppercase tracking-wider font-bold">Package Offered</span>
              <span className="text-2xl font-black text-emerald-600">{drive.packageLPA.toFixed(1)} LPA</span>
            </div>
          </div>
        </div>

        {/* Detailed parameters */}
        <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b border-slate-100 bg-slate-50/20">
          <div>
            <span className="block text-xs text-slate-500 uppercase font-bold">Drive Date</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">
              {new Date(drive.driveDate).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <div>
            <span className="block text-xs text-slate-500 uppercase font-bold">Eligible Branches</span>
            <span className="text-sm font-bold text-slate-800 mt-1 block">
              {drive.eligibleBranches.join(', ')}
            </span>
          </div>

          <div>
            <span className="block text-xs text-slate-500 uppercase font-bold">Registration Limit</span>
            <span className={`text-sm font-bold mt-1 block ${seatsLeft > 0 ? 'text-orange-600' : 'text-red-600'}`}>
              {seatsLeft > 0 ? `${seatsLeft} Seats Available` : 'Fully Booked (0 Seats Left)'}
            </span>
          </div>
        </div>

        {/* Description Body */}
        <div className="p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-3">Job Description</h3>
          <p className="text-slate-600 font-medium text-sm leading-relaxed whitespace-pre-line">
            {drive.description}
          </p>
        </div>

        {/* Eligibility Checkbox Box */}
        <div className="mx-8 mb-8 p-6 bg-slate-50/50 rounded-xl border border-slate-200">
          <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center space-x-2">
            <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="font-bold">Academic Eligibility Verification</span>
          </h3>

          <div className="space-y-3 text-xs text-slate-600 font-medium">
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Required Branches:</span>
              <span className="font-bold text-slate-800">{drive.eligibleBranches.join(', ')}</span>
            </div>
            <div className="flex justify-between border-b border-slate-100 pb-2">
              <span>Minimum Required CGPA:</span>
              <span className="font-bold text-slate-800">{drive.minCGPA.toFixed(2)}</span>
            </div>
            <div className="flex justify-between pb-1">
              <span>Maximum Allowed Backlogs:</span>
              <span className="font-bold text-slate-800">{drive.maxBacklogs}</span>
            </div>
          </div>

          {/* Feedback details */}
          {!eligible && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-xs space-y-1 font-semibold">
              <p className="font-bold">You do not meet the eligibility requirements for this drive:</p>
              <ul className="list-disc pl-4 space-y-0.5">
                {reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
          
          {eligible && seatsLeft > 0 && !registered && (
            <div className="mt-4 bg-emerald-50 border border-emerald-200 text-emerald-700 p-3 rounded-lg text-xs font-semibold">
              &bull; You satisfy all the academic criteria for this campus placement recruitment drive.
            </div>
          )}

          {seatsLeft <= 0 && !registered && (
            <div className="mt-4 bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-xs font-semibold">
              &bull; Registration is blocked because all available seats are fully reserved.
            </div>
          )}
        </div>

        {/* Action Button Segment */}
        <div className="p-8 border-t border-slate-100 bg-slate-50/45 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full md:w-auto">
            {success && (
              <p className="text-emerald-600 font-bold text-sm">
                Successfully registered! Your application status is live.
              </p>
            )}
            {registerError && (
              <p className="text-red-650 font-bold text-sm">
                Error: {registerError}
              </p>
            )}
          </div>

          {registered ? (
            <button
              disabled
              className="w-full md:w-auto px-8 py-3 bg-slate-100 border border-slate-200 text-slate-400 font-bold rounded-xl cursor-not-allowed text-sm"
            >
              Already Registered
            </button>
          ) : !eligible ? (
            <button
              disabled
              className="w-full md:w-auto px-8 py-3 bg-red-50/50 border border-red-150 text-red-400/70 font-bold rounded-xl cursor-not-allowed text-sm"
            >
              Ineligible to Register
            </button>
          ) : seatsLeft <= 0 ? (
            <button
              disabled
              className="w-full md:w-auto px-8 py-3 bg-red-50/50 border border-red-150 text-red-400/70 font-bold rounded-xl cursor-not-allowed text-sm"
            >
              Seats Filled
            </button>
          ) : (
            <button
              onClick={handleRegister}
              className="w-full md:w-auto px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/15 hover:shadow-orange-500/25 transition-all duration-300 text-sm"
            >
              Register for Drive
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriveDetails;
