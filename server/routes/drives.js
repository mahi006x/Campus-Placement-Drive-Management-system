const express = require('express');
const router = express.Router();
const Drive = require('../models/Drive');
const { protect, adminOnly } = require('../middleware/auth');

/**
 * @route   GET /api/drives
 * @desc    Get all drives (upcoming or active)
 * @access  Private
 */
router.get('/', protect, async (req, res) => {
  try {
    // Sort by driveDate ascending, so nearest drives come first
    const drives = await Drive.find().sort({ driveDate: 1 });
    return res.json(drives);
  } catch (error) {
    console.error('Fetch drives error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving placement drives' });
  }
});

/**
 * @route   GET /api/drives/:id
 * @desc    Get details of a specific placement drive
 * @access  Private
 */
router.get('/:id', protect, async (req, res) => {
  try {
    const drive = await Drive.findById(req.id || req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }
    return res.json(drive);
  } catch (error) {
    console.error('Fetch drive by ID error:', error.message);
    return res.status(500).json({ message: 'Server error retrieving drive details' });
  }
});

/**
 * @route   POST /api/drives
 * @desc    Create a new placement drive
 * @access  Private/Admin
 */
router.post('/', protect, adminOnly, async (req, res) => {
  try {
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
    } = req.body;

    // Validation
    if (
      !companyName ||
      !role ||
      packageLPA === undefined ||
      !eligibleBranches ||
      minCGPA === undefined ||
      maxBacklogs === undefined ||
      !driveDate ||
      !description
    ) {
      return res.status(400).json({ message: 'Please provide all required drive fields' });
    }

    if (packageLPA < 0) {
      return res.status(400).json({ message: 'Package LPA cannot be negative' });
    }

    if (minCGPA < 0 || minCGPA > 10) {
      return res.status(400).json({ message: 'Minimum CGPA requirement must be between 0.0 and 10.0' });
    }

    if (maxBacklogs < 0) {
      return res.status(400).json({ message: 'Maximum allowed backlogs cannot be negative' });
    }

    if (seatsAvailable !== undefined && seatsAvailable < 0) {
      return res.status(400).json({ message: 'Seats available count cannot be negative' });
    }

    if (!Array.isArray(eligibleBranches) || eligibleBranches.length === 0) {
      return res.status(400).json({ message: 'Please select at least one eligible branch' });
    }

    const drive = await Drive.create({
      companyName,
      role,
      packageLPA: Number(packageLPA),
      eligibleBranches,
      minCGPA: Number(minCGPA),
      maxBacklogs: Number(maxBacklogs),
      driveDate: new Date(driveDate),
      description,
      seatsAvailable: seatsAvailable !== undefined ? Number(seatsAvailable) : 30,
      createdBy: req.user._id,
    });

    return res.status(201).json(drive);
  } catch (error) {
    console.error('Create drive error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error creating placement drive' });
  }
});

/**
 * @route   PUT /api/drives/:id
 * @desc    Update placement drive details
 * @access  Private/Admin
 */
router.put('/:id', protect, adminOnly, async (req, res) => {
  try {
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
    } = req.body;

    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    // Validation
    if (packageLPA !== undefined && packageLPA < 0) {
      return res.status(400).json({ message: 'Package LPA cannot be negative' });
    }

    if (minCGPA !== undefined && (minCGPA < 0 || minCGPA > 10)) {
      return res.status(400).json({ message: 'Minimum CGPA requirement must be between 0.0 and 10.0' });
    }

    if (maxBacklogs !== undefined && maxBacklogs < 0) {
      return res.status(400).json({ message: 'Maximum allowed backlogs cannot be negative' });
    }

    if (seatsAvailable !== undefined && seatsAvailable < 0) {
      return res.status(400).json({ message: 'Seats available count cannot be negative' });
    }

    if (eligibleBranches !== undefined && (!Array.isArray(eligibleBranches) || eligibleBranches.length === 0)) {
      return res.status(400).json({ message: 'Please select at least one eligible branch' });
    }

    // Apply updates (Note: existing registrations are not retroactively invalidated, they remain unchanged)
    drive.companyName = companyName || drive.companyName;
    drive.role = role || drive.role;
    drive.packageLPA = packageLPA !== undefined ? Number(packageLPA) : drive.packageLPA;
    drive.eligibleBranches = eligibleBranches || drive.eligibleBranches;
    drive.minCGPA = minCGPA !== undefined ? Number(minCGPA) : drive.minCGPA;
    drive.maxBacklogs = maxBacklogs !== undefined ? Number(maxBacklogs) : drive.maxBacklogs;
    drive.driveDate = driveDate ? new Date(driveDate) : drive.driveDate;
    drive.description = description || drive.description;
    drive.seatsAvailable = seatsAvailable !== undefined ? Number(seatsAvailable) : drive.seatsAvailable;

    const updatedDrive = await drive.save();
    return res.json(updatedDrive);
  } catch (error) {
    console.error('Update drive error:', error.message);
    return res.status(500).json({ message: error.message || 'Server error updating drive' });
  }
});

/**
 * @route   DELETE /api/drives/:id
 * @desc    Delete a placement drive
 * @access  Private/Admin
 */
router.delete('/:id', protect, adminOnly, async (req, res) => {
  try {
    const drive = await Drive.findById(req.params.id);
    if (!drive) {
      return res.status(404).json({ message: 'Placement drive not found' });
    }

    await drive.deleteOne();
    return res.json({ message: 'Placement drive deleted successfully' });
  } catch (error) {
    console.error('Delete drive error:', error.message);
    return res.status(500).json({ message: 'Server error deleting placement drive' });
  }
});

module.exports = router;
