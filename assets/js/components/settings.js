(()=>{
    const addMoreFieldButton = document.getElementById('addMoreFieldButtonsss') // WORKING NI
    const addMoreFieldButtons = document.querySelectorAll('#addMoreFieldButton')
    const saveSettings = document.getElementById('saveSettings')
    const removeBtn = document.querySelectorAll('.fa-minus')

    const settingsModal = document.getElementById('settingsModal')

    const settingsAPI = '/settings'

    let settings = {
        site: { contacts: {}},
        divisions: {}
    }

    const buttonHandler = {
        removeElem: function (elem) {
            const row = this.closest('.row')
            if (row && row !== row.parentElement.querySelector('.row:first-child')) {
                row.remove()
            }
        }
    }

    const {removeElem} = buttonHandler

    if (addMoreFieldButton){
        let rowCount = 1;
        addMoreFieldButton.addEventListener('click', function(){

            const row = document.querySelector('#divisionFields > .row')

            const clonedForm = row.cloneNode(true); 

            const labels = clonedForm.querySelectorAll('label')
            const inputs = clonedForm.querySelectorAll('input, select, button');
            
            inputs.forEach(input => {
                // Generate new ID based on current row count
                const newId = input.id.split('-')[0] + rowCount; // Assuming ID pattern is like "divisions-1"
                input.id = newId; // Update the ID attribute
                input.value = ''; // Clear the value
            });

            labels.forEach(label => {
                const inputId = label.getAttribute('for');
                const baseId = inputId.split('-')[0];
                label.setAttribute('for', baseId + rowCount);
            })

            // Add a "Remove" button to the cloned row
            const removeButton = clonedForm.querySelector('.fa-minus');
            removeButton.addEventListener('click', function() {
                clonedForm.remove(); // Remove the clicked row
            });
            
            // Update the row count
            rowCount++;
            
            // Append the cloned row to the form container
            const formContainer = document.getElementById('divisionFields');
            formContainer.appendChild(clonedForm);
        })
    }

    if (addMoreFieldButtons) {
        let rowCount = 1;
        addMoreFieldButtons.forEach(addMoreField => {
            addMoreField.addEventListener('click', function(){
                const row = document.querySelector('.active .card-body > .row')

                const clonedForm = row.cloneNode(true); 

                const labels = clonedForm.querySelectorAll('label')
                const inputs = clonedForm.querySelectorAll('input, select, button');
                
                inputs.forEach(input => {
                    // Generate new ID based on current row count
                    const newId = input.id.split('-')[0] + rowCount; // Assuming ID pattern is like "divisions-1"
                    input.id = newId; // Update the ID attribute
                    input.value = ''; // Clear the value
                });

                labels.forEach(label => {
                    const inputId = label.getAttribute('for');
                    const baseId = inputId.split('-')[0];
                    label.setAttribute('for', baseId + rowCount);
                })
                // Add a "Remove" button to the cloned row
                const removeButton = clonedForm.querySelector('.fa-minus');
                removeButton.addEventListener('click', function() {
                    clonedForm.remove(); // Remove the clicked row
                });
                // Update the row count
                rowCount++;
                
                // Append the cloned row to the form container
                const formContainer = document.querySelector('.active .card .card-body');
                formContainer.appendChild(clonedForm);
            })
        })
    }

    if (removeBtn) {
        
        removeBtn.forEach(btn => {
            console.log(btn)
            btn.addEventListener('click', removeElem)
        })
    }
    
    if (settingsModal) {
        settingsModal.addEventListener('show.bs.modal', function(event){
            const target = event.relatedTarget;
            let { key, stands, email, responsible } = JSON.parse(target.dataset.modalbody);
            const modal = this;
            const modalTitle = modal.querySelector('.modal-title');
        
            console.log(modal);
        
            // Query the correct elements by their unique IDs
            const keyContainer = modal.querySelector('#key');
            const standsContainer = modal.querySelector('#meaning');  // Make sure 'stands' is a unique ID in the modal
            const emailContainer = modal.querySelector('#email');  // Make sure 'email' is a unique ID in the modal
            const personContainer = modal.querySelector('#responsible');  // Make sure 'person' is a unique ID in the modal
        
            // Set values
            modalTitle.textContent = target.dataset.modaltitle;
            keyContainer.value = key;
            standsContainer.value = stands;
            emailContainer.value = email;
            personContainer.value = responsible;
        });
        
    }

    // Saving Data to Storage
    if (saveSettings){  
        fieldsUpdated('#v-pills-with-icon-tabContent')
        saveSettings.addEventListener('click', function(){
            const site_name = document.getElementById('site_name')
            const site_tagline = document.getElementById('site_tagline')
            const site_address = document.getElementById('site_address')
            const site_email = document.getElementById('site_email')
            const site_phone = document.getElementById('site_phone')
            
            const divisionFields = document.getElementById('divisionFields')
            const fields = divisionFields.querySelectorAll('.row')
            
            settings['site']['name'] = site_name.value
            settings['site']['tagline'] = site_tagline.value
            settings['site']['address'] = site_address.value
            settings['site']['contacts']['email'] = site_email.value
            settings['site']['contacts']['phone'] = site_phone.value

                fields.forEach(field => {
                    let abbrv = field.querySelector('input[name="division_abbrv"]')
                    let name = field.querySelector('input[name="division_name"]')
                    let email = field.querySelector('input[name="division_email"]')
    
                    abbrv = abbrv.value
                    name = name.value
                    email = email.value
                    
                    settings['divisions'][abbrv]= {name, email}
    
                })
                console.log(settings)
                const requestOptions = {
                    method: 'POST',
                    headers: {
                    'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(settings)
                };
          
              console.log(requestOptions)
          
              fetch(settingsAPI, requestOptions)
              .then(response => {
                if (!response.ok) {
                  // throw new Error('Network response was not ok');
                  notifyCustom('bell', 'System Error', 'Network response was not ok!', 'danger')
                }
                return response.json();
              })
              .then(data => {
                if(!data) {
                  notifyCustom('bell', 'Error', 'Failed to send the Communication', 'danger')
                  return
                }
                notifyCustom('bell', 'Saved', 'Successfully save settings', 'success')
              })
              .catch(error => {
                  notifyCustom('bell', 'Failed to fetch data', error, 'danger')
              });
        })
    }

    

})()