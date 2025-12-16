const main = {
  assignTransaction: () => {
    // console.log('Assign Transaction Module Loaded');
    const assignBtn = document.getElementById('assignedto');
   
    assignBtn.addEventListener('click', () => {
      const transactions = document.getElementById('assignedTransactions').value;

      if(transactions === '') { return; } // No transactions selected

      const payload = { transactions };

      fetch('/transactions/assign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      })
      .then((response) => response.json())
      .then((data) => {
        if (data.status !== 200) {
          notifyCustom('bell', 'Error', 'Failed to assign transactions', 'error');
          return;
        } 
        console.log('Success:', data);
        return notifyCustom('bell', 'Success', 'Transactions assigned successfully', 'success');
      })
      .catch((error) => {
        console.error('Error:', error);
        return notifyCustom('bell', 'Error', 'Unexpected error occurred', 'error');
      });
      // alert('Transactions assigned to you successfully!');
    }); 
  },
};

document.addEventListener('DOMContentLoaded', () => {
  main.assignTransaction();
});