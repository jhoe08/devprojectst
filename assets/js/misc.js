

let dangers = document.querySelectorAll('.form-button-action .btn-danger');
let views = document.querySelectorAll('.form-button-action .btn-primary');
// var amount = 5000.25;


// console.log(formatter.format(amount));

const exampleModal = document.getElementById('exampleModal')
if (exampleModal) {
  exampleModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget
    // Extract info from data-bs-* attributes
    const recipient = button.getAttribute('data-bs-whatever')
    const transaction = JSON.parse(button.parentNode.dataset.transaction)
    console.log(transaction)

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
    modalRequisitioner.innerHTML = `— ${requisitioner} <span class="badge badge-warning">${division}</span>`

    // modalBodyInput.value = recipient
  })
}


views.forEach(view=>{
    view.addEventListener('click', ()=>{
        let transactions = view
        // transid = danger.target
        let {transid} = transactions.dataset
        let title = `Transaction Details ${transid}`
        let description = 'Peskot na~'
    })
})
// console.log(dangers)
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
