async function fetchDisbursementVoucher(id) {
    try {
        const res = await fetch(`/api/disbursementVouchers/${id}`);
        if (!res.ok) throw new Error(`HTTP error! on fetchDisbursementVoucher() status: ${res.status}`);
        const data = await res.json();

        return data
    } catch (err) {
        console.error("Error on fetchDisbursementVoucher at /assets/js/pages/disbursementVouchers/index.js", err);
    }
}

document.querySelectorAll('.form-button-action #viewPage')?.forEach(async el => {
    const voucherId = el.dataset.voucher;
    try {
        const voucher = await fetchDisbursementVoucher(voucherId); // must await if async
        console.log("Element:", voucher);

        if (voucher && voucher.length > 0) {
            el.closest('[data-bs-toggle="tooltip"]').setAttribute('data-bs-original-title', 'View Voucher')
            el.setAttribute('href', `/disbursementVouchers/${voucherId}/view`);
            el.classList.add('btn-success')
            el.classList.remove('btn-danger')
        }
    } catch (err) {
        console.error("Error fetching products for", product_id, err);
    }
})