import { postData, deleteData, getData, updateData } from '../../request.js';
import { validateFundSource } from '../../helpers/jsonHelper.js';

const transactions = {

    fields(form) {
        return {
            bid_notice_title: document.querySelector('#bidNoticeTitle').value, // mandatory field
            // pr_classification: JSON.stringify([document.querySelector('#prClassification').value, document.querySelector('#procurementType').value]),
            pr_classification: document.querySelector('#prClassification').value, // default others
            procurement_type: document.querySelector('#procurementType').value, // default Small Value Procurement
            approved_budget: document.querySelector('#budget').value, // auto-filled based on fund_source
            requisitioner: document.querySelector('#requisitioner').value, // auto-filled
            bac_unit: document.querySelector('#bacUnit').value, // default BAC 1
            fund_source: document.body.dataset.fundsAllocation, // mandatory field
            division: JSON.parse(document.getElementById('sessionUser').dataset.details)?.designation.division, // auto-filled based on user session
        };
    },

    readonly() {
        // $('input[readonly]').closest('.form-group').addClass('readonly');
        const elements = document.querySelectorAll('input[readonly], select[readonly], textarea[readonly]');
        return elements.forEach(el => {
            el.closest('.form-group').classList.add('readonly');
        });
    },

    clear() {
        return setInterval(() => { window.location.reload() }, 3000)
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
            return;
        }

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
        return newEntry;
    },

};

// readonly Fields
transactions.readonly();

const targetForm = document.getElementById('lastestModificationsTransactions');

targetForm.querySelectorAll('input, select, textarea').forEach(input => {
    input.addEventListener('change', () => {
        input.classList.add('updated'); // mark as updated
    });
});

// Create Event listener
document.querySelector('#createTransactions')
    ?.addEventListener('click', async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const preparedBy =JSON.parse(document.getElementById('created_by').value);

            const newTransaction = {
                remarks: {
                    messages: "New transaction",
                    createdAt: Date.now()
                },
                marketScopeID: Number(urlParams.get("market-scope")),
                prepared_by: preparedBy,
            };

            console.log('Creating transaction with data:', newTransaction.prepared_by);

            const payload = transactions.create(newTransaction);

            if (!payload) return notifyCustom('exclamation', 'Error', 'Failed to create Purchase Request', 'danger');

            // Send to backend
            // const result = await postData('/transactions/new', payload);
            const result = await postData('/transactions/add', payload);

            if (result) {
                notifyCustom('check', 'Success', 'Successfully created Purchase Request', 'success');
                transactions.clear()
            } else {
                notifyCustom('exclamation', 'Error', 'Failed to create Purchase Request', 'danger');
            }
        } catch (err) {
            console.error('Transaction creation failed:', err);
            notifyCustom('exclamation', 'Error', 'Unexpected error occurred', 'danger');
        }
    });

// Update Event listener
document.querySelector('#updateTransactions')
    ?.addEventListener('click', async () => {
        try {
            const urlParams = new URLSearchParams(window.location.search);
            const transactionId = document.querySelector('[data-transaction-id]').getAttribute('data-transaction-id');

            const updatedFields = {};
            targetForm.querySelectorAll('.updated').forEach(input => {
                updatedFields[input.name] = input.type === 'checkbox'
                    ? input.checked
                    : input.value;
            });

            // Build payload
            const payload = { set: {}, where: { product_id: transactionId } };

            // Special routing for JSON_SET
            if (updatedFields.procurementType) {
                payload.set.pr_classification = `JSON_SET(pr_classification, '$[1]', '${updatedFields.procurementType}')`;
            }

            if (updatedFields.prClassification) {
                payload.set.pr_classification = `JSON_SET(pr_classification, '$[0]', '${updatedFields.prClassification}')`;
            }

            // Normal fields (just assign raw values)
            Object.keys(updatedFields).forEach(key => {
                if (key !== 'procurementType' && key !== 'prClassification') {
                    payload.set[key] = updatedFields[key];
                }
            });

            if (Object.keys(payload.set).length === 0) {
                notifyCustom('exclamation', 'No Changes', 'No fields were updated.', 'warning');
                return;
            }
            // Send to backend
            const result = await updateData(`/transactions/update`, payload);

            if (result) {
                notifyCustom('check', 'Success', 'Successfully updated Purchase Request', 'success');
            } else {
                notifyCustom('exclamation', 'Error', 'Failed to update Purchase Request', 'danger');
            }
        } catch (err) {
            console.error('Transaction update failed:', err);
            notifyCustom('exclamation', 'Error', 'Unexpected error occurred', 'danger');
        }
    });

setInterval(() => {
    const numberInputs = document.querySelectorAll('input[data-type="number"]');
    // Add event listener to each input

    numberInputs.forEach(input => {
        // console.log('Updating totals and formatting numbers...', formatNumberWithCommas);
        // input.addEventListener('change', formatNumberWithCommas);  
        formatNumberWithCommas({ target: input }); // Initial formatting on page load
    });
}, 1000);