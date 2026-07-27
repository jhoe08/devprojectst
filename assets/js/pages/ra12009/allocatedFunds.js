
const fundType = $('.allocatedFunds').attr('id')

const allocatedFundsTable = $('.allocatedFunds')?.DataTable({
    responsive: true,
    // order: [[1, 'asc']],
    columnDefs: [
        {
            // targets: 5,
            // render: (data, type, row) => {
            //     const values = JSON.parse(data || '[]');
            //     console.log(values)
            //     return Object.entries(values)
            //         .filter(([key, val]) => val && val.trim() !== "")
            //         .map(([key, val]) => `<span class="badge badge-count">${key}: ${val}</span>`)
            //         .join(' ');
            // }
        },
    ]
});


if (fundType === 'current') {
    allocatedFundsTable.column(':contains("SOURCE")').visible(false);
} else if (fundType === 'continuing') {
    allocatedFundsTable.column(5).search('^(?!\\s*$).+', true, false).draw();
}


console.log(allocatedFundsTable.columns().header().toArray().map(h => h.innerText));