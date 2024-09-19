
(()=>{
    function notifyCustom(type, title, message, status) {
        return $.notify({
            icon: `icon-${type ?? 'bell'}`,
            title: `${title ?? 'Error'}`,
            message: `${message ?? 'System found an issue!'}`,
            },{
            type: `${status ?? 'danger'}`,
            placement: {
                from: "top",
                align: "right"
            },
            time: 2000,
        });
    }
    const createTransactionCode = document.getElementById('createTransactionCode')
    const transCodeText = document.getElementById('transCodeText')
    if(createTransactionCode) {
        createTransactionCode.addEventListener('click', function(e){
            if (transCodeText.value === '') return
            const transid = e.target.dataset.transid
            const apiUrl = '/transcodes/new';
            const data = { transid, code: transCodeText.value }
            
            const requestOptions = {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            };
            console.log(requestOptions)

            fetch(apiUrl, requestOptions)
            .then(response=>{
                if(!response.ok) notifyCustom('', 'Error', 'Issues on retrieving an data', 'warning')
                return response.json()
            })
            .then(data=>{
                if(!data) return notifyCustom('', 'Error', 'Failed to create new remarks', 'danger')

                notifyCustom('', 'Success', 'Added the transaction codes!', 'info')
            })
            .catch(error => {
                notifyCustom('Error', error, 'danger')
            })
            // Clear after saving successfully
            transCodeText.value = ''
        })
    }
})()