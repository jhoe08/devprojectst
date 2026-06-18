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

$('.documentsDataTables')?.DataTable({
    responsive: true,
    order: [[0, 'desc']],
    columnDefs: [
        {
            targets: 1,
            title: 'Notice Title',
        },
        {
            targets: 2,
            title: 'Priority',
            width: '30%',
            render: function (data, type, row) {
                const priority = data || 'N/A';
                let badgeClass = 'badge-info'; // Default badge class
                if (priority.toLowerCase() === 'confidential') {
                    badgeClass = 'badge-danger';
                } else if (priority.toLowerCase() === 'urgent') {
                    badgeClass = 'badge-warning';
                }

                return `<span class="badge ${badgeClass}">${priority}</span>`;
            }
        },
        { visible: true, targets: [1, 2, -1] }, 
        { visible: false, targets: '_all' },
    ]
})

