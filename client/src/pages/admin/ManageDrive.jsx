import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const ManageDrive = () => {
  const { id } = useParams(); // If ID is present, we are in EDIT mode
  const isEditMode = !!id;
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    packageLPA: '',
    eligibleBranches: [],
    minCGPA: '',
    maxBacklogs: '',
    driveDate: '',
    description: '',
    seatsAvailable: '30',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const branchesList = ['CSE', 'ECE', 'MECH', 'EEE', 'CIVIL'];

  useEffect(() => {
    if (isEditMode) {
      const fetchDrive = async () => {
        try {
          setLoading(true);
          const response = await axios.get(`${import.meta.env.VITE_API_URL}/drives/${id}`);
          const drive = response.data;
          
          // Format date for datetime-local input (yyyy-MM-ddThh:mm)
          const formattedDate = drive.driveDate
            ? new Date(drive.driveDate).toISOString().slice(0, 16)
            : '';

          setFormData({
            companyName: drive.companyName,
            role: drive.role,
            packageLPA: drive.packageLPA.toString(),
            eligibleBranches: drive.eligibleBranches,
            minCGPA: drive.minCGPA.toString(),
            maxBacklogs: drive.maxBacklogs.toString(),
            driveDate: formattedDate,
            description: drive.description,
            seatsAvailable: drive.seatsAvailable.toString(),
          });
        } catch (err) {
          setError(err.response?.data?.message || 'Failed to fetch drive details for editing');
        } finally {
          setLoading(false);
        }
      };
      fetchDrive();
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleBranchChange = (branch) => {
    const currentBranches = [...formData.eligibleBranches];
    if (currentBranches.includes(branch)) {
      setFormData({
        ...formData,
        eligibleBranches: currentBranches.filter((b) => b !== branch),
      });
    } else {
      setFormData({
        ...formData,
        eligibleBranches: [...currentBranches, branch],
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const {
      companyName,
      role,
      packageLPA,
      eligibleBranches,
      minCGPA,
      maxBacklogs,
      driveDate,
      description,
      seatsAvailable,
    } = formData;

    // Standard check
    if (
      !companyName ||
      !role ||
      packageLPA === '' ||
      eligibleBranches.length === 0 ||
      minCGPA === '' ||
      maxBacklogs === '' ||
      !driveDate ||
      !description ||
      seatsAvailable === ''
    ) {
      setError('Please fill in all fields and select at least one branch');
      return;
    }

    // Range checks
    const parsedPackage = parseFloat(packageLPA);
    if (isNaN(parsedPackage) || parsedPackage < 0) {
      setError('Package (LPA) cannot be negative');
      return;
    }

    const parsedCGPA = parseFloat(minCGPA);
    if (isNaN(parsedCGPA) || parsedCGPA < 0 || parsedCGPA > 10) {
      setError('Minimum CGPA requirement must be between 0.0 and 10.0');
      return;
    }

    const parsedBacklogs = parseInt(maxBacklogs, 10);
    if (isNaN(parsedBacklogs) || parsedBacklogs < 0) {
      setError('Maximum backlogs allowed cannot be negative');
      return;
    }

    const parsedSeats = parseInt(seatsAvailable, 10);
    if (isNaN(parsedSeats) || parsedSeats < 0) {
      setError('Seats available cannot be negative');
      return;
    }

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const submissionData = {
        companyName,
        role,
        packageLPA: parsedPackage,
        eligibleBranches,
        minCGPA: parsedCGPA,
        maxBacklogs: parsedBacklogs,
        driveDate: new Date(driveDate),
        description,
        seatsAvailable: parsedSeats,
      };

      if (isEditMode) {
        await axios.put(`${import.meta.env.VITE_API_URL}/drives/${id}`, submissionData);
        setSuccess('Placement drive updated successfully!');
      } else {
        await axios.post(`${import.meta.env.VITE_API_URL}/drives`, submissionData);
        setSuccess('Placement drive created successfully!');
        // Reset form
        setFormData({
          companyName: '',
          role: '',
          packageLPA: '',
          eligibleBranches: [],
          minCGPA: '',
          maxBacklogs: '',
          driveDate: '',
          description: '',
          seatsAvailable: '30',
        });
      }

      setTimeout(() => {
        navigate('/admin');
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process placement drive');
    } finally {
      setLoading(false);
    }
  };

  if (loading && isEditMode && !formData.companyName) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 animate-fade-in">
      <div className="mb-6">
        <Link to="/admin" className="text-slate-500 hover:text-slate-800 transition-colors duration-200 text-sm font-semibold">
          &larr; Back to Admin Dashboard
        </Link>
      </div>

      <div className="bg-white border border-slate-200 rounded-2xl shadow-md overflow-hidden">
        <div className="p-8 border-b border-slate-200 bg-slate-50/50">
          <h1 className="text-2xl font-black text-slate-900">
            {isEditMode ? 'Edit Placement Drive' : 'Create New Placement Drive'}
          </h1>
          <p className="text-sm text-slate-500 font-medium mt-1">
            {isEditMode
              ? 'Modify details and eligibility constraints for this recruiter'
              : 'Add details and set registration requirements for a new placement opportunity'}
          </p>
        </div>

        {error && (
          <div className="m-8 bg-red-50 border border-red-200 text-red-700 p-4 rounded-xl text-sm font-semibold">
            {error}
          </div>
        )}

        {success && (
          <div className="m-8 bg-emerald-50 border border-emerald-250 text-emerald-700 p-4 rounded-xl text-sm font-semibold">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Company and role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. Capgemini"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Job Role / Designation
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Software Development Intern"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Package and Drive date and Seats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Package (LPA)
              </label>
              <input
                type="number"
                step="0.1"
                name="packageLPA"
                value={formData.packageLPA}
                onChange={handleChange}
                placeholder="e.g. 6.5"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Scheduled Drive Date
              </label>
              <input
                type="datetime-local"
                name="driveDate"
                value={formData.driveDate}
                onChange={handleChange}
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 outline-none transition-all duration-300 cursor-pointer"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Total Seats Available
              </label>
              <input
                type="number"
                name="seatsAvailable"
                value={formData.seatsAvailable}
                onChange={handleChange}
                placeholder="e.g. 30"
                className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Job Description & Details
            </label>
            <textarea
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe roles, responsibilities, recruitment rounds, training details, etc."
              className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300 resize-none leading-relaxed"
            ></textarea>
          </div>

          {/* Academic Eligibility Controls */}
          <div className="border-t border-slate-100 pt-6">
            <h3 className="text-sm font-extrabold text-orange-500 uppercase tracking-wider mb-4">Academic Eligibility Rules</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Minimum CGPA Required (0.0 - 10.0)
                </label>
                <input
                  type="number"
                  step="0.01"
                  name="minCGPA"
                  value={formData.minCGPA}
                  onChange={handleChange}
                  placeholder="e.g. 7.5"
                  className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Maximum Backlogs Allowed
                </label>
                <input
                  type="number"
                  name="maxBacklogs"
                  value={formData.maxBacklogs}
                  onChange={handleChange}
                  placeholder="e.g. 0"
                  className="w-full bg-white border border-slate-300 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 rounded-xl px-4 py-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition-all duration-300"
                />
              </div>
            </div>

            {/* Checkbox multi-select branches */}
            <div className="mt-6">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Eligible Branches (Select at least one)
              </label>
              <div className="flex flex-wrap gap-4">
                {branchesList.map((branch) => {
                  const isChecked = formData.eligibleBranches.includes(branch);
                  return (
                    <div
                      key={branch}
                      onClick={() => handleBranchChange(branch)}
                      className={`flex items-center space-x-2 border rounded-xl px-4 py-2 text-sm cursor-pointer select-none transition-all duration-300 ${
                        isChecked
                          ? 'bg-orange-55/10 border-orange-500 text-orange-650 shadow-md font-semibold'
                          : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-slate-500 font-semibold'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={isChecked}
                        readOnly
                        className="hidden"
                      />
                      <span>{branch}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Form buttons */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="px-6 py-3 border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-xl text-sm font-semibold transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm shadow-lg shadow-orange-500/15 transition-all duration-300 flex items-center space-x-2"
            >
              {loading ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <span>{isEditMode ? 'Update Drive' : 'Schedule Drive'}</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ManageDrive;
