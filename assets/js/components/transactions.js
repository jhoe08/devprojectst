// let notifyIcon = ['check', 'close', 'exclamation', 'bell'];
(()=>{
    function notifyCustom(type, title, message, status) {
        return $.notify({
            icon: `icon-${type ?? 'bell'}`,
            title: `${title ?? 'Error'}`,
            message: `${message ?? 'System found an issue!'}`,
            },{
            type: `${status ?? 'danger'}`,
            placement: {
                from: "top",
                align: "right"
            },
            time: 2000,
        });
    }

    function fieldsUpdated(container) {
        const fields = document.querySelectorAll(`${container} .form-control`);

        fields.forEach(field => {
            field.addEventListener('input', function() {
                this.classList.toggle('updated', !!this.value);
            });
        
            // For select elements, listen for the 'change' event
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', function() {
                    this.classList.toggle('updated', !!this.value);
                });
            }
        });
    }

    

    const createTransactionCode = document.getElementById('createTransactionCode')
    const createTransactions = document.getElementById('createTransactions')
    const updateTransactions = document.getElementById('updateTransactions')
    const createRemarks = document.getElementById('createRemarks')
    const updateRemarks = document.getElementById('updateRemakrs')
    
    if(createTransactionCode) {
        const transCodeText = document.getElementById('transCodeText')
        createTransactionCode.addEventListener('click', function(e){
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
            .then(response=>{
                if(!response.ok) notifyCustom('', 'Error', 'Issues on retrieving an data', 'warning')
                return response.json()
            })
            .then(data=>{
                if(!data) return notifyCustom('', 'Error', 'Failed to create new remarks', 'danger')

                notifyCustom('', 'Success', 'Added the transaction codes!', 'info')
            })
            .catch(error => {
                notifyCustom('Error', error, 'danger')
            })
            // Clear after saving successfully
            transCodeText.value = ''
        })
    }
    if(createTransactions) {
        let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
        let prClassification = document.querySelector('#prClassification')
        let requisitioner = document.querySelector('#requisitioner')
        let division = document.querySelector('#divisions')
        let budget = document.querySelector('#budget')
        let fundSource = document.querySelector('#fundSource')
        let bannerProgram = document.querySelector('#bannerProgram')
        let bacUnit = document.querySelector('#bacUnit')
        let remarks = document.querySelector('#remarks')
      
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
      
        createTransactions.addEventListener('click', async () => {
          console.log('asdfw')
      
          try {
            let bidNoticeTitleValue = bidNoticeTitle.value
            let prClassificationValue = prClassification.value
            let requisitionerValue = requisitioner.value
            let divisionValue = division.value
            let budgetValue = budget.value
            let fundSourceValue = fundSource.value
            let bannerProgramValue = bannerProgram.value
            let bacUnitValue = bacUnit.value
            // let remarksValue = remarks.value
      
            if(bidNoticeTitleValue === '' || budgetValue > 0 || requisitionerValue === '') {
                notifyCustom('exclamation', 'Fields are empty', 'Either this fields are empty Bid Notice Title, Budget, and Requisitioner', 'danger')
                return
            };
      
            const apiUrl = '/transactions/new';
            let data = { 
              bid_notice_title: bidNoticeTitleValue, 
              pr_classification: prClassificationValue, 
              requisitioner: requisitionerValue, 
              division: divisionValue,
              approved_budget: budgetValue,
              fund_source: fundSourceValue,
              banner_program: bannerProgramValue, 
              bac_unit: bacUnitValue,
              remarks: {
                  createby: 'JustJoe',
                  message: 'remarksValue'
              } 
            };
      
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
              if(!data) {
                notifyCustom('bell', 'Error', 'Failed to create the Transaction!', 'danger')
              }
      
              let {message, response } = data
              let {insertId} = response
              
              notifyCustom('bell', message, `Transaction ID#${insertId}`, 'success')
              // Clearing the fields
              bidNoticeTitle.value = ''
              prClassification.value = ''
              requisitioner.value = ''
              division.value = ''
              budget.value = ''
              fundSource.value = ''
              bannerProgram.value = ''
              bacUnit.value = ''
      
            })
            .catch(error => {
                notifyCustom('bell', 'There was an error on the system!', error, 'danger')
            });
          } catch (error) {
            notifyCustom('close', 'Field is empty please check!', error, 'danger')
          }
        });
      }
    if(updateTransactions) {
        let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
        let prClassification = document.querySelector('#prClassification')
        let requisitioner = document.querySelector('#requisitioner')
        let division = document.querySelector('#divisions')
        let budget = document.querySelector('#budget')
        let fundSource = document.querySelector('#fundSource')
        let bannerProgram = document.querySelector('#bannerProgram')
        let bacUnit = document.querySelector('#bacUnit')
        let remarks = document.querySelector('#remarks')

        const container = '#lastestModificationsTransactions'
        fieldsUpdated(container)

        updateTransactions.addEventListener('click', function(){
            let bidNoticeTitleValue = bidNoticeTitle.value
            let prClassificationValue = prClassification.value
            let requisitionerValue = requisitioner.value
            let divisionValue = division.value
            let budgetValue = budget.value
            let fundSourceValue = fundSource.value
            let bannerProgramValue = bannerProgram.value
            let bacUnitValue = bacUnit.value

            if(bidNoticeTitleValue === '' || budgetValue <= 0 || requisitionerValue === '') return;
            const myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            
            const apiUrl = '/transactions/update';
            const data = { 
                bid_notice_title: bidNoticeTitleValue, 
                pr_classification: prClassificationValue, 
                requisitioner: requisitionerValue, 
                division: divisionValue,
                approved_budget: budgetValue,
                fund_source: fundSourceValue,
                banner_program: bannerProgramValue, 
                bac_unit: bacUnitValue,
                remarks: {
                    createby: 'JustJoe',
                    message: 'remarksValue'
                } 
            };

            // console.log(bidNoticeTitle.classList.contains('updated'))
            if(!bidNoticeTitle.classList.contains('updated')) delete data.bid_notice_title
            if(!prClassification.classList.contains('updated')) delete data.pr_classification
            if(!requisitioner.classList.contains('updated')) delete data.requisitioner
            if(!division.classList.contains('updated')) delete data.division
            if(!budget.classList.contains('updated')) delete data.approved_budget
            if(!fundSource.classList.contains('updated')) delete data.fund_source
            if(!bannerProgram.classList.contains('updated')) delete data.banner_program
            if(!bacUnit.classList.contains('updated')) delete data.bac_unit
            
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
                if(!data) {
                    notifyCustom('bell', 'Error', 'Failed to update the Transaction', 'danger')
                }

                let {message, response } = data
                let {insertId} = response
                
                notifyCustom('bell', `${message}`, `Transaction ID#${insertId}`, 'success')
               
                // Clearing the fields
                bidNoticeTitle.value = ''
                prClassification.value = ''
                requisitioner.value = ''
                division.value = ''
                budget.value = ''
                fundSource.value = ''
                bannerProgram.value = ''
                bacUnit.value = ''

            })
            .catch(error => {
                notifyCustom('bell', `System Error`, `${error}`, 'danger')
            });
        })
    }
    if(createRemarks) {                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           

        let comment = document.querySelector('#comment')

        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        createRemarks.addEventListener('click', async () => {
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
                    user:'justjoe',
                    dueDate: checkedCheckboxes
                }
            
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
})()