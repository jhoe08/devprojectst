class Settings {
  constructor() {
    console.log("Settings page initialized");
  }
  
  autocomplete(inputId, suggestionsId, dataType) {
    const dataTypeAttr = document.getElementById(inputId).getAttribute('data-type');

    if(dataTypeAttr !== 'autocomplete') return;

    const input = document.getElementById(inputId);
    const suggestions = document.getElementById(suggestionsId);

    input.addEventListener('input', () => {
      const query = input.value.toLowerCase();
      suggestions.innerHTML = '';
      if (query.length === 0) return;

      // Fetch suggestions based on dataType
      fetch(`/api/employees?query=${query}`)
        .then(response => response.json())
        .then(data => {
          
          const employees = data.response;

          const search = query.toLowerCase();
          
          const filtered = employees.filter(emp =>
            `${emp.firstname} ${emp.lastname}`.toLowerCase().includes(query)
          );

          console.log("Filtered suggestions:", filtered);

          filtered.forEach(item => {
            const li = document.createElement('li');
            li.textContent = `${item.firstname} ${item.lastname}`;
            
            li.addEventListener('click', () => {
              input.value = `${item.firstname} ${item.lastname}`;
              suggestions.innerHTML = '';
            });
            suggestions.appendChild(li);
          });
        });
    });
  }
  autopopulate(target) {
    
  }
  saveSettings() {
    const container = document.getElementById('v-pills-api-icons');
    const inputs = container.querySelectorAll('input, select, textarea');
    const settingsData = [];
    inputs.forEach(input => {
      
      // settingsData[input.id] = input.value;
      settingsData.push({
        key_name: input.id,
        key_value: input.value
      })
    });

    console.log("Settings data to be saved:", settingsData);

    fetch('/settings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(settingsData)
    }) 
    .then(response => response.json())
    .then(data => {
      console.log("Settings save response:", data);
      if (data.success) {
        notifyCustom('bell', 'Success', 'Settings saved successfully.', 'success'); 
      } else {
        notifyCustom('alert', 'Error', 'Failed to save settings.', 'danger'); 
      }
    })
    .catch(error => {
      console.error('Error saving settings:', error);
      notifyCustom('alert', 'Error', 'An error occurred while saving settings.', 'danger'); 
    });
  }
  dropdownFunds(data) {
    if (!data || !data.parsed || !Array.isArray(data.parsed.values)) {
      console.warn('dropdownFunds: invalid or missing data');
      return;
    }

    const rows = data.parsed.values;
    if (rows.length < 2) return; // no data rows

    const headers = rows[0].map(h => String(h).toUpperCase().trim());
    const papIndex = headers.indexOf('PAP');
    if (papIndex === -1) {
      console.warn('dropdownFunds: PAP column not found');
      return;
    }

    const values = new Set();
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i];
      if (!row) continue;
      const val = row[papIndex];
      if (val) values.add(val);
    }

    const input = document.getElementById('fundsAllocation');
    if (!input) {
      console.warn('dropdownFunds: input with id "fundsAllocation" not found');
      return;
    }

    const datalistId = 'fundsAllocation-list';
    let datalist = document.getElementById(datalistId);
    if (!datalist) {
      datalist = document.createElement('datalist');
      datalist.id = datalistId;
      input.setAttribute('list', datalistId);
      if (input.parentNode) input.parentNode.insertBefore(datalist, input.nextSibling);
    } else {
      datalist.innerHTML = '';
    }

    values.forEach(v => {
      const option = document.createElement('option');
      option.value = v;
      datalist.appendChild(option);
    });
  }
  init() {
    this.autocomplete('responsible', 'suggestions', 'employees');

    const saveBtn = document.getElementById('saveIntegration');

    if (saveBtn) {
      fieldsUpdated('#v-pills-api-icons');
      saveBtn.addEventListener('click', () => this.saveSettings())
    }

    // Use querySelectorAll for convenience
    const actionsEdit = document.querySelectorAll('.actionsEdit');

    actionsEdit.forEach(btn => {
      btn.addEventListener('click', () => {
        // Get attributes from the clicked button
        const modalTitle = btn.getAttribute('data-modaltitle');
        const modalBody = JSON.parse(btn.getAttribute('data-modalbody'));

        const settingsModal = document.getElementById('settingsModal')

        // // Populate modal elements
        settingsModal.querySelector('.modal-title').textContent = modalTitle;

        // Example: autopopulate fields inside modal
        settingsModal.querySelector('#key').value = modalBody.key;
        settingsModal.querySelector('#meaning').value = modalBody.stands;
        settingsModal.querySelector('#email').value = modalBody.email;
        settingsModal.querySelector('#responsible').value = modalBody.responsible.name;
      });
    });
  }

}

const settingsPage = new Settings();
settingsPage.init();

fetch('/api/sheets?sheetId=1alv_rcdABMcTuS7q5OBez9_CDboToPvmjXNRn2GI9pM&range=ALL%20CURRENT')
  .then(r => r.json())
  .then(data => settingsPage.dropdownFunds(data))
  .catch(err => console.error('sheet fetch error', err));
