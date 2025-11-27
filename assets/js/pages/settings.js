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
    });
  }
  init() {
    this.autocomplete('responsible', 'suggestions', 'employees');

    const saveBtn = document.getElementById('saveIntegration');
    if (saveBtn) {
      fieldsUpdated('#v-pills-api-icons');
      saveBtn.addEventListener('click', () => this.saveSettings())
    }
  }

}

const settingsPage = new Settings();
settingsPage.init();