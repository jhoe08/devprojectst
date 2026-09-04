let chargedArray = []

function trimFullName() {
  // Select the element containing the attribute
  const el = document.querySelector('[data-responsible]');

  if (el) {
    // Get the raw HTML-encoded JSON string
    const raw = el.getAttribute('data-responsible');

    try {
      // Decode and parse the string
      const responsibleData = JSON.parse(raw);

      // Access the names
      const divisionName = responsibleData.division?.name;
      const sectionName = responsibleData.section?.name;

      // Optionally format to initials
      const formatName = full => {
        if (!full || typeof full !== 'string') return '';
        const parts = full.trim().split(' ');
        return parts.length ? `${parts[0][0].toUpperCase()}. ${parts.at(-1)}` : '';
      };

      const formattedDivision = formatName(divisionName);
      const formattedSection = formatName(sectionName);

      const parts = [formattedDivision, formattedSection].filter(Boolean);

      return parts.join(' / ');

    } catch (err) {
      console.error('Invalid JSON in data-responsible:', err);
    }
  }
}


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

      const activeSection = document.querySelector('.active')
      const target = activeSection.dataset.id

      // const selectedInput = document.querySelector('.active input[name*="funds_source_"]:checked');
      const selectedInput = activeSection.querySelector(`input[name*="funds_source_${target}"]:checked`)
      const budgetInput = document.querySelector('#budget')
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

      const totalCharge = Object.values(chargedArray).reduce((sum, entry) => {
        return sum + (parseFloat(entry.charge) || 0);
      }, 0);

      document.body.dataset.fundsAllocation = JSON.stringify(chargedArray);
      budgetInput.value = totalCharge

      console.log(budgetInput.value)


      // document.querySelector(`.active #chargedFunds_${target}`).closest('.row').classList.toggle('hidden')
      document.querySelector(`.active #chargedFunds_${target}`).value = fundsText
      document.querySelector(`.active #chargedAmount_${target}`).value = fundsArray.charge

      console.log('Funds charged to: ', { target, chargedArray })

      const modalInstance = bootstrap.Modal.getInstance(container);
      modalInstance.hide();

      const group = selectedInput.closest('.form-group');
      if (group) {
        //group.classList.add('hidden');
      }

    }, { once: true }); // listener runs only once
  }
}

function settingsFundsAllocation(target) {
  const srcSelect = document.querySelector('select#source[name="source"]');
  const funds_sourceRadios = document.querySelectorAll('input[name^="funds_source_"]');



  funds_sourceRadios.forEach(radio => {

    radio.addEventListener('change', async function (e) {
      console.log('asdfasdfasdf')

      document.getElementById('fundSourceLists')
        .querySelectorAll('.row')
        .forEach(row => row.classList.remove('active'));

      radio.closest('.row').classList.add('active');

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
            // dataFunds = JSON.parse(rawFunds);
            dataFunds = rawFunds
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
          const html = values
            .filter(val => val && val.trim() !== "") // remove empty or whitespace-only
            .map(val => `<span class="badge badge-count">${val}</span>`)
            .join(' ');

          // const [classification, procurementType] = JSON.parse(row[9]) || [];
          const classification = row[9];
          const procurementType = row[13]
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
          // console.log(row[6])

          const raw = row[6] || '';
          const values = raw.split(',').map(v => v.trim()).filter(Boolean);

          const html = values.map(val => {
            // Safely split on " | "
            const [fund, meta] = val.split('::')
            const [paps, cls, obj, desc, source] = meta.split(' | ').filter(Boolean);
            const badgeClass = source === undefined ? 'info' : 'warning';

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
      { visible: true, targets: [1, 5, -3] }, //[4, 6, 10, 12, -1]
      { visible: false, targets: '_all' },
    ]
  };
}

function createTransaction() {
  let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
  let prClassification = document.querySelector('#prClassification')
  let procurementType = document.querySelector('#procurementType')
  let requisitioner = document.querySelector('#requisitioner')
  let division = document.querySelector('#divisions')
  let budget = document.querySelector('#budget')
  // let fundSource = document.querySelector('#fundSource')
  const chargingTo = document.getElementById('chargingTo')
  let bannerProgram = document.querySelector('#bannerProgram')
  let bacUnit = document.querySelector('#bacUnit')
  let remarks = document.querySelector('#remarks')
  const created_by = document.querySelector('#created_by')
  const responsibleData = created_by.dataset.responsible ? JSON.parse(created_by.dataset.responsible) : null;

  // console.log({ responsibleData })

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  if (requisitioner?.value) {
    requisitioner.value = trimFullName()
  }


  if (responsibleData || Object.keys(responsibleData ?? {}).length === 0) {
    console.error('No responsible data found');
    return;
    // requisitioner.closest('.form-group').classList.add('has-error');
    // requisitioner.closest('.form-group').querySelector('.input-icon').classList.add('text-danger');
  }

  createTransactions?.addEventListener('click', async () => {
    try {
      // 🔄 Collect fund source data
      // const charges = Array.from(chargingTo.querySelectorAll(':scope > .row')).map(fund => {
      //   const inputValue = fund.querySelector('input[name*="chargedFunds_"]').value;
      //   const amountValue = fund.querySelector('input[name*="chargedAmount_"]').value;

      //   return {
      //     source: inputValue,
      //     amount: amountValue,
      //   }
      // });

      const charges = Array.from(chargingTo.querySelectorAll(':scope .row')).map(fund => ({
        source: fund.querySelector('input[name*="chargedFunds_"]')?.value,
        amount: fund.querySelector('input[name*="chargedAmount_"]')?.value
      }))


      // const charges = Object.fromEntries(
      //   Array.from(chargingTo.querySelectorAll('.row')).map(fund => {
      //     const inputValue = fund.querySelector('input[name*="chargedFunds_"]').value;
      //     const amountValue = fund.querySelector('input[name*="chargedAmount_"]').value;

      //     return {
      //       source: inputValue,
      //       amount: amountValue
      //     };

      //   })
      // )

      console.log({ charges })

      // 🧼 Extract and validate form values
      const bidNoticeTitleValue = bidNoticeTitle.value.trim();
      const prClassificationValue = prClassification.value;
      const procurementTypeValue = procurementType.value;
      const requisitionerValue = requisitioner.value.trim();
      const budgetRawValue = budget.value.replace(/,/g, '');
      const bacUnitValue = bacUnit.value;

      if (!bidNoticeTitleValue || !requisitionerValue || parseFloat(budgetRawValue) === 0) {
        notifyCustom(
          'exclamation',
          'Fields are empty',
          'Submission failed: Bid Notice Title, Budget, and Requisitioner are mandatory fields.',
          'danger'
        );
        return;
      }

      const approvedBudget = parseFloat(budgetRawValue);

      // 🧠 Parse next responsible data
      let nextResponsible;
      try {
        nextResponsible = JSON.parse(created_by.dataset.responsible);
      } catch (err) {
        notifyCustom('bell', 'Invalid responsible data', 'Could not parse next responsible person.', 'danger');
        return;
      }

      // Get the query string from the URL
      const queryString = window.location.search; // "?market-scope=1"

      // Parse it using URLSearchParams
      const urlParams = new URLSearchParams(queryString);

      // Extract the value of "market-scope"
      const marketScope = urlParams.get("market-scope");


      // 📦 Prepare payload
      const payload = {
        bid_notice_title: bidNoticeTitleValue,
        pr_classification: prClassificationValue,
        procurement_type: procurementTypeValue,
        requisitioner: requisitionerValue,
        approved_budget: approvedBudget,
        // fund_source: JSON.stringify(charges),
        fund_source: charges,
        bac_unit: bacUnitValue,
        // remarks: JSON.stringify({
        //   message: 'Created Transaction'
        // }),
        remarks: {
          message: 'Created Transaction'
        },
        prepared_by: JSON.parse(created_by.value),
        assigned_to: nextResponsible.division?.employeeid || null,
        marketScopeID: marketScope
      };

      console.log('Payload:', payload);

      // 🚀 Send request
      const response = await fetch('/transactions/new', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        notifyCustom('bell', 'System Issue', 'Network response was not ok!', 'danger');
        return;
      }

      const result = await response.json();

      if (!result || !result.response?.insertId) {
        notifyCustom('bell', 'Error', 'Failed to create the Transaction!', 'danger');
        return;
      }

      const { message, response: { insertId } } = result;
      notifyCustom('bell', message, `Transaction ID#${insertId}`, 'success');

      // 🧹 Optional: Clear form fields here if needed
      // [bidNoticeTitle, prClassification, requisitioner, budget, bacUnit].forEach(el => el.value = '');

    } catch (error) {
      notifyCustom('close', 'Unexpected error occurred', error.message || error, 'danger');
    }
  });
}

function updateTransaction() {
  let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
  let prClassification = document.querySelector('#prClassification')
  let procurementType = document.querySelector('#procurementType')
  let requisitioner = document.querySelector('#requisitioner')
  // let division = document.querySelector('#divisions')
  let budget = document.querySelector('#budget')
  let fundSource = document.querySelector('#chargingTo')
  // let bannerProgram = document.querySelector('#bannerProgram')
  let bacUnit = document.querySelector('#bacUnit')
  // let remarks = document.querySelector('#remarks')
  const transactionID = document.querySelector('[data-transaction-id]')?.dataset.transactionId
  // Get the element
  const el = document.getElementById("chargingTo");

  // Parse the JSON from the data attribute
  let transactions = [];

  try {
    const raw = el?.dataset?.transactions;
    if (raw) {
      transactions = JSON.parse(raw);
    }
  } catch (e) {
    console.warn("Invalid JSON in dataset.transactions:", e);
  }


  // Retrieve only the remarks
  const remarks = transactions?.remarks

  console.log({ remarks })

  let remarksObj = {}
  if (typeof remarks === "string") {
    try {
      remarksObj = JSON.parse(remarks);
    } catch (e) {
      console.error("Failed to parse remarks:", e);
      remarksObj = {};
    }
  }

  const container = '#lastestModificationsTransactions'
  fieldsUpdated(container)

  updateTransactions?.addEventListener('click', function () {

    let bidNoticeTitleValue = bidNoticeTitle.value
    let prClassificationValue = prClassification.value
    let procurementTypeValue = procurementType.value
    let requisitionerValue = requisitioner.value
    let budgetValue = budget.value
    let bacUnitValue = bacUnit.value

    let charge = []
    const charges = Array.from(chargingTo.querySelectorAll(':scope .row')).map(fund => ({
      source: fund.querySelector('input[name*="chargedFunds_"]')?.value,
      amount: fund.querySelector('input[name*="chargedAmount_"]')?.value
    }))


    if (bidNoticeTitleValue === '' || budgetValue <= 0 || requisitionerValue === '') {
      notifyCustom('bell', 'Empty Fieldsssssssssss', 'Please fill up those fields and try again.')
      return
    };
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const apiUrl = '/transactions/update';
    const data = {
      bid_notice_title: bidNoticeTitleValue,
      pr_classification: prClassificationValue,
      procurement_type: procurementTypeValue,
      requisitioner: requisitionerValue,
      // division: divisionValue,
      approved_budget: budgetValue,
      fund_source: charges,
      // banner_program: bannerProgramValue,
      bac_unit: bacUnitValue,
      remarks: {
        ...remarksObj,
        updatedBy: JSON.parse(created_by.value),
        updatedAt: new Date()
      }
    };

    // console.log(bidNoticeTitle.classList.contains('updated'))
    if (!bidNoticeTitle.classList.contains('updated')) delete data.bid_notice_title
    if (!prClassification.classList.contains('updated')) delete data.pr_classification
    if (!procurementType.classList.contains('updated')) delete data.procurement_type
    if (!requisitioner.classList.contains('updated')) delete data.requisitioner
    // if (!division.classList.contains('updated')) delete data.division
    if (!budget.classList.contains('updated')) delete data.approved_budget
    if (!fundSource.classList.contains('updated')) delete data.fund_source
    // if (!bannerProgram.classList.contains('updated')) delete data.banner_program
    if (!bacUnit.classList.contains('updated')) delete data.bac_unit

    const payload = { set: data, where: { product_id: transactionID } }

    const requestOptions = {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
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
        if (!data) {
          notifyCustom('bell', 'Error', 'Failed to update the Transaction', 'danger')
        }
        // console.log(data)
        // let {message, response } = data
        // let {insertId} = response


        notifyCustom('bell', `${data.message}`, `Done.`, 'success')

        // Clearing the fields
        // bidNoticeTitle.value = ''
        // prClassification.value = ''
        // requisitioner.value = ''
        // division.value = ''
        // budget.value = ''
        // fundSource.value = ''
        // bannerProgram.value = ''
        // bacUnit.value = ''

      })
      .catch(error => {
        notifyCustom('bell', `System Error`, `${error}`, 'danger')
      });
  })
}

function duplicateNodes() {
  // console.log('duplicateNodes');
  let rowCount = 1;
  addButton.addEventListener('click', function () {
    console.log('duplicateNodes');
    // Cache containers once
    const chargingRow = document.querySelector('#chargingTo .row');
    const supplierRow = document.querySelector('#supplierInfo .row');
    const row = chargingRow || supplierRow;
    if (!row) return; // Defensive: no row found

    // Clone the row deeply
    const clonedForm = row.cloneNode(true);
    clonedForm.dataset.id = rowCount;
    // Remove 'active' from all rows inside #chargingTo
    document.querySelectorAll('#chargingTo .row').forEach(row => {
      row.classList.remove('active');
    });


    // Assign a new ID prefix depending on source
    const prefix = chargingRow ? 'charging' : 'supplier';
    clonedForm.id = `${prefix}_${rowCount}`;

    // Clear inputs and update IDs/names
    clonedForm.querySelectorAll('input, select, button').forEach(input => {
      const baseId = input.id ? input.id.split('_')[0] : prefix;
      const newId = `${baseId}_${rowCount}`;

      input.id = newId;

      if (input.type === 'radio') {
        // Keep radios grouped per cloned row
        // input.id = `${input.value}_${newId}`;
        input.name = `funds_source_${rowCount}`;
      } else {
        input.value = ''; // reset value
      }
    });

    // Update labels' "for" attributes
    clonedForm.querySelectorAll('label[for]').forEach(label => {
      const baseId = label.getAttribute('for').split('_')[0];
      label.setAttribute('for', `${baseId}_${rowCount}`);
    });

    // Attach remove handler
    const removeButton = clonedForm.querySelector('.fa-minus-circle');
    if (removeButton) {
      removeButton.addEventListener('click', () => {
        console.log('Remove button clicked for row: ', clonedForm.dataset.id);
        clonedForm.remove();
      });
    }

    // Increment row count
    rowCount++;

    // Append cloned row to the correct container
    const formContainer = chargingRow ? document.querySelector('#chargingTo .fundSource-entry ') : document.getElementById('supplierInfo');
    formContainer.appendChild(clonedForm);
  });
}

function createTransactionsCodes() {
  const transCodeText = document.getElementById('po_transCodeText')
  createTransactionCode.addEventListener('click', function (e) {
    if (transCodeText.value === '') return
    const transid = e.target.dataset.transid
    const apiUrl = '/transcodes/new';
    const data = { transid, code: transCodeText.value }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
    console.log(requestOptions)

    fetch(apiUrl, requestOptions)
      .then(response => {
        if (!response.ok) notifyCustom('', 'Error', 'Issues on retrieving an data', 'warning')
        return response.json()
      })
      .then(data => {
        if (!data) return notifyCustom('', 'Error', 'Failed to create new remarks', 'danger')

        notifyCustom('', 'Success', 'Added the transaction codes!', 'info')
      })
      .catch(error => {
        notifyCustom('Error', error, 'danger')
      })
    // Clear after saving successfully
    transCodeText.value = ''
  })
}
//////////////////////////////////////////////////////////////////////////
///////////////////////////// Event Listener /////////////////////////////
//////////////////////////////////////////////////////////////////////////
document.getElementById('chargingTo')?.addEventListener('click', (e) => {
  if (e.target.matches('input, select')) {
    console.log('Changed:', e.target.name, e.target.value);

    const parts = e.target.name.split('_');
    const index = Number(parts[parts.length - 1]);

    settingsFundsChargeToModal(index);
    settingsFundsAllocation(index);
  }
});

const createTransactions = document.getElementById('createTransactions')
if (createTransaction) createTransaction();

const updateTransactions = document.getElementById('updateTransactions')
if (updateTransaction) updateTransaction();

const addNewPrContainer = document.querySelector('.form-group-add')

const addButton = addNewPrContainer?.querySelector('#addButton');
if (addButton) duplicateNodes();

const createTransactionCode = document.getElementById('createTransactionCode')
if (createTransactionCode) createTransactionsCodes();