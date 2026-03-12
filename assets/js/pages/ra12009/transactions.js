import { postData, deleteData, getData } from '../../request.js';

const transactions = {
    fields(form) {
        return {
            bid_notice_title: document.querySelector('#bidNoticeTitle').value,
            pr_classification: JSON.stringify([document.querySelector('#prClassification').value, document.querySelector('#procurementType').value]),
            // procurement_type: document.querySelector('#procurementType').value,
            approved_budget: document.querySelector('#budget').value,
            requisitioner: document.querySelector('#requisitioner').value,
            bac_unit: document.querySelector('#bacUnit').value,
            fund_source: document.body.dataset.fundsAllocation,
            division: JSON.parse(document.getElementById('sessionUser').dataset.details)?.designation.division,
        };
    },

    clear(form) {
        form.querySelectorAll('input, select, textarea').forEach(el => {
            if (el.type === 'checkbox' || el.type === 'radio') {
                el.checked = false;
            } else {
                el.value = '';
            }
        });

    },

    create(transaction) {
        const targetForm = document.getElementById('lastestModificationsTransactions');

        if (!targetForm) return;

        const formData = this.fields(targetForm);

        if (!formData.fund_source) {
            notifyCustom(
                'exclamation',
                'Fields are empty',
                'Source of Funds is currently unset.',
                'danger'
            );
            return
        }

        delete formData.procurement_type

        if (!formData.bid_notice_title) {
            notifyCustom(
                'exclamation',
                'Fields are empty',
                'Submission failed: Bid Notice Title is a mandatory field.',
                'danger'
            );
            return;
        }

        const newEntry = { ...transaction, ...formData };
        console.log({ newEntry })
        return newEntry;
    },



    delete(transactionId) {
        // implement deletion logic here
        console.log("Deleted transaction with ID:", transactionId);
    },

};

// Event listener
document.querySelector('#createTransactions')
    .addEventListener('click', async () => {
        try {
            const targetForm = document.getElementById('lastestModificationsTransactions');
            const urlParams = new URLSearchParams(window.location.search);

            const newTransaction = {
                remarks: JSON.stringify({
                    messages: "New transaction",
                    createdAt: Date.now()
                }),
                marketScopeID: urlParams.get("market-scope"),
                prepared_by: document.getElementById('created_by').value
            };

            // Send to backend
            const result = await postData('/transactions/new', transactions.create(newTransaction));

            if (result) {
                notifyCustom('check', 'Success', 'Successfully created Purchase Request', 'success');
                this.clear(targetForm)
            } else {
                notifyCustom('exclamation', 'Error', 'Failed to create Purchase Request', 'danger');
            }
        } catch (err) {
            console.error('Transaction creation failed:', err);
            notifyCustom('exclamation', 'Error', 'Unexpected error occurred', 'danger');
        }
    });

