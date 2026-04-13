let chargedArray = []

function formattedDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

function stringToArray(str, callback) {
  const separated = str
    .slice(1, -1)
    .split(',')
    .map(item => item.trim().replace(/"/g, ''))
    .filter(item => item !== 'null' && item !== '');
  return separated.map(callback).join(' '); // returns a string
}

function progressBar(length, progress) {
  if (progress > 0) {
    step = parseInt(progress)

    progress = Number((progress / length) * 100).toFixed(2);
    var html = `<div class="progress progress-sm" style="height: 5px;"><div class="progress-bar" style="width: ${progress}%" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${step}"></div></div>`
  }

  return (progress > 0) ? html : '';
}

function clearSelect(selectElement) {
  while (selectElement.options.length > 0) {
    selectElement.remove(0);
  }
}

function clearInputs(inputElement) {
  if (inputElement && inputElement.tagName === 'INPUT') {
    inputElement.value = '';
  }
}

function populateFundsModal(sourceData) {
  const data = sourceData;

  const container = document.getElementById("fundsChargeToModal");

  const papSelect = container.querySelector("#paps");
  const objSelect = container.querySelector("#class-obj-desc");
  const srcSelect = container.querySelector("#source");
  const charInput = container.querySelector("#amountToCharge")

  clearSelect(papSelect);
  clearSelect(objSelect);
  clearSelect(srcSelect);
  clearInputs(charInput)

  const headers = data[0];
  const sourceIndex = headers.indexOf("SOURCE");

  // Step 1: Group rows by PAP
  const grouped = {};

  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const fnd = row[0];
    const pap = row[1];
    const cls = row[2];
    const obj = `${row[3]} | ${row[4]}`;
    const src = sourceIndex !== -1 ? row[sourceIndex] : null;

    if (!fnd || !pap || !cls) continue;

    // Ensure nested structure exists
    if (!grouped[fnd]) grouped[fnd] = {};
    if (!grouped[fnd][pap]) grouped[fnd][pap] = [];

    grouped[fnd][pap].push({ class: cls, obj, src });

  }

  // console.log("Grouped Data Before Sorting:", grouped);
  // Step 2: Sort PAPs alphabetically (ignoring numeric prefix)
  const sortedGrouped = {};

  Object.entries(grouped).forEach(([fnd, papObj]) => {
    const papEntries = Object.entries(papObj);

    papEntries.sort((a, b) => {
      const aText = a[0].split(" ").slice(1).join(" ");
      const bText = b[0].split(" ").slice(1).join(" ");
      return aText.localeCompare(bText);
    });

    sortedGrouped[fnd] = {};
    papEntries.forEach(([pap, entries]) => {
      sortedGrouped[fnd][pap] = entries.sort((a, b) => a.class.localeCompare(b.class));
    });
  });

  // Step 3: Populate PAP select (with FND context)
  Object.entries(sortedGrouped).forEach(([fnd, papObj]) => {
    Object.keys(papObj).forEach(pap => {
      const option = document.createElement("option");
      option.value = `${fnd}::${pap}`; // keep both FND and PAP
      option.textContent = `${fnd} → ${pap}`;
      papSelect.appendChild(option);
    });
  });

  // Step 4: Update OBJ and SRC selects when PAP changes
  papSelect.addEventListener("change", function () {
    clearSelect(objSelect);
    clearSelect(srcSelect);

    const [fnd, selectedPap] = this.value.split("::");
    if (!fnd || !selectedPap) return;

    const seenObjSrc = new Set();

    sortedGrouped[fnd][selectedPap].forEach(entry => {
      // Populate OBJ
      const objOption = document.createElement("option");
      objOption.value = `${entry.class} | ${entry.obj}`;
      objOption.textContent = `${entry.class} → ${entry.obj}`;
      objOption.dataset.src = entry.src;
      objSelect.appendChild(objOption);

      // Populate SOURCE (unique per OBJ within PAP)
      if (entry.src) {
        const key = `${entry.class}-${entry.obj}-${entry.src}`;
        if (!seenObjSrc.has(key)) {
          seenObjSrc.add(key);
          const srcOption = document.createElement("option");
          srcOption.value = entry.src;
          srcOption.textContent = entry.src;
          srcSelect.appendChild(srcOption);
        }
      }
    });
  });

  // Step 5: Update SRC when OBJ changes
  objSelect.addEventListener("change", function () {
    clearSelect(srcSelect);

    const selectedOption = this.selectedOptions[0];
    if (!selectedOption) return;

    const src = selectedOption.dataset.src;
    if (src) {
      const option = document.createElement("option");
      option.value = src;
      option.textContent = src;
      srcSelect.appendChild(option);
    }
  });

  // Trigger once at start
  if (papSelect.options.length > 0) {
    papSelect.dispatchEvent(new Event("change"));
  }

}

function settingsFundsChargeToModal(target) {


  const container = document.getElementById('fundsChargeToModal');
  const saveBtn = document.getElementById('saveFundsChargedTo');

  if (container && saveBtn) {
    saveBtn.addEventListener('click', () => {

      const selectedInput = document.querySelector('.active input[name*="funds_source_"]:checked');
      const budgetInput = document.getElementById('budget')
      if (!selectedInput) return;

      const selectedValue = selectedInput.value;

      // Get selected values
      const papSelect = container.querySelector('select[name="paps"]');
      const objSelect = container.querySelector('select[name="class_obj_desc"]');
      const srcSelect = container.querySelector('select[name="source"]');
      const amntInput = container.querySelector('input[name="amountToCharge"]')

      const amountValue = getNumericValue(amntInput)

      const fundsArray = {
        funds_source: selectedValue,
        paps: papSelect ? papSelect.value : null,
        cls_obj_desc: objSelect ? objSelect.value : null,
        charge: amntInput ? amountValue : 0
      };

      let fundsText = `${fundsArray.paps} | ${fundsArray.cls_obj_desc}`

      if (selectedValue === 'continuing' && srcSelect) {
        fundsArray.source = srcSelect.value;
        fundsText += ` | ${srcSelect.value}`
      }

      // fundsText += ` | ₱${fundsArray.charge}`

      chargedArray[target] = { ...fundsArray };

      document.body.dataset.fundsAllocation = JSON.stringify(chargedArray);
      budgetInput.value = parseFloat(fundsArray.charge)


      document.querySelector(`#chargedFunds_${target}`).closest('.row').classList.toggle('hidden')
      document.querySelector(`#chargedFunds_${target}`).value = fundsText
      document.querySelector(`#chargedAmount_${target}`).value = fundsArray.charge

      console.log('Funds charged to: ', { target, chargedArray })

      const modalInstance = bootstrap.Modal.getInstance(container);
      modalInstance.hide();

      const group = selectedInput.closest('.form-group');
      if (group) {
        group.classList.add('hidden');
      }

    });
  }
}

function settingsFundsAllocation() {
  const srcSelect = document.querySelector('select#source[name="source"]');
  const funds_sourceRadios = document.querySelectorAll('input[name^="funds_source_"]');

  funds_sourceRadios.forEach(radio => {
    // 

    radio.closest('.row').classList.add('active');


    radio.addEventListener('change', async function (e) {
      e.preventDefault();
      if (this.checked) {
        try {
          const response = await fetch("/funds_source", {
            method: "POST", // or "GET" depending on your API
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({ source_code: this.value })
          });

          if (!response.ok) {
            throw new Error("Network response was not ok");
          }

          srcSelect.parentElement.classList.toggle("hidden", this.value === "current");


          const data = await response.json();

          // Safely extract nested values
          const rawSettings = data?.response?.value;
          if (!rawSettings) {
            console.warn("No response.value found in server data:", data);
            return;
          }

          let dataSettings;
          try {
            dataSettings = JSON.parse(rawSettings);
          } catch (err) {
            console.error("Failed to parse dataSettings:", err, rawSettings);
            return;
          }

          const rawFunds = dataSettings?.data;
          if (!rawFunds) {
            console.warn("No data field found in dataSettings:", dataSettings);
            return;
          }

          let dataFunds;
          try {
            dataFunds = JSON.parse(rawFunds);
          } catch (err) {
            console.error("Failed to parse dataFunds:", err, rawFunds);
            return;
          }

          const fundsValues = dataFunds?.values;
          if (!Array.isArray(fundsValues)) {
            console.warn("fundsValues is not an array:", fundsValues);
            return;
          }

          // console.log("Server response parsed successfully:", { fundsValues });

          populateFundsModal(fundsValues);


          // You can update the UI here based on the response
          // e.g., show a message or update a section of the page
        } catch (error) {
          console.error("Fetch error:", error);
        }

      }
    });
  });

}

export default function configTransactions() {
  return {
    responsive: true,
    order: [[0, 'desc']],
    columnDefs: [
      {
        render: (data, type, row) => {
          const values = JSON.parse(row[7] || '[]');
          const html = values.map(val =>
            `<span class="badge badge-count">${val}</span>`
          ).join(' ');

          const [classification, procurementType] = JSON.parse(row[9]) || [];
          const classification_type = `
            <span data-head="Classification" class="badge badge-secondary mr-2">${classification}</span>
            <span data-head="Procurement Type" class="badge badge-primary mr-2">${procurementType}</span>
          `;

          return `
          <div class="d-flex justify-content-between">
            <div>
              <span class="badge badge-info mr-2">${row[0]}</span>
              ${classification_type}
              <span data-head="BAC Unit" class="badge badge-warning mr-2">${row[10]}</span>
            </div>
            <div>${row[4].display}</div>
          </div>
          ${data}
          <div class="d-flex justify-content-between">
            <div class="requisitioner text-muted">Requisitioner: ${row[2]}</div>
            <div class="codes">${html}</div>
          </div>
          `
        },
        targets: 1
      },
      {
        render: (data, type, row) => {
          const raw = row[6] || '';
          const values = raw.split(',').map(v => v.trim()).filter(Boolean);

          const html = values.map(val => {
            // Safely split on " | "
            const [source, paps, cls, obj, desc] = val.split(' | ');
            const badgeClass = source === 'current' ? 'info' : 'warning';

            return `<span class="badge badge-${badgeClass}" data-bs-toggle="tooltip" data-bs-original-title="${paps}">${cls} | ${obj} | ${desc}</span>`;
          }).join(' ');

          return `
          <div class="d-flex flex-column text-end">
            <h6>${peso(data)}</h6>
            ${html}
          </div>
          `
        },
        targets: 5
      },
      { visible: true, targets: [1, 5, -2] }, //[4, 6, 10, 12, -1]
      { visible: false, targets: '_all' },
    ]
  };
}

document.getElementById('chargingTo')?.addEventListener('click', (e) => {
  if (e.target.matches('input, select')) {
    console.log('Changed:', e.target.name, e.target.value);

    const parts = e.target.name.split('_');
    const index = Number(parts[parts.length - 1]);

    settingsFundsChargeToModal(index);
    settingsFundsAllocation();
  }
});