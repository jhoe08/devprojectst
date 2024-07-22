let dangers = document.querySelectorAll('#basic-datatables .form-button-action .btn-danger');
let views = document.querySelectorAll('#basic-datatables .form-button-action .btn-primary');
let transcode = document.getElementById('#transcode')
let createTrans = document.getElementById('createTransactions')

const exampleModal = document.getElementById('exampleModal')
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

    modalTitle.textContent = `Transaction ID #${recipient}`
    modalClassification.textContent = pr_classification
    modalBACUnit.textContent = bac_unit
    modalBannerProgram.textContent = banner_program
    modalPRDate.textContent = pr_date
    modalBodyTitle.textContent = bid_notice_title
    modalBudget.textContent = `${approved_budget}`
    modalFundSource.textContent =  fund_source
    modalRequisitioner.innerHTML = `<i class="fas fa-user-circle"></i> ${requisitioner} — <span class="badge badge-warning">${division}</span> `


    new QRCode("transid-"+recipient, recipient);

    modalFooterLink.setAttribute('href', `/transactions/${recipient}/remarks`)

    // modalBodyInput.value = recipient
  })
}

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

if (dangers) {
  dangers.forEach(danger=>{
    danger.addEventListener('click', ()=>{
          let transactions = danger
          // transid = danger.target
          let {transid} = transactions.dataset
          console.dir(transid)
  
          title = `Are you sure to delete ${transid}?`
          message = "Once deleted, you will not be able to recover this imaginary file!"
      swal({
        // title: "Are you sure to delete Transaction ID ${transid}?",
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
                  return res.text()}) // or res.json()
                .then(data => {
                  swal("Poof! Transaction file has been deleted!", {
                      icon: "success",
                    });
                  })
          } 
        });
    })
  })
  
}

if (transcode) {
  transcode.addEventListener('click', function(){

  })
}

if (createTrans) {
  let bidNoticeTitle = document.querySelector('#bidNoticeTitle')
  let prClassification = document.querySelector('#prClassification')
  let requisitioner = document.querySelector('#requisitioner')
  let division = document.querySelector('#division')
  let budget = document.querySelector('#budget')
  let fundSource = document.querySelector('#fundSource')
  let bannerProgram = document.querySelector('#bannerProgram')
  let bacUnit = document.querySelector('#bacUnit')
  let remarks = document.querySelector('#remarks')

  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  createTrans.addEventListener('click', async () => {

    let bidNoticeTitleValue = bidNoticeTitle.value
    let prClassificationValue = prClassification.value
    let requisitionerValue = requisitioner.value
    let divisionValue = division.value
    let budgetValue = budget.value
    let fundSourceValue = fundSource.value
    let bannerProgramValue = bannerProgram.value
    let bacUnitValue = bacUnit.value
    let remarksValue = remarks.value

    const apiUrl = 'http://localhost:4000/transactions/new';
    let data = { 
      bid_notice_title: bidNoticeTitleValue, 
      pr_classification: prClassificationValue, 
      requisitioner: requisitionerValue, 
      division: divisionValue,
      approved_budget: budgetValue,
      fund_source: fundSourceValue,
      banner_program: bannerProgramValue, 
      bac_unit: bacUnitValue,
      fund_source: 'asd',
      remarks: {
          createby: 'JustJoe',
          message: remarksValue
      } 
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
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log('YAWA')
      console.log(JSON.stringify(data, null, 2))
    })
    .catch(error => {
      console.error('Error:', error);
    });
  
    // console.log(response.body )

    // if (response.ok) {
    //     console.log("Data sent successfully");
    // } else {
    //     console.error("Failed to send data");
    // }
  });
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

pr_date()
