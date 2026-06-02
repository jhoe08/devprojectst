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

window.addEventListener('DOMContentLoaded', async () => {
    const form = document.getElementById('disbursementVoucherForm');
    await fetchDisbursementVoucher(form.dv_number.value).then(data => {
        if (data && data.length > 0) {
            form.remove();
        }
    })
})
