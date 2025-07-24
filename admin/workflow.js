// Workflow/approval helpers for transactions
const connection = require('./database');
const { getEmployeeById } = require('./utils');

/**
 * Get the next approver for a transaction step
 * @param {number} currentStep - Current step number
 * @param {Array} approvalSteps - Array of approval steps
 * @returns {Object|null} Next approver info or null
 */
function getNextApprover(currentStep, approvalSteps, employees) {
  const nextStep = approvalSteps.find(step => step.id === currentStep + 1);
  if (!nextStep) return null;
  // Find employee(s) responsible for this step (customize as needed)
  // Example: match by role or section name
  const match = employees.find(e => {
    const exp = JSON.parse(e.experience);
    return (
      exp.lists &&
      (exp.lists[0]?.position === nextStep.steps_title ||
        exp.lists[0]?.division === nextStep.steps_title)
    );
  });
  return match || null;
}

/**
 * Get the requestor (end-user) for a transaction
 * @param {Object} transaction - Transaction object
 * @param {Array} employees - All employees
 * @returns {Object|null}
 */
function getRequestor(transaction, employees) {
  return employees.find(e => String(e.employeeid) === String(transaction.requisitioner)) || null;
}

module.exports = {
  getNextApprover,
  getRequestor
};
