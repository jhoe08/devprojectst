const marketScope = {
  init() {
    const form = document.getElementById('marketScope');
    const dateInput = document.querySelectorAll('input[type="date"]');

    let tables = $("#marketScope").DataTable();

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(e);
      });
    }

    if (dateInput) {
      dateInput.forEach(input => {
        if (input.showPicker) {
          input.addEventListener('focus', () => {
            input.showPicker();
          });
        }
      });
    }
    console.log('Market Scope page initialized');
  },

  handleSubmit(e) {
    let payload = {};
    e.target.querySelectorAll('input, select, textarea, checkbox').forEach(input => {
      if (input.type === 'file') {
        return; // skip file inputs
      }

      if (input.type === 'checkbox') {
        payload[input.name] = input.checked; // true/false
      } else {
        payload[input.name] = input.value;
      }
      console.log(`${input.name}: ${payload[input.name]}`);
    });

    fetch('/api/market-scope', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    })
      .then(response => response.json())
      .then(data => {
        console.log('Success:', data);
        alert('Market Scope form submitted successfully!');
        // Reset form after submission
        e.target.reset();
      })
      .catch((error) => {
        console.error('Error:', error);
        alert('An error occurred while submitting the form.');
      });
  },

};

export default function configMarketScopes() {
  return {
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    responsive: true,
    columnDefs: [{
      render: (data, type, row) => `
        <div class="p-2 projectTitle">
          <div class="d-flex justify-content-between">
            <span class="id fw-bold badge badge-info">#${row[0]}</span>
            <span class="dateCreated text-muted">${row[15]}</span>
          </div>
          <div class="mt-1">
            <h6 class="title mb-1">${data}</h6>
            <small class="d-flex justify-content-between">
              <span class="unit">${row[4]}</span>
              <span class="activities">
                ${row[5] ? '<span class="badge badge-count">consultations_with_suppliers</span>' : ''}
                ${row[6] ? '<span class="badge badge-black">participation_in_summits</span>' : ''}
                ${row[7] ? '<span class="badge badge-primary">review_reports</span>' : ''}
                ${row[8] ? '<span class="badge badge-info">review_brochures</span>' : ''}
                ${row[9] ? '<span class="badge badge-success">price_sourcing</span>' : ''}
                ${row[10] ? '<span class="badge badge-warning">use_philgeps_data</span>' : ''}
                ${row[11] ? '<span class="badge badge-danger">other_activity</span>' : ''}
                ${row[12] ? '<span class="badge badge-secondary">documentation</span>' : ''}
              </span>
            </small>
          </div>
          <div class="mt-2 d-flex justify-content-between">
            <div class="preparedBy">
              <strong>Prepared by:</strong> <br>${row[13]}, ${row[14]}
              <i class="${row[16] ? 'icon-check text-success' : 'icon-trash text-danger'}"></i>
            </div>
            <div class="reviewedBy">
              <strong>Reviewed by:</strong> <br>${row[17] ? row[17] + ', ' + row[18] : ''}
              <i class="${row[20] ? 'icon-check text-success' : 'icon-trash text-danger'}"></i>
            </div>
          </div>
        </div>
      `, targets: 1
      }, {
      render: function (data, type, row) {
        const actions = JSON.parse(data);
        return  `
          <div class="d-flex justify-content-center">
            <span data-bs-toggle="tooltip" aria-label="View Market Scope" data-bs-original-title="View Market Scope">
              <a href="${actions.view}" data-id="${row.id}" class="btn btn-link btn-primary">
                <i class="fa fa-eye"></i>
              </a>
            </span>
            <span data-bs-toggle="tooltip" aria-label="Update Market Scope" data-bs-original-title="Update Market Scope">
              <a href="${actions.update}" data-id="${row.id}" class="btn btn-link btn-warning">
                <i class="fa fa-edit"></i>
              </a>
            </span>
            <span data-bs-toggle="tooltip" aria-label="Delete Market Scope" data-bs-original-title="Delete Market Scope">
              <a href="${actions.delete}" data-id="${row.id}" class="btn btn-link btn-danger">
                <i class="fa fa-trash"></i>
              </a>
            </span>
          </div>
        `;
        }, targets: 23
      }
      , { targets: [1, 2, 3, -1], visible: true }
      , { targets: '_all', visible: false }
      , { targets: 'nosort', orderable: false }
    ]
  };
}


document.addEventListener('DOMContentLoaded', () => {
  marketScope.init();
});


