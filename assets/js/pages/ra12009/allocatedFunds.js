
function addCell(tr, content, colSpan = 1) {
	let td = document.createElement('th');

	td.colSpan = colSpan;
	td.textContent = content;

	tr.appendChild(td);
}

const fundType = $('.allocatedFunds').attr('id')

const allocatedFundsTable = $('.allocatedFunds')?.DataTable({
    columns: [
        { data: 'fund' },
        { data: 'pap' },
        { data: 'class' },
        { data: 'obj_code' },
        { data: 'description' },
        { data: 'source' },
        { data: 'adjusted_allotment' },
        { data: 'obligation' },
        { data: 'unobligated_allotment' },
        { data: 'earmark' },
        { data: 'balance_net_earmark' },
        { data: 'actions' }
    ],
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
    ],
    rowGroup: {
		startRender: null,
		endRender: function (rows, group) {
			let salaryAvg =
				rows
					.data()
					.pluck(5)
					.reduce((a, b) => a + b.replace(/[^\d]/g, '') * 1, 0) / rows.count();

			// Use DataTable's number formatter
			salaryAvg = DataTable.render
				.number(null, null, 0, '$')
				.display(salaryAvg);

			let ageAvg =
				rows
					.data()
					.pluck(3)
					.reduce((a, b) => a + b * 1, 0) / rows.count();

			let tr = document.createElement('tr');

			addCell(tr, 'Averages for ' + group, 3);
			addCell(tr, ageAvg.toFixed(0));
			addCell(tr, '');
			addCell(tr, salaryAvg);

			return tr;
		},
		dataSrc: 2
	}
});


if (fundType === 'current') {
    // allocatedFundsTable.column(':contains("SOURCE")').visible(false);
    allocatedFundsTable.column(5).search('^\\s*$', true, false).draw();
} else if (fundType === 'continuing') {
    allocatedFundsTable.column(5).search('^(?!\\s*$).+', true, false).draw();
}


// console.log(allocatedFundsTable.columns().header().toArray().map(h => h.innerText));