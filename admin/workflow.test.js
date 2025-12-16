import { describe, it, expect } from 'vitest';
import { getNextApprover, getRequestor } from './workflow';

describe('Workflow Helpers', () => {
  it('test_getNextApprover_validData', () => {
    const currentStep = 1;
    const approvalSteps = [
      { id: 1, steps_title: 'Manager' },
      { id: 2, steps_title: 'Director' }
    ];
    const employees = [
      { employeeid: 1, experience: JSON.stringify({ lists: [{ position: 'Director' }] }) },
      { employeeid: 2, experience: JSON.stringify({ lists: [{ position: 'Manager' }] }) }
    ];

    const result = getNextApprover(currentStep, approvalSteps, employees);
    expect(result).toEqual(employees[0]);
  });

  it('test_getRequestor_validTransaction', () => {
    const transaction = { requisitioner: 1 };
    const employees = [
      { employeeid: 1, experience: JSON.stringify({ lists: [{ position: 'Director' }] }) },
      { employeeid: 2, experience: JSON.stringify({ lists: [{ position: 'Manager' }] }) }
    ];

    const result = getRequestor(transaction, employees);
    console.log('Requestor:', result);
    expect(result).toEqual(employees[0]);
  });

  it('test_getNextApprover_multipleMatches', () => {
    const currentStep = 1;
    const approvalSteps = [
      { id: 1, steps_title: 'Manager' },
      { id: 2, steps_title: 'Director' }
    ];
    const employees = [
      { employeeid: 1, experience: JSON.stringify({ lists: [{ position: 'Director' }] }) },
      { employeeid: 2, experience: JSON.stringify({ lists: [{ position: 'Director' }] }) }
    ];

    const result = getNextApprover(currentStep, approvalSteps, employees);
    expect(result).toEqual(employees[0]);
  });

  it('test_getNextApprover_noNextStep', () => {
    const currentStep = 2;
    const approvalSteps = [
      { id: 1, steps_title: 'Manager' },
      { id: 2, steps_title: 'Director' }
    ];
    const employees = [
      { employeeid: 1, experience: JSON.stringify({ lists: [{ position: 'Director' }] }) },
      { employeeid: 2, experience: JSON.stringify({ lists: [{ position: 'Manager' }] }) }
    ];

    const result = getNextApprover(currentStep, approvalSteps, employees);
    expect(result).toBeNull();
  });

  it('test_getNextApprover_noMatchingEmployee', () => {
    const currentStep = 1;
    const approvalSteps = [
      { id: 1, steps_title: 'Manager' },
      { id: 2, steps_title: 'Director' }
    ];
    const employees = [
      { employeeid: 1, experience: JSON.stringify({ lists: [{ position: 'Intern' }] }) },
      { employeeid: 2, experience: JSON.stringify({ lists: [{ position: 'Intern' }] }) }
    ];

    const result = getNextApprover(currentStep, approvalSteps, employees);
    expect(result).toBeNull();
  });

  it('test_getRequestor_nonExistentRequisitioner', () => {
    const transaction = { requisitioner: 3 };
    const employees = [
      { employeeid: 1, experience: JSON.stringify({ lists: [{ position: 'Director' }] }) },
      { employeeid: 2, experience: JSON.stringify({ lists: [{ position: 'Manager' }] }) }
    ];

    const result = getRequestor(transaction, employees);
    expect(result).toBeNull();
  });
});