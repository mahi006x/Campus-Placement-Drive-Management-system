/**
 * Centralized utility to verify if a student is eligible for a placement drive.
 * @param {Object} student - The student user data (branch, cgpa, backlogs).
 * @param {Object} drive - The drive data (eligibleBranches, minCGPA, maxBacklogs).
 * @returns {Object} - Object containing `eligible` (boolean) and optionally `reason` (string).
 */
function checkEligibility(student, drive) {
  if (!student || !drive) {
    return { eligible: false, reason: 'Invalid student or drive data provided' };
  }

  // Branch check
  const isBranchEligible = drive.eligibleBranches.some(
    (branch) => branch.toLowerCase() === student.branch.toLowerCase()
  );
  if (!isBranchEligible) {
    return {
      eligible: false,
      reason: `Branch '${student.branch}' is not eligible. Eligible branches: ${drive.eligibleBranches.join(', ')}`,
    };
  }

  // CGPA check
  if (student.cgpa < drive.minCGPA) {
    return {
      eligible: false,
      reason: `CGPA is below the minimum requirement. Required: ${drive.minCGPA.toFixed(2)}, Your CGPA: ${student.cgpa.toFixed(2)}`,
    };
  }

  // Backlogs check
  if (student.backlogs > drive.maxBacklogs) {
    return {
      eligible: false,
      reason: `Backlogs exceed maximum allowance. Allowed: ${drive.maxBacklogs}, Your backlogs: ${student.backlogs}`,
    };
  }

  return { eligible: true };
}

module.exports = { checkEligibility };
