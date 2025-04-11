// let notifyIcon = ['check', 'close', 'exclamation', 'bell'];
(() => {
  const exampleModal = document.getElementById('viewTransactionModal')

  const createTransactionCode = document.getElementById('createTransactionCode')
  const createTransactions = document.getElementById('createTransactions')
  const updateTransactions = document.getElementById('updateTransactions')
  const createRemarks = document.getElementById('createRemarks')
  const updateRemarks = document.getElementById('updateRemakrs')
  const deleteTransaction = document.querySelectorAll('.form-button-action .btn-danger');
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
  if (exampleModal) {
    exampleModal.addEventListener('show.bs.modal', event => {
      // Button that triggered the modal
      const button = event.relatedTarget
      // Extract info from data-bs-* attributes
      const recipient = button.getAttribute('data-bs-whatever')
      const transaction = JSON.parse(button.parentNode.dataset.transaction)
      // console.log(transaction)
  
      let {approved_budget, bac_unit, banner_program, bid_notice_title, division, fund_source, pr_classification, pr_date,  product_id, requisitioner, trans_code} = transaction
  
      // const {}
      // If necessary, you could initiate an Ajax request here
      // and then do the updating in a callback.
  
      // Update the modal's content.
      const modalTitle = exampleModal.querySelector('.modal-title')
  
      // pr_date = moment(pr_date).format('MMM Do YYYY')
  
      const modalBodyTitle = exampleModal.querySelector('.modal-body h3')
      const modalClassification = exampleModal.querySelector('.modal-body .badge-count')
      const modalBACUnit = exampleModal.querySelector('.modal-body .badge-danger')
      const modalBannerProgram = exampleModal.querySelector('.modal-body .badge-info')
      const modalPRDate= exampleModal.querySelector('.modal-body .badge-black')
      const modalFundSource = exampleModal.querySelector('.modal-body .btn-border.btn-round span')
      const modalBudget = exampleModal.querySelector('.modal-body .btn-round')
      const modalRequisitioner = exampleModal.querySelector('.modal-body .text-muted')
      const modalFooterLink = exampleModal.querySelector('.modal-footer a')
      const modalQRCode = exampleModal.querySelector('.qrcode')
      modalQRCode.innerHTML = ''
      modalQRCode.setAttribute('id', `transid-${recipient}`)
  
      // approved_budget = parseInt(approved_budget)
      // approved_budget = formatter.format(formatter.format(amount))

      var chargingTo = JSON.parse(fund_source)
      if(Array.isArray(chargingTo)) {
        chargingTo = chargingTo.map(item => `${item.division}-${item.section}`).join(', ');
      } else {
        chargingTo = 'N/A'
      }
      
  
      modalTitle.textContent = `Transaction ID #${recipient}`
      modalClassification.textContent = pr_classification
      modalBACUnit.textContent = bac_unit
      modalBannerProgram.textContent = banner_program
      modalPRDate.textContent = dateFormat(pr_date)
      modalBodyTitle.textContent = bid_notice_title
      modalBudget.textContent = peso(approved_budget)
      modalFundSource.textContent = chargingTo
      modalRequisitioner.innerHTML = `<i class="fas fa-user-circle"></i> ${requisitioner} — <span class="badge badge-warning">${division}</span> `
  
  
      new QRCode("transid-"+recipient, recipient);
  
      modalFooterLink.setAttribute('href', `/transactions/${recipient}/view`)
  
      // modalBodyInput.value = recipient
    })
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

    createTransactions.addEventListener('click', async () => {
      let charge = []
      let funds =  chargingTo.querySelectorAll('.row')
      funds.forEach(fund => {
        let element = fund.querySelector('select[name="division"]')
        let selectedOption = element.options[element.selectedIndex];
        let divisionValue = selectedOption.dataset.division;

        let amount = fund.querySelector('input[name="unitCount"]')
            amount = amount.value
        charge.push({division: divisionValue, section: (element.value), amount })
      })


      try {
        let bidNoticeTitleValue = bidNoticeTitle.value
        let prClassificationValue = prClassification.value
        let requisitionerValue = requisitioner.value
        // let divisionValue = division.value
        let budgetValue = budget.value
          // let bannerProgramValue = bannerProgram.value
        let bacUnitValue = bacUnit.value
        // let remarksValue = remarks.value

        if (bidNoticeTitleValue === '' || budgetValue === 0 || requisitionerValue === '') {
          notifyCustom('exclamation', 'Fields are empty', 'Either this fields are empty Bid Notice Title, Budget, and Requisitioner', 'danger')
          return
        };

        const apiUrl = '/transactions/new';
        let data = {
          bid_notice_title: bidNoticeTitleValue,
          pr_classification: prClassificationValue,
          requisitioner: requisitionerValue,
          // division: divisionValue,
          approved_budget: budgetValue,
          fund_source: JSON.stringify(charge),
          // banner_program: bannerProgramValue,
          bac_unit: bacUnitValue,
          remarks: {
            createby: created_by,
            message: 'Created Transaction',
          }
        };

        console.log('data', data)

        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };

        console.log(requestOptions.body)

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
              notifyCustom('bell', 'Error', 'Failed to create the Transaction!', 'danger')
            }

            let { message, response } = data
            let { insertId } = response

            notifyCustom('bell', message, `Transaction ID#${insertId}`, 'success')
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
            notifyCustom('bell', 'There was an error on the system!', error, 'danger')
          });
      } catch (error) {
        notifyCustom('close', 'Field is empty please check!', error, 'danger')
      }
    });

    // if(divisionsSelect) {
    //     divisionsSelect.addEventListener('change', uUasdlwaWW)
    //     bannerProgramSelect.addEventListener('change', uUasdlwaWW)
    //     unitCount.addEventListener('keypress', uUasdlwaWW)
    // }
  }
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
        let element = fund.querySelector('select[name="division"]')
        let selectedOption = element.options[element.selectedIndex];
        let divisionValue = selectedOption.dataset.division;

        let amount = fund.querySelector('input[name="unitCount"]')
            amount = amount.value
        
        charge.push({division: divisionValue, section: (element.value), amount })
      })

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
    let comment = document.querySelector('#comment')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    createRemarks.addEventListener('click', async () => {
      console.log(createRemarks)
      try {
        let selectedStatus = document.querySelector('input[name="color"]:checked');
        let selectedPeriod = document.querySelectorAll('input[name="period"]');
        let { transid } = createRemarks.dataset
        let selectedStatusValue = selectedStatus.value

        const checkedCheckboxes = Array.from(selectedPeriod)
          .filter(checkbox => checkbox.checked)
          .map(checkbox => parseFloat(checkbox.value))
          .reduce((sum, value) => sum + value, 0);

        let preloaded = {
          comment: comment.value,
          refid: transid,
          status: selectedStatusValue,
          user: 'justjoe',
          dueDate: checkedCheckboxes
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
            if (!data) {
              notifyCustom('bell', 'Error', 'Failed to create new remarks', 'danger')
            }

            let { message } = data
            if (refreshActivity) {
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
  }
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
})()