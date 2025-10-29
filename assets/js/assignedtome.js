const main = {
  assignTransaction: () => {
    console.log('Assign Transaction Module Loaded');
    const assignBtn = document.getElementById('assignedto');
    const transactions = document.getElementById('assignedTransactions').value;
    const payload = { transactions };
    
    console.log({transactions});
    assignBtn.addEventListener('click', () => {
      fetch('/transactions/assignedto', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      alert('Transactions assigned to you successfully!');
    }); 
  },
};

document.addEventListener('DOMContentLoaded', () => {
  main.assignTransaction();
});