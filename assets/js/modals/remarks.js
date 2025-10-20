"use strict";
const createRemarks = document.getElementById('createRemarks')

if(createRemarks) {
    let comment = document.querySelector('#comment')
    let assignedto = document.querySelector('#assignedto')
    let refreshActivity = document.getElementById('refreshActivity')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    createRemarks.addEventListener('click', async () => {
        console.log(createRemarks)
        try {
            let selectedStatus = document.querySelector('input[name="color"]:checked');
            let selectedPeriod = document.querySelectorAll('input[name="period"]');
            let {transid} = createRemarks.dataset
            let selectedStatusValue = selectedStatus.value
            
            const checkedCheckboxes = Array.from(selectedPeriod)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseFloat(checkbox.value))
            .reduce((sum, value) => sum + value, 0);
        
            let preloaded = { 
                comment: comment.value, 
                refid: transid, 
                status: selectedStatusValue,
                dueDate: checkedCheckboxes,
                assignedto: assignedto.checked,
            }
            console.log(preloaded)
            const apiUrl = '/remarks/new'
        
            const requestOptions = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(preloaded)
            };
        
            fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    // throw new Error('Network response was not ok');
                    notifyCustom('bell', 'System Issue', 'Network response was not ok!', 'danger')
                }
                return response.json();
            })
            .then(data => {
                if(!data) {
                    notifyCustom('bell', 'Error', 'Failed to create new remarks', 'danger')
                }
        
                let {message} = data
                if(refreshActivity) {
                    refreshActivity.click()
                }
                
                // clearing fields
                selectedStatus.checked = false
                comment.value = ''
                // return notifications
                notifyCustom('check', `${message}`, 'Successfully added the remarks on the transactions!', 'success')
            })
            .catch(error => {
                notifyCustom('exclamation', `There was an error on the system!`, `${error}`, 'danger')
            });
        } catch (error) {
            notifyCustom('exclamation', `Field is empty please check!`, `${error}`, 'danger')
        }
    })
}

