
// let notifyIcon = ['check', 'close', 'exclamation', 'bell'];

let views = document.querySelectorAll('#basic-datatables .form-button-action .btn-primary');
if (views) {
  views.forEach(view=>{
    view.addEventListener('click', ()=>{
        let transactions = view
        // transid = danger.target
        let {transid} = transactions.dataset
        let title = `Transaction Details ${transid}`
        let description = 'Peskot na~'
    })
})
}
// let dangers = document.querySelectorAll('#transactions-datatables .form-button-action .btn-danger');
// if (dangers) {
//   // const table = new DataTable('#basic-datatables')

//   dangers.forEach(danger=>{
    
//     danger.addEventListener('click', (event)=>{
//       let transactions = danger
//       // transid = danger.target
//       let {transid} = transactions.dataset
//       // Removed existing 'selected' class on the <row> tag
//       document.querySelectorAll('#transactions-datatables tr').forEach(row => row.classList.remove('selected'));
//       // Add 'selected' class on the <row> tag
//       event.target.closest('tr').classList.add('selected')
//       // console.dir(event.target.closest('tr'))

//       title = `Are you sure to delete ${transid}?`
//       message = "Once deleted, you will not be able to recover this imaginary file!"

//       swal({
//         title,
//         text: "Once deleted, you will not be able to recover this transaction file!",
//         icon: "warning",
//         buttons: ["Cancel", "Delete it!"],
//         dangerMode: true, })
//       .then((willDelete) => {
//         if (willDelete) {
        
//           let url = `/transactions/${transid}`

//           fetch(url, {
//             method: 'DELETE' })
//           .then(res => {
//             return res.text()}) // or res.json()
//           .then(data => {
//             swal("Poof! Transaction file has been deleted!", {
//               icon: "success", });
//             // if Yes
//             document.querySelector('tr.selected').remove().draw(false)
//           }) // endof fetch()
//         } else {
//           document.querySelectorAll('#transactions-datatables tr').forEach(row => row.classList.remove('selected'));
//         }
//       });
//     })
//   })
// }
// let createTransactions = document.getElementById('createTransactions')
// if (createTransactions) {
//   let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
//   let prClassification = document.querySelector('#prClassification')
//   let requisitioner = document.querySelector('#requisitioner')
//   let division = document.querySelector('#divisions')
//   let budget = document.querySelector('#budget')
//   let fundSource = document.querySelector('#fundSource')
//   let bannerProgram = document.querySelector('#bannerProgram')
//   let bacUnit = document.querySelector('#bacUnit')
//   let remarks = document.querySelector('#remarks')

//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   createTransactions.addEventListener('click', async () => {
//     console.log('asdfw')

//     try {
//       let bidNoticeTitleValue = bidNoticeTitle.value
//       let prClassificationValue = prClassification.value
//       let requisitionerValue = requisitioner.value
//       let divisionValue = division.value
//       let budgetValue = budget.value
//       let fundSourceValue = fundSource.value
//       let bannerProgramValue = bannerProgram.value
//       let bacUnitValue = bacUnit.value
//       // let remarksValue = remarks.value

//       if(bidNoticeTitleValue === '' || budgetValue > 0 || requisitionerValue === '') return;

//       const apiUrl = '/transactions/new';
//       let data = { 
//         bid_notice_title: bidNoticeTitleValue, 
//         pr_classification: prClassificationValue, 
//         requisitioner: requisitionerValue, 
//         division: divisionValue,
//         approved_budget: budgetValue,
//         fund_source: fundSourceValue,
//         banner_program: bannerProgramValue, 
//         bac_unit: bacUnitValue,
//         remarks: {
//             createby: 'JustJoe',
//             message: 'remarksValue'
//         } 
//       };

//       const requestOptions = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//       };

//       console.log(requestOptions.body)

//       fetch(apiUrl, requestOptions)
//       .then(response => {
//         if (!response.ok) {
//           // throw new Error('Network response was not ok');
//           $.notify({
//             icon: 'icon-bell',
//             title: `System Issue`,
//             message: 'Network response was not ok!',
//           },{
//             type: 'danger',
//             placement: {
//               from: "top",
//               align: "right"
//             },
//             time: 1000,
//           });
//         }
//         return response.json();
//       })
//       .then(data => {
//         if(!data) {
//           $.notify({ icon: 'icon-bell', title: `Error`, message: `Failed to create the Transaction` },
//                   { type: 'danger', placement: { from: "top", align: "right" },
//                   time: 1000});
//         }

//         let {message, response } = data
//         let {insertId} = response
        
//         $.notify({
//           icon: 'icon-bell',
//           title: `${message}`,
//           message: `Transaction ID#${insertId}`,
//         },{
//           type: 'success',
//           placement: {
//             from: "top",
//             align: "right"
//           },
//           time: 1000,
//         });
//         // Clearing the fields
//         bidNoticeTitle.value = ''
//         prClassification.value = ''
//         requisitioner.value = ''
//         division.value = ''
//         budget.value = ''
//         fundSource.value = ''
//         bannerProgram.value = ''
//         bacUnit.value = ''

//       })
//       .catch(error => {
//         $.notify({ icon: 'icon-bell', title: `There was an error on the system!`, message: error },
//           { type: 'danger', placement: { from: "top", align: "right" },
//           time: 1000});
//       });
//     } catch (error) {
//       $.notify({ icon: 'icon-close', title: 'Field is empty please check!', message: error },
//         { type: 'danger', placement: { from: "top", align: "right" },
//         time: 1000});
//     }
//   });
// }
// let createRemarks = document.getElementById('createRemarks')
// if (createRemarks) {

//   let comment = document.querySelector('#comment')

//   const myHeaders = new Headers();
//   myHeaders.append("Content-Type", "application/json");

//   createRemarks.addEventListener('click', async () => {
//     try {
//       let selectedStatus = document.querySelector('input[name="color"]:checked');
//       let selectedPeriod = document.querySelectorAll('input[name="period"]');
//       let {transid} = createRemarks.dataset
//       let selectedStatusValue = selectedStatus.value
//       const checkedCheckboxes = Array.from(selectedPeriod)
//       .filter(checkbox => checkbox.checked)
//       .map(checkbox => parseFloat(checkbox.value))
//       .reduce((sum, value) => sum + value, 0);
  
//       let data = { 
//           comment: comment.value, 
//           refid: transid, 
//           status: selectedStatusValue,
//           user:'justjoe',
//           dueDate: checkedCheckboxes
//       }
  
//       const apiUrl = '/remarks/new'
  
//       const requestOptions = {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data)
//       };
  
//       fetch(apiUrl, requestOptions)
//       .then(response => {
//         if (!response.ok) {
//           // throw new Error('Network response was not ok');
//           $.notify({
//             icon: 'icon-bell',
//             title: `Hello, ${greetings} Joe!`,
//             message: 'Network response was not ok!',
//           },{
//             type: 'danger',
//             placement: {
//               from: "top",
//               align: "right"
//             },
//             time: 1000,
//           });
//         }
//         return response.json();
//       })
//       .then(data => {
//         if(!data) {
//           $.notify({ icon: 'icon-bell', title: `Error`, message: `Failed to create new remarks` },
//                    { type: 'danger', placement: { from: "top", align: "right" },
//                    time: 1000});
//         }
  
//         let {message, response} = data
//         // console.log(response)
        
//         refreshActivity.click()
//         // clearing fields
//         selectedStatus.checked = false
//         comment.value = ''
//         // return notifications
//         $.notify({
//           icon: 'icon-check',
//           title: `${message}`,
//           message: `Successfully added the remarks on the transactions!`,
//         },{
//           type: 'success',
//           placement: {
//             from: "top",
//             align: "right"
//           },
//           time: 1000,
//         });

     
//       })
//       .catch(error => {
//         $.notify({ icon: 'icon-exclamation', title: `There was an error on the system!`, message: `${error} adsdsa` },
//           { type: 'danger', placement: { from: "top", align: "right" },
//           time: 1000});
//       });

      
//     } catch (error) {
//       $.notify({ icon: 'icon-exclamation', title: `Field is empty please check!`, message: `${error}` },
//         { type: 'danger', placement: { from: "top", align: "right" },
//         time: 1000});
//     }
//     /// AHAAHHAHAHAHAHHAHA
  
//   })

  
// }
let refreshActivity = document.getElementById('refreshActivity')
if (refreshActivity) {
  refreshActivity.addEventListener('click', async () =>{

    let {transid} =  refreshActivity.dataset

    // const response = await fetch(`/remarks/${transid}`);
    // const remarks = await response.json();
    // return remarks

    fetch(`/remarks/${transid}`)
    .then(response => response.text())
    .then(html => {
      document.querySelector('.activity-feed').innerHTML = html;
    })
    .catch(error => console.error('Error fetching HTML:', error));
  })
}

function numberFormat ( data ) {
	let s=(data+""), a=s.split(""), out="", iLen=s.length;
	
	for ( var i=0 ; i<iLen ; i++ ) {
		if ( i%3 === 0 && i !== 0 ) {
			out = ','+out;
		}
		out = a[iLen-i-1]+out;
	}
	return out;
}

function dateFormat (date) {
  return new Date(date).toDateString()
}

function pr_date() {
  let dates = document.querySelectorAll('[data-pr_date]')
  dates.forEach(date =>{
    let pr = date.dataset.pr_date
    let child = date.children[0]

    child.innerHTML = dateFormat(pr)
    
  })
}

function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
  return false;
}
function peso(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount); 
}

function stringToArray(str, callback) {
  const separated = str.slice(1,-1).split(',').map(item => item.trim().replace(/"/g, '')).filter(item => item !== 'null' && item !== '');
  return separated.map(callback).join(' ')
}

function isValidJSON(jsonString) {
  try {
      JSON.parse(jsonString);
      return true; // If parse is successful, return true
  } catch (e) {
      return false; // If there's an error, return false
  }
}

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
  const fields = document.querySelectorAll(`${container} .form-control, ${container} .form-select, ${container} input[type="checkbox"]`);

  fields.forEach(field => {
    // console.dir(field.tagName)
      if (field.tagName === 'INPUT') {
        field.addEventListener('input', function() {
            this.classList.toggle('updated', !!this.value);
        });
      }
      // For select elements, listen for the 'change' event
      if (field.tagName === 'SELECT') {
          field.addEventListener('change', function() {
              this.classList.toggle('updated', !!this.value);
          });
      }
      // For checkbox elements, listen for the 'input' event
      if (field.tagName === 'INPUT' && field.type === 'checkbox') {
        field.addEventListener('input', function() {
          field.closest('.selectgroup').classList.toggle('updated', !!this.value);
        });
      }
  });
}

function statusText(status) {
  let text = ''
  switch(status) {
    case 'dark':
      text = 'data-bs-title="Back to office"'
    break;
    case 'secondary':
      text = 'data-bs-title="Lack of Signature"'
    break;
    case 'info':
      text = 'data-bs-title="Lack of Attachments"'
    break;
    case 'success':
      text = 'data-bs-title="Read to move"'
    break;
    case 'warning':
      text = 'data-bs-title="Waiting"'
    break;
    case 'danger':
      text = 'data-bs-title="Issue occured"'
    break;
    default:
      text = 'data-bs-title="For Approval"'
  }

  return text;
}
// Function to fetch the countNotif from the server
async function fetchNotificationCount() {
  try {
    const response = await fetch('http://localhost:4000/api/notifications');
    const data = await response.json();
    const notifCount = document.getElementById('notifDropdown')
    // console.log(data)
    if(notifCount){
      notifCount.querySelector('span').textContent = data.counts;
      notifCount.querySelector('span').dataset.lastupdated = new Date()
    }
    
  } catch (error) {
    console.error('Error fetching notification count:', error);
  }
}
function refreshDiv() {
  let realtimeDiv = document.querySelectorAll('.realtime')
  if(realtimeDiv) {
    realtimeDiv.forEach(container=>{
      // const currentTime = new Date().toLocaleTimeString();
      const currentTime = new Date().toLocaleString();
      container.textContent = currentTime
    })
  }
}

function initial(string) {
  return string.chartAt(0) + '.'
}

function addLeadingZeros(number) {
  // Convert the number to a string to count its digits
  const numStr = number.toString();
  const numDigits = numStr.length;
  
  // Determine how many leading zeros to add
  if (numDigits === 1) {
    return "0000" + number; // Add 4 leading zeros for single-digit
  } else if (numDigits === 2) {
    return "000" + number;  // Add 3 leading zeros for two digits
  } else if (numDigits === 3) {
    return "00" + number;   // Add 2 leading zeros for three digits
  } else if (numDigits === 4) {
    return "0" + number;    // Add 1 leading zero for four digits
  } else {
    return number.toString(); // No leading zeros for five or more digits
  }
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}

function isActive(currentPath, pathToCheck) {
  return (currentPath === pathToCheck) ? 'active' : '';
}

// SELECT MULTIPLE OPTION
document.querySelectorAll('select[multiple] option').forEach(function(option) {
  option.addEventListener('mousedown', function(e) {
      e.preventDefault();

      var parent = this.parentElement;
      var originalScrollTop = parent.scrollTop;

      // console.log(originalScrollTop);

      // Toggle the 'selected' property
      this.selected = !this.selected;

      // Focus on the parent (the <select> element)
      parent.focus();

      // Reset the scroll position after the selection change
      setTimeout(function() {
          parent.scrollTop = originalScrollTop;
      }, 0);

      return false;
  });
});


function formatNumberWithCommas(event) {
  // Get the input element
  const input = event.target;

  // Remove any non-numeric characters (excluding commas)
  let value = input.value.replace(/[^0-9]/g, '');

  // Check if the value is not empty or just spaces
  if (value === '') {
    input.value = '';
    return;
  }

  // Format the number with commas
  value = parseInt(value, 10).toLocaleString();

  // Update the input value with the formatted number
  input.value = value;
}

const numberInputs = document.querySelectorAll('input[data-type="number"]');

// Add event listener to each input
numberInputs.forEach(input => {
  input.addEventListener('input', formatNumberWithCommas);
});



// DO NOT FUCKING DELETE THIS CODE
// Initial call to set the time
// refreshDiv();

// Refresh every second
// setInterval(refreshDiv, 1000);

// Initial call to fetch the notification
// fetchNotificationCount() // Enable this shits

// Periodically check for updated notif`ication count (e.g., every 5 seconds)
// setInterval(fetchNotificationCount, 5000); // Adjust interval as needed  // Enable this shits
