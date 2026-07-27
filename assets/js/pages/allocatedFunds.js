"use strict";

const allocatedFunds = {
    syncFunds() {
        fetch('/api/allocatedFunds', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
        })
        .then(response => {
            console.log(response)
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log('Funds synced successfully:', data);
        })
        .catch(err => {
            console.error('Error syncing funds:', err);
        });
    }

}

export default { ...allocatedFunds }