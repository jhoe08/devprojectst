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
        .then(async response => {
          const data = await response.json();
          console.log('Response from server:', response.status, data);
          if (response.ok) {
            console.log('Submission Success:', data);
            notifyCustom('check', 'Submitted', 'Supplier list submitted successfully.', 'success');
            // form.reset();
          } else {
            console.warn('Unexpected response status:', response.status, data);
            notifyCustom('alert', 'Warning', 'Submission may not have succeeded. Please verify.', 'warning');
          }
        })
        .catch(error => {
          console.error('Submission Error:', error);
          notifyCustom('alert', 'Error', 'Failed to submit supplier list.', 'danger');
        });

      // .then(response => response.json())
      // .then(data => {
      //   if (data.status === 200) {
      //     console.log('Submission Success:', data);
      //     notifyCustom('check', 'Submitted', 'Supplier list submitted successfully.', 'success');
      //     form.reset(); // optional: clear form after success
      //   } else {
      //     console.warn('Unexpected response status:', data.status, data);
      //     notifyCustom('alert', 'Warning', 'Submission may not have succeeded. Please verify.', 'warning');
      //   }
      // })
      // .catch(error => {
      //   console.error('Submission Error:', error);
      //   notifyCustom('alert', 'Error', 'Failed to submit supplier list.', 'danger');
      // });
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
  awardSupplier: () => {
    console.log('Award Supplier Module Loaded');
    // Implementation for awarding suppliers can be added here
    const btn = document.getElementById('awardSupplier');
    const innerContent = document.getElementById('innerContent');

    if (!btn) return console.warn('Award Supplier elements not found');

    btn.addEventListener('click', function (e) {
      const awardedSupplier = document.querySelector('input[name="awarded_supplier"]:checked');

      const supplierId = awardedSupplier.value;
      console.log('Award Supplier Button Clicked', { supplierId });
      if (!supplierId) {
        notifyCustom('bell', 'No Supplier Selected', 'Please select a supplier to award.', 'danger');
        return;
      }
      // Submit awarded supplier to backend
      fetch(`/transactions/${innerContent.dataset.productId}/suppliers/award`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ supplier_id: supplierId })
      })
        .then(response => response.json())
        .then(data => {
          console.log('Award Response from server:', data);
          //if (data.status === 200) {
          console.log('Award Success:', data);
          notifyCustom('check', 'Awarded', 'Supplier awarded successfully.', 'success');
          // } else {
          //   console.warn('Unexpected response status:', data.status, data);
          //   notifyCustom('bell', 'Warning', 'Awarding may not have succeeded. Please verify.', 'warning');
          // }
          setTimeout(() => {
            location.reload();
          }, 3000);
        })
        .catch(error => {
          console.error('Awarding Error:', error);
          notifyCustom('bell', 'Error', 'Failed to award supplier.', 'danger');
        });
    });
  }
};

document.addEventListener('DOMContentLoaded', () => {
  main.addSupplier();
  main.submitSupplier();
  main.updateSupplier();
  main.awardSupplier();
});