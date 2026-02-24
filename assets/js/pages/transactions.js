
function formattedDate(dateStr) {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  return date.toLocaleDateString(undefined, options);
}

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
    var html = `<div class="progress progress-sm" style="height: 5px;"><div class="progress-bar" style="width: ${progress}%" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${step}"></div></div>`
  }

  return (progress > 0) ? html : '';
}

export default function configTransactions() {
  return {
    responsive: true,
    order: [[0, 'desc']],
    columnDefs: [
      {
        render: (data, type, row) => {
          const values = JSON.parse(row[7] || '[]'); 
          const html = values.map(val => 
            `<span class="badge badge-count">${val}</span>`
          ).join(' ');


          return `
          <div class="d-flex justify-content-between">
            <div>
              <span class="badge badge-info mr-2">${row[0]}</span>
              <span data-head="Classification" class="badge badge-secondary mr-2">${row[9]}</span>
              <span data-head="BAC Unit" class="badge badge-warning mr-2">${row[10]}</span>
            </div>
            <div>${row[4].display}</div>
          </div>
          ${data}
          <div class="d-flex justify-content-between">
            <div class="requisitioner text-muted">Requisitioner: ${row[2]}</div>
            <div class="codes">${html}</div>
          </div>
          `
        },
        targets: 1
      },
      {
        render: (data, type, row) => {
          const values = (row[6] || '').split(', ');
          const html = values.map(val => 
            `<span class="badge badge-count">${val}</span>`
          ).join(' ');

          return `
          <div class="d-flex flex-column text-end">
            <h6>${peso(data)}</h6>
            ${html}
          </div>
          `
        },
        targets: 5
      },
      { visible: true, targets: [1, 5, -2] }, //[4, 6, 10, 12, -1]
      { visible: false, targets: '_all' },
    ]
  };
}

console.log('Transactions Config Loaded');