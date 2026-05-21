const addFundSourceTemplate = document.getElementById('addFundSourceTemplate')?.content;
const fundSourceLists = document.getElementById('fundSourceLists');
const addFundSourceButton = document.getElementById('addFundSourceButton')
// const purchaseOrderForm = document.getElementById('purchaseOrderForm')
// const submitBtn = document.getElementById('submitBtn')

function createFundSourceEntry(data = {}) {
    const clone = document.importNode(addFundSourceTemplate, true);
    const entry = clone.querySelector('.fund-entry');
    const currentBtn = entry.querySelector('.current');
    const continuingBtn = entry.querySelector('.continuing');
    
    const removeBtn = entry.querySelector('.remove-fund-source-btn');

    // productInput.value = data.product || '';
    // quantityInput.value = data.quantity || '';
    // unitPriceInput.value = data.unit_price || '';

    // Remove handler
    removeBtn.addEventListener('click', () => {
        entry.remove();
        // if no entries left, add an empty one to keep UI consistent
        if (fundSourceLists.children.length === 0) createFundSourceEntry();
    });

        fundSourceLists.appendChild(entry);
    return entry;
}

// Add initial entry if none exist
if (fundSourceLists.children?.length === 0) createFundSourceEntry();

// Add button
addFundSourceButton.addEventListener('click', () => {
    const newEntry = createFundSourceEntry();
    // focus the name input for quick typing
    // newEntry.querySelector('.product').focus();
});

// Helper: collect persons into array of objects
// function collectProducts() {
//     const products = Array.from(fundSourceLists.querySelectorAll('.product-entry')).map(entry => {
//         return {
//             product: entry.querySelector('.product').value.trim() || null,
//             quantity: entry.querySelector('.quantity').value.trim() || null,
//             unit_price: entry.querySelector('.unit-price').value.trim() || null
//         };
//     }).filter(p => p.product); // keep only entries with a name
//     return products;
// }

  // Form submit: serialize products into hidden input, validate required fields
// purchaseOrderForm.addEventListener('submit', function(e) {
//     // e.preventDefault()  
//     const purchase_request_id = purchaseOrderForm.querySelector('#purchase_request_id')
//     const supplier_code = purchaseOrderForm.querySelector('#supplier_code')
    
//     const po_number = purchaseOrderForm.querySelector('#order_number')
//     const status = purchaseOrderForm.querySelector('#status')
//     const products = collectProducts();

//     // 
//     submitBtn.disabled = true;
// })

// Usage: call window.prefillResponsible([{name:'A',position:'B',contact:'C'}])
window.prefillResponsible = function (arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    // clear existing
    fundSourceLists.innerHTML = '';
    arr.forEach(p => createFundSourceEntry(p));
};