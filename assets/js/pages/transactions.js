
function stringToArray(str, callback) {
  const separated = str
    .slice(1, -1)
    .split(',')
    .map(item => item.trim().replace(/"/g, ''))
    .filter(item => item !== 'null' && item !== '');
  return separated.map(callback).join(' '); // returns a string
}

function progressBar(length, progress) {
  if (progress > 0) {
    step = parseInt(progress)

    progress = Number((progress / length) * 100).toFixed(2);
    var html = `<div class="progress" style="height: 5px;"><div class="progress-bar" style="width: ${progress}%" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${step}"></div></div>`
  }

  return (progress > 0) ? html : '';
}

// Usage: no need for .join()
// ${stringToArray(row[7], item => `<span class="badge badge-success">${item}</span>`)}

export default function configTransactions() {
  return {
    responsive: true,
    // rowReorder: { selector: 'td:nth-child(2)' },
    order: [[0, 'desc']],
    columnDefs: [
      {
        render: (data, type, row) => `
          <div class="d-flex justify-content-between align-items-center">
            <div>
              <span class="badge badge-info mr-2">${row[0]}</span>
              <span data-head="Classification" class="badge badge-secondary mr-2">${row[9]}</span>
            </div>
            <div data-head="Transaction Codes">
              ${stringToArray(row[7], item => `<span class="badge badge-success">${item}</span>`)}
            </div>
          </div>
          <div class="mt-1">${data}</div>
          ${progressBar(30, row[12])}
        `,
        targets: 1
      },
      {
        render: (data, type, row) => `
          ${data}
          ${row[3] ? `<br><span data-head="Division" class="badge badge-warning">${row[3]}</span>` : ''}
        `,
        targets: 2
      },
      {
        render: $.fn.dataTable.render.number(',', '.', 2, '₱'),
        className: 'text-right',
        targets: 5
      },
      { visible: false, targets: [0, 3, 7, 8, 9, 12] }
    ]
  };
}