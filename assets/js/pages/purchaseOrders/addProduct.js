const addNewProductTemplate = document.getElementById('addNewProductTemplate')?.content;
const productList = document.getElementById('productList');
const addProductBtn = document.getElementById('addProductBtn')
const purchaseOrderForm = document.getElementById('purchaseOrderForm')
const submitBtn = document.getElementById('submitBtn')

function createProductEntry(data = {}) {
    const clone = document.importNode(addNewProductTemplate, true);
    const entry = clone.querySelector('.product-entry');
    const productInput = entry.querySelector('.product');
    const quantityInput = entry.querySelector('.quantity');
    const unitPriceInput = entry.querySelector('.unit-price');
    const removeBtn = entry.querySelector('.remove-product-btn');

    productInput.value = data.product || '';
    quantityInput.value = data.quantity || '';
    unitPriceInput.value = data.unit_price || '';

    // Remove handler
    removeBtn.addEventListener('click', () => {
        entry.remove();
        // if no entries left, add an empty one to keep UI consistent
        if (productList.children.length === 0) createProductEntry();
    });

    // Enter key in last input adds a new row for quick keyboard entry
    unitPriceInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            createProductEntry();
            // focus the name of the newly added entry
            const last = productList.lastElementChild;
            last.querySelector('.product').focus();
        }
    });

    productList.appendChild(entry);
    return entry;
}

// Add initial entry if none exist
if (productList.children?.length === 0) createProductEntry();

// Add button
addProductBtn.addEventListener('click', () => {
    const newEntry = createProductEntry();
    // focus the name input for quick typing
    newEntry.querySelector('.product').focus();
});

// Helper: collect persons into array of objects
function collectProducts() {
    const products = Array.from(productList.querySelectorAll('.product-entry')).map(entry => {
        return {
            product: entry.querySelector('.product').value.trim() || null,
            quantity: entry.querySelector('.quantity').value.trim() || null,
            unit_price: entry.querySelector('.unit-price').value.trim() || null
        };
    }).filter(p => p.product); // keep only entries with a name
    return products;
}

  // Form submit: serialize products into hidden input, validate required fields
purchaseOrderForm.addEventListener('submit', function(e) {
    // e.preventDefault()  
    const purchase_request_id = purchaseOrderForm.querySelector('#purchase_request_id')
    const supplier_code = purchaseOrderForm.querySelector('#supplier_code')
    
    const po_number = purchaseOrderForm.querySelector('#order_number')
    const status = purchaseOrderForm.querySelector('#status')
    const products = collectProducts();

    // 
    submitBtn.disabled = true;
})

// Usage: call window.prefillResponsible([{name:'A',position:'B',contact:'C'}])
window.prefillResponsible = function (arr) {
    if (!Array.isArray(arr) || arr.length === 0) return;
    // clear existing
    productList.innerHTML = '';
    arr.forEach(p => createProductEntry(p));
};