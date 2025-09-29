// let notifyIcon = ['check', 'close', 'exclamation', 'bell'];
(() => {
  const createTransactionCode = document.getElementById('createTransactionCode')
  const createTransactions = document.getElementById('createTransactions')
  const updateTransactions = document.getElementById('updateTransactions')
  const createRemarks = document.getElementById('createRemarks')
  const updateRemarks = document.getElementById('updateRemakrs')
  const deleteTransaction = document.querySelectorAll('.form-button-action .btn-delete');
  const printRemarks = document.getElementById('btnPrint')
  const printTracking = document.querySelectorAll('button[id*="print_"]')

  // const divisionsSelect = document.getElementById('divisions')
  const bannerProgramSelect = document.getElementById('bannerProgram')
  const unitCount = document.getElementById('unitCount')

  const addButton = document.querySelector('.form-group-add button');
  const setApprovedBudgetBtn = document.getElementById('setApprovedBudgetBtn')
  const getApprovedBudgetField = document.getElementById('approvedBudget')

  const period = document.getElementById('period')

  const divisionsContainer = document.getElementById('chargingTo')
  
  const divisionsSelect = document.querySelectorAll('#chargingTo .form-select')

  const created_by = document.getElementById('created_by')

  const approveBtn = document.getElementById('approveBtn')
  const disapproveBtn = document.getElementById('disapproveBtn')
  
  const setQoutedAmount = document.getElementById('setQoutedAmount')

  function getClosestDivision(element) {
    let sibling = element.previousElementSibling;

    // Traverse previous siblings to find the closest division
    while (sibling) {
      if (sibling.classList.contains('division')) {
        return sibling;  // Return the closest division
      }
      sibling = sibling.previousElementSibling;
    }
    return null;  // No division found
  }

  function trimFullName(){ 
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

  if (setApprovedBudgetBtn) {
    setApprovedBudgetBtn.addEventListener('click', function () {
      const approvedBudgetContainer = document.querySelector('.approved')
      approvedBudgetContainer.setAttribute('data-approvedbudget', getApprovedBudgetField.value)
    })
  }
  if (createTransactionCode) {
    const transCodeText = document.getElementById('transCodeText')
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
  if (createTransactions) {
    let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
    let prClassification = document.querySelector('#prClassification')
    let requisitioner = document.querySelector('#requisitioner')
    let division = document.querySelector('#divisions')
    let budget = document.querySelector('#budget')
    // let fundSource = document.querySelector('#fundSource')
    const chargingTo = document.getElementById('chargingTo')
    let bannerProgram = document.querySelector('#bannerProgram')
    let bacUnit = document.querySelector('#bacUnit')
    let remarks = document.querySelector('#remarks')
    

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    requisitioner.value = trimFullName()

    createTransactions.addEventListener('click', async () => {
      try {
        // 🔄 Collect fund source data
        const charge = Array.from(chargingTo.querySelectorAll('.row')).map(fund => {
          const select = fund.querySelector('select[name*="division_"]');
          const selectedOption = select.options[select.selectedIndex];
          const divisionValue = selectedOption.dataset.division;
          const sectionValue = select.value;
          const amountValue = fund.querySelector('input[name="unitCount"]').value;

          return {
            division: divisionValue,
            section: sectionValue,
            amount: amountValue
          };
        });

        // 🧼 Extract and validate form values
        const bidNoticeTitleValue = bidNoticeTitle.value.trim();
        const prClassificationValue = prClassification.value;
        const requisitionerValue = requisitioner.value.trim();
        const budgetRawValue = budget.value.replace(/,/g, '');
        const bacUnitValue = bacUnit.value;

        if (!bidNoticeTitleValue || !requisitionerValue || parseFloat(budgetRawValue) === 0) {
          notifyCustom(
            'exclamation',
            'Fields are empty',
            'Either Bid Notice Title, Budget, or Requisitioner is missing.',
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

        // 📦 Prepare payload
        const payload = {
          bid_notice_title: bidNoticeTitleValue,
          pr_classification: prClassificationValue,
          requisitioner: requisitionerValue,
          approved_budget: approvedBudget,
          fund_source: JSON.stringify(charge),
          bac_unit: bacUnitValue,
          remarks: JSON.stringify({
            message: 'Created Transaction'
          }),
          prepared_by: created_by.value,
          assigned_to: nextResponsible.division?.employeeid || null
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
  // Update
  if (updateTransactions) {
    let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
    let prClassification = document.querySelector('#prClassification')
    let requisitioner = document.querySelector('#requisitioner')
    // let division = document.querySelector('#divisions')
    let budget = document.querySelector('#budget')
    let fundSource = document.querySelector('#fundSource')
    // let bannerProgram = document.querySelector('#bannerProgram')
    let bacUnit = document.querySelector('#bacUnit')
    let remarks = document.querySelector('#remarks')

    const container = '#lastestModificationsTransactions'
    fieldsUpdated(container)

    updateTransactions.addEventListener('click', function () {

      let bidNoticeTitleValue = bidNoticeTitle.value
      let prClassificationValue = prClassification.value
      let requisitionerValue = requisitioner.value
      let budgetValue = budget.value
      let bacUnitValue = bacUnit.value

      let charge = []
      let funds =  chargingTo.querySelectorAll('.row')
      funds.forEach(fund => {
        let element = fund.querySelector('select[name^="division_"]');
        let selectedOption = element.options[element.selectedIndex];
        let divisionValue = selectedOption.dataset.division;

        let amount = fund.querySelector('input[name="unitCount"]').value;

        charge.push({
          division: divisionValue,
          section: element.value,
          amount
        });
      });


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
        requisitioner: requisitionerValue,
        // division: divisionValue,
        approved_budget: budgetValue,
        fund_source: charge,
        // banner_program: bannerProgramValue,
        bac_unit: bacUnitValue,
        remarks: {
          updatedBy: (created_by.value),
          updatedAt: new Date()
        }
      };

      // console.log(bidNoticeTitle.classList.contains('updated'))
      if (!bidNoticeTitle.classList.contains('updated')) delete data.bid_notice_title
      if (!prClassification.classList.contains('updated')) delete data.pr_classification
      if (!requisitioner.classList.contains('updated')) delete data.requisitioner
      // if (!division.classList.contains('updated')) delete data.division
      if (!budget.classList.contains('updated')) delete data.approved_budget
      // if (!fundSource.classList.contains('updated')) delete data.fund_source
      // if (!bannerProgram.classList.contains('updated')) delete data.banner_program
      if (!bacUnit.classList.contains('updated')) delete data.bac_unit

      // let { remarks } = data
      // remarks = JSON.stringify(remarks)
      // data.remarks = remarks

      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
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
          console.log(data)
          // let {message, response } = data
          // let {insertId} = response


          notifyCustom('bell', `${message}`, `Transaction ID#${insertId}`, 'success')

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
  if (createRemarks) {

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    createRemarks.addEventListener('click', async () => {
      try {
        let comment = document.querySelector('#comment')
        let assignedto = document.querySelector('#assignedto')
        let selectedStatus = document.querySelector('input[name="color"]:checked');
        let selectedPeriod = document.querySelectorAll('input[name="period"]');
        let { transid } = createRemarks.dataset
        let selectedStatusValue = selectedStatus.value

        const checkedCheckboxes = Array.from(selectedPeriod)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => parseFloat(checkbox.value))
          .reduce((sum, value) => sum + value, 0);

        const data = {
          comment: comment.value,
          refid: transid,
          status: selectedStatusValue,
          dueDate: checkedCheckboxes,
          assignedto: assignedto.checked
        }
        const apiUrl = '/remarks/asdwnew'

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(preloaded)
        };

        console.log('preloaded', requestOptions.body)


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
              notifyCustom('bell', 'Error', 'Failed to create new remarks', 'danger')
            }
            console.log(data)
            let { message } = data
            // if (refreshActivity) {
            //   refreshActivity.click()
            // }

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
  if (deleteTransaction) {
    // const table = new DataTable('#basic-datatables')

    deleteTransaction.forEach(danger => {

      danger.addEventListener('click', (event) => {
        let transactions = danger
        // transid = danger.target
        let { transid } = transactions.dataset
        // Removed existing 'selected' class on the <row> tag
        document.querySelectorAll('#transactions-datatables tr').forEach(row => row.classList.remove('selected'));
        // Add 'selected' class on the <row> tag
        event.target.closest('tr').classList.add('selected')
        // console.dir(event.target.closest('tr'))

        title = `Are you sure to delete ${transid}?`
        message = "Once deleted, you will not be able to recover this file!"

        swal({
          title,
          text: "Once deleted, you will not be able to recover this transaction file!",
          icon: "warning",
          buttons: ["Cancel", "Delete it!"],
          dangerMode: true,
        })
          .then((willDelete) => {
            if (willDelete) {

              let url = `/transactions/${transid}`

              fetch(url, {
                method: 'DELETE'
              })
                .then(res => {
                  return res.text()
                }) // or res.json()
                .then(data => {
                  swal("Poof! Transaction file has been deleted!", {
                    icon: "success",
                  });
                  // if Yes
                  document.querySelector('tr.selected').remove().draw(false)
                }) // endof fetch()
            } else {
              document.querySelectorAll('#transactions-datatables tr').forEach(row => row.classList.remove('selected'));
            }
          });
      })
    })
  }
  if (addButton) {
    let rowCount = 1;
    addButton.addEventListener('click', function () {
      // Find the closest row element
      // const row = this.closest('.row');
      const row = document.querySelector('#chargingTo .row')

      // Clone the row
      const clonedForm = row.cloneNode(true); // true means deep clone (including child nodes)
            clonedForm.setAttribute('id', `charging_${rowCount}`)
            clonedForm.dataset.id = rowCount
      // Remove the "Add" button from the cloned row to prevent duplication
      // const addButtonInClonedRow = clonedForm.querySelector('.form-group-add');
      // addButtonInClonedRow.remove();

      // Clear input values inside the cloned row
      const labels = clonedForm.querySelectorAll('label')
      const inputs = clonedForm.querySelectorAll('input, select, button');

      console.log(clonedForm)

      inputs.forEach(input => {
        // Generate new ID based on current row count
        const newId = input.id.split('_')[0] + rowCount; // Assuming ID pattern is like "divisions-1"
        input.id = newId; // Update the ID attribute
        input.value = ''; // Clear the value
      });

      labels.forEach(label => {
        const inputId = label.getAttribute('for');
        const baseId = inputId.split('_')[0];
        label.setAttribute('for', baseId + rowCount);
      })

      // Add a "Remove" button to the cloned row
      const removeButton = clonedForm.querySelector('.fa-minus-circle');
      removeButton.addEventListener('click', function () {
        clonedForm.remove(); // Remove the clicked row
      });

      // Update the row count
      rowCount++;

      // Append the cloned row to the form container
      const formContainer = document.getElementById('chargingTo');
      formContainer.appendChild(clonedForm);
    });
  }
  if (printTracking) {
    function printSpecificURL(path) {
      var url = path; // Replace with the URL you want to print
      var printWindow = window.open(url, '_blank'); // Open the URL in a new tab or window
      printWindow.onload = function () {
        printWindow.print(); // Trigger the print dialog once the content is fully loaded
        printWindow.close(); // Optionally, close the window after printing
      };
    }
    printTracking.forEach(pr => {
      pr.addEventListener('click', (event) => {
        const path = event.target.dataset.href
        printSpecificURL(path)
      })
    })

  }
  //
  if (period) {
    $('.input-daterange input').each(function () {
      $(this).daterangepicker('clearDates');
    });
  }``
  //
  if (divisionsSelect && divisionsContainer) {
    // divisionsSelect.addEventListener('change', function (event) {
    //   console.log(event)
    //   var target = event.target.selectedOptions[0]
    //   var section = target.value
    //   var division = getClosestDivision(target)
    //   division = division.value
    //   var amount = document.querySelector('input[name="unitCount"]')
    //   amount = amount.value
    //   console.log('select_option', { section, division, charging: amount })

    // })
    let charging = []
    let index = 0
    // Attach the event listener to a common parent element
    divisionsContainer.addEventListener('change', function (event) {
      // Ensure the event target is a select element
      if (event.target.tagName === 'SELECT') {
        var target = event.target.selectedOptions[0];
        var section = target.value;

        // Get the closest division
        var division = getClosestDivision(target);

        if (division) {
          division = division.value; // Only access value if division is not null
        } else {
          division = target; // Handle case where no division is found
        }

        // Get the amount from the input field
        var amountInput = event.target.closest('.row').querySelector('input[name="unitCount"]');

        if (amountInput) {
          var amount = amountInput.value;
        } else {
          var amount = 'N/A'; // Handle case where amount input is not found
        }

        // Log the values
        // index++
        // charging.push({id: rowCount, section, division, amount})
        // divisionsContainer.setAttribute('data-fundsource', JSON.stringify(charging))
        // console.log('select_option', { section, division, amount });
      }
    });
    console.log(charging)
  }

  if (approveBtn) {
    approveBtn.addEventListener('click', function (e) {

      const create_by = document.getElementById('created_by').value
      const currentSteps = Number(document.querySelector('.activity-feed').dataset.currentSteps);
      const product_id = Number(document.querySelector('.container').dataset.transactionId);
      const apiUrl = '/approve';
      const data = { product_id:product_id, steps_number:currentSteps, updated_by: create_by}

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
        if (!data) return notifyCustom('', 'Error', 'Failed to Approved the PR#', 'danger')

        notifyCustom('', 'Success', 'Approved the PR# successfully', 'info')
      })
      .catch(error => {
        notifyCustom('Error', error, 'danger')
      })
    })
  }

  if (disapproveBtn) {
   disapproveBtn.addEventListener('click', function() {
    const create_by = document.getElementById('created_by').value
    const currentSteps = Number(document.querySelector('.activity-feed').dataset.currentSteps);
  })                                                                                                                                                                                                           
  }

  if (setQoutedAmount) {
    setQoutedAmount.addEventListener('click', function(e){
      var getAmount = document.getElementById('qoutedAmount')
      
      if (!getAmount || getAmount.value.trim() === "") {
        return; // exits the function or block silently
      }

      const transid = this.dataset.transid
      const apiUrl = '/transactions/update';

      console.log(getAmount.value)
      let cleaned = getAmount.value.replace(/,/g, "")
      let decimalValue = parseFloat(cleaned)
     
      console.log(getAmount)
      const data = { set:{amount: decimalValue}, where: {product_id: transid}}
      

      const requestOptions = {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      };

      console.log(data)
      fetch(apiUrl, requestOptions)
      .then(response => {
        if (!response.ok) notifyCustom('', 'Error', 'Issues on retrieving an data', 'warning')
        return response.json()
      })
      .then(data => {
        if (!data) return notifyCustom('', 'Error', 'Failed to get the details', 'danger')
          console.log(data)
        notifyCustom('', 'Success', 'Successfully updated the Transaction', 'info')
      })
      .catch(error => {
        notifyCustom('Error', error, 'danger')
      })
    })
  }

  const assignedToBtn = document.getElementById('assignedToBtn');
  if (assignedToBtn) {
    assignedToBtn.addEventListener('click', function (){
      const nextResponsible = document.getElementById('nextResponsible');
      const productId = document.querySelector('.wrapper').dataset.productId;
      let selectedPerson = nextResponsible.value;
      const currentSteps = Number(document.querySelector('.activity-feed').dataset.currentSteps);
    

      if (!selectedPerson) {
        notifyCustom('exclamation', 'No Selection', 'Please select a person to assign.', 'warning');
        return;
      }
      const apiUrl = '/transactions/assign';
      const data = {
        product_id: productId,
        steps_number: currentSteps,
        assigned_to: selectedPerson
      };
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
      };
      fetch(apiUrl, requestOptions)
      .then(response => {
        if (!response.ok) notifyCustom('', 'Error', 'Issues on retrieving an data', 'warning')
        return response.json()
      })
      .then(data => {
        if (!data) return notifyCustom('', 'Error', 'Failed to set responsible person for the PR#' + productId, 'danger')

        notifyCustom('', 'Success', 'Successfully set responsible person for the PR#' + productId, 'info')
      })
      .catch(error => {
        notifyCustom('Error', error, 'danger')
      })
    })
  }

  // Function to sum all unitCount fields and update totalCo
  function updateTotal(selector) {
    const inputs = document.querySelectorAll(selector);
    let total = 0;
    inputs.forEach(input => {
      const val = parseInt(input.value);
      // console.log('ASD', val)
      if (!isNaN(val)) total += val;
    });
    document.getElementById('totalCount').value = total;
  }

  document.addEventListener('keyup', event => {
    if (event.target.matches('[id*="unitCount_"]')) {
      updateTotal('[id*="unitCount_"]');
    }
  });

  
  // On document ready, find all readonly input fields and add a 'readonly' class to their parent '.form-group'.
  // This allows styling or behavior adjustments for groups containing readonly inputs.
  $(function() {
    $('input[readonly]').closest('.form-group').addClass('readonly');
  });
  

  
})()