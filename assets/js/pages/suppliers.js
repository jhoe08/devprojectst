const main = {
  addSupplier: () => {
    console.log('Add New Supplier Module Loaded');

    const form = document.getElementById('supplierForm');
    const btn = document.getElementById('addSupplier');

    if (!form || !btn) return;

    form.addEventListener('submit', function (e) {
      e.preventDefault();
    
      const formData = new FormData(form);
      let allEmpty = true;

      console.log(' Checking form data for empty fields', form);

      for (let [key, value] of formData.entries()) {
         console.log(`${key}: ${value}`);

        if (value.trim() !== '') {
          allEmpty = false;
          break;
        }
      }

      console.log('Submitting Supplier Data', formData.entries());

      if (allEmpty) {
        notifyCustom('bell', 'Empty Fields', 'Please fill in at least one field before submitting.', 'danger');
        return;
      }

      notifyCustom('bell', 'Submitting', 'Sending supplier data...', 'info');
      
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      };
        
      fetch('/suppliers/add', requestOptions)
        .then(response => response.json())
        .then(data => {
          console.log('Success:', data);
          notifyCustom('check', 'Success', 'Supplier added successfully.', 'success');
          form.reset();
        })
        .catch((error) => {
          console.error('Error:', error);
          notifyCustom('alert', 'Error', 'Failed to submit supplier data.', 'danger');
        });
    });

    btn.addEventListener('click', function (e) {
      console.log('Add Supplier Button Clicked');
      form.requestSubmit(); // triggers the form's submit event
    });
  },
  submitSupplier: () => {
    console.log('Submit Supplier Module Loaded');
    const btn = document.getElementById('submitSupplier');
    const form = document.getElementById('supplierInfo');
    const wrapper = document.getElementsByClassName('wrapper')

    if (!form || !btn) return;

    btn.addEventListener('click', function (e) {
      const needsUpdate = fieldsUpdated('#supplierInfo')
      console.log('Fields needing update:', needsUpdate);

      const suppliers = {}
      
      const rows = form.querySelectorAll('.row');
        
      rows.forEach(row => {
        const input = row.querySelector('input');
        const select = row.querySelector('select');

        if (select && input) {
          const supplierCode = select.value.trim();
          const quotedPrice = input.value.trim();

          if (supplierCode && quotedPrice) {
            suppliers[supplierCode] = quotedPrice;
          }
        }

      });

      console.log('Collected Suppliers:', suppliers);

      if (Object.keys(suppliers).length === 0) {
        console.warn('No supplier inputs found.');
        return;
      }

      const supplierData = Object.entries(suppliers).map(([id, quoted_price]) => ({ id, quoted_price }));

      console.log('Submit Supplier Button Clicked', { suppliers: supplierData });

      if (supplierData.length === 0) {
        notifyCustom('bell', 'No Suppliers', 'Please enter at least one supplier.', 'danger');
        return;
      }

      // Prepare payload
      const payload = {
        transaction_id: wrapper[0].dataset.productId || null, // optional if embedded
        suppliers: supplierData
      };

      // Submit to backend
      fetch(`/transactions/${wrapper[0].dataset.productId}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      })
        .then(response => response.json())
        .then(data => {
          if (data.status === 200) {
            console.log('Submission Success:', data);
            notifyCustom('check', 'Submitted', 'Supplier list submitted successfully.', 'success');
            form.reset(); // optional: clear form after success
          } else {
            console.warn('Unexpected response status:', data.status, data);
            notifyCustom('alert', 'Warning', 'Submission may not have succeeded. Please verify.', 'warning');
          }
        })
        .catch(error => {
          console.error('Submission Error:', error);
          notifyCustom('alert', 'Error', 'Failed to submit supplier list.', 'danger');
        });
    });
  },
  updateSupplier: () => {
    // console.log('Update Supplier Module Loaded');
    // Implementation for updating suppliers can be added here
    const btn = document.getElementById('updateSupplier');
    const form = document.getElementById('supplierInfo');
    const wrapper = document.getElementsByClassName('wrapper')

    if (!form || !btn) return;

    btn.addEventListener('click', function (e) {
      const suppliers = {}
      console.log('Update Supplier Module Loaded');
    })
  },
  deleteSupplier: () => {
    document.querySelectorAll('.fa-minus-circle').forEach(removeIcon => {
      const button = removeIcon.closest('button');
      if (button) {
        button.addEventListener('click', function () {
          const row = this.closest('.row');
          const {transactionId, supplierId} = row.dataset

          if (row) {
            // console.log('Removing row:', row.dataset.id || row.id);
            console.log('Removing Supplier: ', {transactionId, supplierId})
            fetch(`/transactions/${transactionId}/suppliers/${supplierId}/delete`, {
              method: 'DELETE',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({transactionId, supplierId})
            })
            .then(response => response.json())
            .then(data => {
              console.log({'supplier.js': data})
              if(!data) return;
              row.remove();
              console.log('Deleted Supplier Qoute')
            })
          }
        });
      }
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {  

  // main.addSupplier();
  main.submitSupplier();
  main.deleteSupplier();
  
});