async function fecthProducts(id) {
    try {
        const res = await fetch(`/api/purchaseOrders/${id}`);
        if (!res.ok) throw new Error(`HTTP error! on updatePurchaseOrderButton() status: ${res.status}`);
        const data = await res.json();

        return data
    } catch (err) {
        console.error("Error on updatePurchaseOrderButton at /assets/js/pages/purchaseOrders/index.js", err);
    }
}

document.querySelectorAll('.form-button-action [data-product-id]')?.forEach(async el => {
    const product_id = el.dataset.productId;
    try {
        const products = await fecthProducts(product_id); // must await if async
        console.log("Element:", el);

        if (products && products.length > 0) {
            console.log({ products });
            el.closest('[data-bs-toggle="tooltip"]').setAttribute('data-bs-original-title', 'View Purchase Order')
            el.setAttribute('href', `/purchaseOrders/${product_id}/view`);
            el.classList.add('btn-success')
            el.classList.remove('btn-warning')
            el.querySelector('.fas').classList.add('fa-shopping-cart')
            el.querySelector('.fas').classList.remove('fa-cart-plus')
        }
    } catch (err) {
        console.error("Error fetching products for", product_id, err);
    }
})

