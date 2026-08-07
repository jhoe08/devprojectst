// 0 -15 product_id
// 1 -14 trans_id 
// 2 -13 trans_code
// 3 -12 pr_date  
// 4 -11 approved_budget 
// 5 -10 pr_classification
// 6 -9 procurement_type  
// 7 -8 requisitioner  
// 8 -7 prepared_by 
// 9 -6 division 
// 10 -5 banner_program  
// 11 -4 fund_source  
// 12 -3 bac_unit 
// 13 -2 bid_notice_title  
// 14 -1 remarks


/* <tr>

    <td data-index="0" class="">4</td>

    <td data-index="1" class="">PR20260513-00004</td>

    <td data-index="2" class=""></td>

    <td data-index="3" class="">[null,"PS-05-13-260001","BS-05-13-260001"]</td>

    <td data-index="4" class="">May 13, 2026</td>

    <td data-index="5" class="">₱29,832,000.00</td>

    <td data-index="6" class="">Goods</td>

    <td data-index="7" class="">Limited Source Bidding</td>

    <td data-index="8" class="">G. Avila / R. Manzano</td>

    <td data-index="9" class="">{"employeeid":1234,"name":"Noli N. Rasonable","position":"Agriculturist II"}</td>

    <td data-index="10" class=""></td>

    <td data-index="11" class=""></td>

    <td data-index="12" class="">[{"amount": "29832000", "source": "01101101::310101100003000 PSS CORN | MOOE | 50203100-00 | Agricultural and Marine Supplies Exp."}]</td>

    <td data-index="13" class="">BAC 1</td>

    <td data-index="14" class="">GM Hybrid Yellow Certified Corn Seeds 1 lot <div class="progress progress-sm sasdsads" style="height: 5px;"><div class="progress-bar" style="width: 89.66%" role="progressbar" aria-valuenow="89.66" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="Cashiering Unit"></div></div></td>

    <td data-index="15" class="">{"message":"Created Transaction"}</td>

    <td data-index="16" class=""></td>

    <td data-index="17" class="">4</td>

    <td data-index="18" class="text-center">
        <div class="form-button-action" data-transid="2">
            <span data-bs-toggle="tooltip" aria-label="View Transactions" data-bs-original-title="View Transactions">
                <a href="/transactions/4/view" data-transid="4" type="button" class="btn btn-link btn-primary">
                    <i class="fa fa-eye"></i>
                </a>
            </span>
            <span data-bs-toggle="tooltip" aria-label="Create Purchase Order" data-bs-original-title="View Purchase Order">
                <a href="/purchaseOrders/4/view" data-product-id="4" type="button" class="btn btn-link btn-success">
                    <i class="fas fs-4 fa-shopping-cart"></i>
                </a>
            </span>
        </div>
    </td>

</tr>
*/

$('.transactionsTables')?.DataTable({
    responsive: true,
    order: [[0, 'desc']],
    columnDefs__not_working: [
        {
            render: (data, type, row) => {
                const values = JSON.parse(row[2] || '[]');
                const html = values
                    .filter(val => val && val.trim() !== "") // remove empty or whitespace-only
                    .map(val => `<span class="badge badge-count">${val}</span>`)
                    .join(' ');

                // const [classification, procurementType] = JSON.parse(row[9]) || [];
                const classification = row[5];
                const procurementType = row[6]
                const classification_type = `
                    <span data-head="Classification" class="badge badge-secondary mr-2">${classification}</span>
                    <span data-head="Procurement Type" class="badge badge-primary mr-2">${procurementType}</span>
                `;

                return `
                    <div class="d-flex justify-content-between">
                        <div>
                        <span class="badge badge-info mr-2">${row[0]}</span>
                        ${classification_type}
                        <span data-head="BAC Unit" class="badge badge-warning mr-2">${row[12]}</span>
                        </div>
                        <div>${row[3]}</div>
                    </div>
                    ${row[13]}
                    <div class="d-flex justify-content-between">
                        <div class="requisitioner text-muted">Requisitioner: ${row[7]}</div>
                        <div class="codes">${html}</div>
                    </div>
                `
            },
            targets: 1,
            title: 'Particulars'
        },
        {
            render: (data, type, row) => {
                const fund_source = row[11] || '';

                console.log('fund_source:', fund_source)

                // const source = JSON.parse(fund_source)
                const source = fund_source

                const sources = source.map(item => item.source);

                // console.log(sources)

                const values = sources[0].split(',').map(v => v.trim()).filter(Boolean);

                const html = values.map(val => {
                    // Safely split on " | "
                    const [fund, meta] = val.split('::')
                    const [paps, cls, obj, desc, source] = meta.split(' | ').filter(Boolean);
                    const badgeClass = source === undefined ? 'info' : 'warning';

                    return `<span class="badge badge-${badgeClass}" data-bs-toggle="tooltip" data-bs-original-title="${paps}">${cls} | ${obj} | ${desc}</span>`;
                }).join(' ');

                // const html = sources

                return `
                    <div class="d-flex flex-column text-end">
                        <h6>${row[4]}</h6>
                        ${html}
                    </div>
                `
            },
            targets: 2,
            title: 'ABC'
        },
        {
            // render: (data, type, row) => {
            //     return `
            //         <div class="form-button-action" data-transid="2">
            //             <span data-bs-toggle="tooltip" aria-label="View Transactions" data-bs-original-title="View Transactions">
            //                 <a href="/transactions/${row[15]}/view" data-transid="${row[15]}" type="button" class="btn btn-link btn-primary">
            //                     <i class="fa fa-eye"></i>
            //                 </a>
            //             </span>
            //             <span data-bs-toggle="tooltip" aria-label="Create Purchase Order" data-bs-original-title="Create Purchase Order">
            //                 <a href="/purchaseOrders/${row[15]}/create" data-product-id="${row[15]}" type="button" class="btn btn-link btn-warning">
            //                     <i class="fas fa-cart-plus fs-4"></i>
            //                 </a>
            //             </span>
            //         </div>
            //     `
            // },
            targets: -1,
            title: 'Actions'
        },
        // {
        //     render: (data, type, row) => {
        //         return data
        //     },
        //     targets: 13,
        // },
        { visible: true, targets: [1, 2, -1] }, //[4, 6, 10, 12, -1]
        { visible: false, targets: '_all' },
    ],
    columnDefs: [
        {
            render: (data, type, row) => {
                const values = JSON.parse(row[3] || '[]');
                const html = values
                    .filter(val => val && val.trim() !== "") // remove empty or whitespace-only
                    .map(val => `<span class="badge badge-count">${val}</span>`)
                    .join(' ');

                // const [classification, procurementType] = JSON.parse(row[9]) || [];
                const classification = row[6];
                const procurementType = row[7];
                const classification_type = `
                    <span data-head="Classification" class="badge badge-secondary mr-2">${classification}</span>
                    <span data-head="Procurement Type" class="badge badge-primary mr-2">${procurementType}</span>
                `;

                return `
                    <div class="d-flex justify-content-between">
                        <div>
                        <span class="badge badge-info mr-2">${row[1]}</span>
                        ${classification_type}
                        <span data-head="BAC Unit" class="badge badge-warning mr-2">${row[13]}</span>
                        </div>
                        <div>${row[4]}</div>
                    </div>
                    ${row[14]}
                    <div class="d-flex justify-content-between">
                        <div class="requisitioner text-muted">Requisitioner: ${row[8]}</div>
                        <div class="codes">${html}</div>
                    </div>
                `
            },
            targets: 1,
            title: 'Particulars'
        },
        {
            render: (data, type, row) => {
                const fund_source = row[12] || '';

                console.log('fund_source:', fund_source)

                const source = JSON.parse(fund_source)
                // const source = fund_source

                const sources = source.map(item => item.source);

                // console.log(sources)

                const values = sources[0].split(',').map(v => v.trim()).filter(Boolean);

                const html = values.map(val => {
                    // Safely split on " | "
                    const [fund, meta] = val.split('::')
                    const [paps, cls, obj, desc, source] = meta.split(' | ').filter(Boolean);
                    const badgeClass = source === undefined ? 'info' : 'warning';

                    return `<span class="badge badge-${badgeClass}" data-bs-toggle="tooltip" data-bs-original-title="${paps}">${cls} | ${obj} | ${desc}</span>`;
                }).join(' ');

                // const html = sources

                return `
                    <div class="d-flex flex-column text-end">
                        <h6>${row[5]}</h6>
                        ${html}
                    </div>
                `
            },
            targets: 2,
            title: 'ABC'
        },
        {
            // render: (data, type, row) => {
            //     return `
            //         <div class="form-button-action" data-transid="2">
            //             <span data-bs-toggle="tooltip" aria-label="View Transactions" data-bs-original-title="View Transactions">
            //                 <a href="/transactions/${row[15]}/view" data-transid="${row[15]}" type="button" class="btn btn-link btn-primary">
            //                     <i class="fa fa-eye"></i>
            //                 </a>
            //             </span>
            //             <span data-bs-toggle="tooltip" aria-label="Create Purchase Order" data-bs-original-title="Create Purchase Order">
            //                 <a href="/purchaseOrders/${row[15]}/create" data-product-id="${row[15]}" type="button" class="btn btn-link btn-warning">
            //                     <i class="fas fa-cart-plus fs-4"></i>
            //                 </a>
            //             </span>
            //         </div>
            //     `
            // },
            targets: -1,
            title: 'Actions'
        },
        // {
        //     render: (data, type, row) => {
        //         return data
        //     },
        //     targets: 13,
        // },
        { visible: true, targets: [1, 2, -1] }, //[4, 6, 10, 12, -1]
        { visible: false, targets: '_all' },
    ]
})

