const marketScope = {
  init() {
    console.log('Market Scope page initialized');

    const form = document.getElementById('marketScopeForm');
    const formResults = document.getElementById('marketScopeResults')
    const dateInput = document.querySelectorAll('input[type="date"]');
    const dates = document.querySelectorAll('.date');
    // const print = document.querySelector('a[href="print"]')

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

    if (dates) {
      dates.forEach(date => {
        const dateObj = new Date(date.textContent);
        date.textContent = dateObj.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      });
    }

    if (formResults) {
      formResults.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmitResults(e);
      });
    }

    this.autoFill()


  },
  handleSubmit(e) {
    let payload = {};

    e.target.querySelectorAll('input, select, textarea').forEach(input => {
      if (input.type === 'file') return; // skip file inputs

      let value;
      if (input.type === 'checkbox') {
        value = input.checked; // true/false
      } else {
        value = input.value;
      }

      // If the name already exists, convert to array and push
      if (payload[input.name]) {
        if (!Array.isArray(payload[input.name])) {
          payload[input.name] = [payload[input.name]];
        }
        payload[input.name].push(value);
      } else {
        payload[input.name] = value;
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
  handleSubmitResults(e) {
    e.preventDefault();

    // Build JSON payload from form inputs
    const payload = {};
    const form = e.target;

    // Collect dropdowns and textareas
    form.querySelectorAll('select, textarea').forEach(input => {
      const name = input.name; // e.g., "project_cost.considered" or "project_cost.recommendation"
      const value = input.value;

      // Split into parameter + field (e.g., "project_cost" + "considered")
      const [param, field] = name.split('.');
      if (!payload[param]) payload[param] = {};
      payload[param][field] = value;
    });

    // Example: attach metadata
    const requestData = {
      scoping_id: form.dataset.scopingId, // assume scoping_id stored in form attribute
      results: payload,
      document_reference: form.querySelector('input[name="document_reference"]')?.value || null
    };

    // Debug log
    console.log("Submitting Market Scoping Results:", requestData);

    // Send to backend API
    fetch('/api/market-scope-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(requestData)
    })
      .then(res => res.json())
      .then(data => {
        console.log('Success:', data);
        alert('Market Scoping Results submitted successfully!');
        form.reset();
        location.reload()
      })
      .catch(err => {
        console.error('Error:', err);
        alert('An error occurred while submitting the results.');
      });
  },
  checkDateConducted(date) {
    // Determine icon class
    const iconClass = !row[3]
      ? (row[20] ? 'fas fa-user-check text-success' : 'fas fa-user-times text-danger')
      : 'fas fa-user-clock';

    // Determine display text
    const displayText = [row[17], row[18]].filter(Boolean).join(', ');

    // Render
    return `
      <i class="${iconClass}"></i>
      ${displayText}
    `;
  },
  autoFill() {
    const preparedBy = document.getElementById('preparedBy')
    const reviewedBy = document.getElementById('reviewedBy')

    if (preparedBy && reviewedBy) {
      const localUser = document.getElementById('created_by')

      // Parse the JSON string from the hidden input value
      const userData = JSON.parse(localUser.value)

      // Parse the JSON string from the data-responsible attribute
      const userResponsible = JSON.parse(localUser.dataset.responsible)

      preparedBy.value = `${userData.name}, ${userData.position}`
      reviewedBy.value = userResponsible?.section ? `${userResponsible.section.name}, ${userResponsible.section.position || 'Section Head'}` : userResponsible?.division ? `${userResponsible.division.name}, ${userResponsible.division.position || 'Division Head'}` : 'Dir. Angel C. Enriquez, DA-RFO7'
    }
  },
};

export function configMarketScopes() {
  return {
    paging: true,
    searching: true,
    ordering: true,
    info: true,
    responsive: true,
    order: [[0, 'desc']],
    columnDefs: [
      {
        render: (data, type, row) => `
        <div class="p-2 projectTitle">
          <div class="d-flex justify-content-between">
            <span class="id fw-bold badge badge-info">#${row[0]}</span>
            <span class="dateCreated date text-muted">${row[17]}</span>
          </div>
          <div class="mt-1">
            <h6 class="title mb-1">${data}</h6>
            <small class="d-flex justify-content-between">
              <span class="unit">${row[5]}</span>
              <span class="activities">
                ${row[6] ? '<span class="badge badge-count">consultations_with_suppliers</span>' : ''}
                ${row[7] ? '<span class="badge badge-black">participation_in_summits</span>' : ''}
                ${row[8] ? '<span class="badge badge-primary">review_reports</span>' : ''}
                ${row[9] ? '<span class="badge badge-info">review_brochures</span>' : ''}
                ${row[10] ? '<span class="badge badge-success">price_sourcing</span>' : ''}
                ${row[11] ? '<span class="badge badge-warning">use_philgeps_data</span>' : ''}
                ${row[11] ? '<span class="badge badge-danger">other_activity</span>' : ''}
                ${row[12] ? '<span class="badge badge-secondary">documentation</span>' : ''}
              </span>
            </small>
          </div>
          <div class="mt-2 d-flex justify-content-between">
            <div class="preparedBy">
              <strong>Prepared by:</strong> <br>
              <i class="${row[17] ? 'fas fa-user-edit text-success' : 'fas fa-user-times text-danger'}"></i>
              ${row[15]}, ${row[16]}
            </div>
            <div class="reviewedBy">
              <strong>${!row[3] == null ? 'Reviewed by:' : 'Reviewing...'}</strong> <br>
              <i class="${!row[3] == null
            ? (row[21] ? 'fas fa-user-check text-success' : 'fas fa-user-times text-danger')
            : 'fas fa-user-clock text-warning'
          }"></i>
              ${row[19] ? row[19] + ', ' + row[20] : ''}
            </div>
          </div>
        </div>
      `, targets: 1
      },
      {
        render: function (data, type, row) {
          const actions = JSON.parse(data);
          return `
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
        }, targets: 25
      },
      { targets: [1, 4, -1], visible: true },
      { targets: '_all', visible: false },
      { targets: 'nosort', orderable: false }
    ]
  };
}

export function configMarketScopesTransactions() {
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

          // const [classification, procurementType] = JSON.parse(row[9]) || [];
          const classification = row[9];
          const procurementType = row[13]
          const classification_type = `
            <span data-head="Classification" class="badge badge-secondary mr-2">${classification}</span>
            <span data-head="Procurement Type" class="badge badge-primary mr-2">${procurementType}</span>
          `;

          return `
          <div class="d-flex justify-content-between">
            <div>
              <span class="badge badge-info mr-2">${row[0]}</span>
              ${classification_type}
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
      // {
      //   render: (data, type, row) => {
      //     const fund_source = row[6] || '';

      //     const source = JSON.parse(fund_source)

      //     const sources = source.map(item => item.source);

      //     // console.log(sources)

      //     const values = sources[0].split(',').map(v => v.trim()).filter(Boolean);

      //     const html = values.map(val => {
      //       // Safely split on " | "
      //       const [fund, meta] = val.split('::')
      //       const [paps, cls, obj, desc, source] = meta.split(' | ').filter(Boolean);
      //       const badgeClass = source === undefined ? 'info' : 'warning';

      //       return `<span class="badge badge-${badgeClass}" data-bs-toggle="tooltip" data-bs-original-title="${paps}">${cls} | ${obj} | ${desc}</span>`;
      //     }).join(' ');

      //     return `
      //     <div class="d-flex flex-column text-end">
      //       <h6>${peso(data)}</h6>
      //       ${html}
      //     </div>
      //     `
      //   },
      //   targets: 5
      // },
      { visible: true, targets: [1, 5, -3] }, //[4, 6, 10, 12, -1]
      { visible: false, targets: '_all' },
    ]
  };
}

document.addEventListener('DOMContentLoaded', () => {
  marketScope.init();
});