

const main = {
    manage : () => {
        const table = document.getElementById("basic-datatables")
        const btn = document.querySelector('.btn-label-info')

        table = new DataTable()
       
        btn.addEventListener('click', function(e){
            let columnIdx = e.target.getAttribute('data-column');
            let column = table.column(columnIdx);
    
            column.visible(!column.visible());
        })
    },
    clicks: () => {
        console.log('asdasdadasd')
    }
}

const { manage, clicks } = main

manage()
clicks()