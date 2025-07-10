"use strict"

const video = document.getElementById('qrcodeScanner');
const output = document.getElementById('qrCodeData');
// alternative
const text = document.getElementById('qrCodeText')

let transIDs = [];
let tempQRCodes = []
const btnRemarks = document.getElementById('createRemarks')
        

if(video && output) {
    
    // const table = new DataTable('#basic-datatables');
    
    // Access the webcam
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        video.srcObject = stream;
        video.setAttribute("playsinline", true); // Required for iOS Safari
        // requestAnimationFrame(scanQRCode);
        // Wait until the video has loaded its metadata
        video.onloadedmetadata = () => {
        // Ensure video has non-zero dimensions
        if (video.videoWidth && video.videoHeight) {
            requestAnimationFrame(scanQRCode);
        } else {
            console.error('Error: video dimensions not available.');
        }
        };
    })
    .catch(err => {
        console.error('Error accessing the camera: ', err);
        output.innerText = 'Error accessing the camera.';
    });
    
    async function scanQRCode() {
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // Try to decode QR code from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = jsQR(imageData.data, canvas.width, canvas.height);
    
        if (decoded) {
            const qrNumber = decoded.data
            output.innerText = `QR Code data: ${decoded.data}`;
            
            if(!transIDs.includes(decoded.data) && decoded.data !== "") {
                transIDs.push(decoded.data)
                // const data = await fetchTransactionById(decoded.data)
                const data = await fetchQRCode(decoded.data)
                

                // console.log('scanQRCode',data)

                const { response, component } = data;

                let tempTitle, tempCreatedBy = '';
                if (component === "transactions") {
                    ({ bid_notice_title: tempTitle, requisitioner: tempCreatedBy } = response);
                } else if (component === "documents") {
                    ({ title: tempTitle, created_by: tempCreatedBy } = response);
                }

                const tempData = { component, tempTitle, tempCreatedBy };
                // console.log('tempData', tempData)
                // console.log(data && data.length > 0)
                if (data) {
                    tempQRCodes.push(qrNumber);
                    addNewRow(tempData);
                    btnRemarks.dataset.transid = JSON.stringify(tempQRCodes);
                    text.value = '';
                }
                console.log(tempQRCodes)
                

                // if(data.length > 0) {
                //     addNewRow(data)
                //     btnRemarks.dataset.transid = JSON.stringify(transIDs)
                // }
                
            }
    
        } else {
            output.innerText = 'No QR code detected.';
        }
    
        // Call the function again to keep scanning
        requestAnimationFrame(scanQRCode);
        // console.log(transIDs)
    }
    
      
}

if(text) {
    // setInterval(async function(){
    //     const qrNumber = text.value
    //     if(!transIDs.includes(qrNumber) && qrNumber !== "") {
    //         const data = await fetchTransactionById(qrNumber)
    //         const {approved_budget, bid_notice_title, product_id} = data
    //         if(data.length > 0) {
    //             transIDs.push(qrNumber)
    //             addNewRow(data)
    //             btnRemarks.dataset.transid = JSON.stringify(transIDs)   
    //             text.value = ''
    //         }
    //     }
    // }, 2000)
    let isFetching = false;

    setInterval(async function() {
        if (isFetching) return;
        isFetching = true;

        try {
            const qrNumber = text.value;
            // console.log(qrNumber)
            if (!tempQRCodes.includes(qrNumber) && qrNumber !== "") {
                const data = await fetchQRCode(qrNumber);
                console.log('data', data)
                const { response, component } = data;

                let tempTitle, tempCreatedBy = '';
                if (component === "transactions") {
                    ({ bid_notice_title: tempTitle, requisitioner: tempCreatedBy } = response);
                } else if (component === "documents") {
                    ({ title: tempTitle, created_by: tempCreatedBy } = response);
                }

                const tempData = { component, tempTitle, tempCreatedBy };
                // console.log('tempData', tempData)
                // console.log(data && data.length > 0)
                if (data) {
                    tempQRCodes.push(qrNumber);
                    addNewRow(tempData);
                    btnRemarks.dataset.transid = JSON.stringify(tempQRCodes);
                    text.value = '';
                }
                // console.log(tempQRCodes)
            }
        } catch (error) {
            console.error("Error fetching or processing QR code:", error);
        } finally {
            isFetching = false;
        }
    }, 2000);

    
}

if(createRemarks) {
    let comment = document.querySelector('#comment')

    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    createRemarks.addEventListener('click', async () => {
        console.log(createRemarks)
        try {
            let selectedStatus = document.querySelector('input[name="color"]:checked');
            let selectedPeriod = document.querySelectorAll('input[name="period"]');
            let {transid} = createRemarks.dataset
            let selectedStatusValue = selectedStatus.value
            
            const checkedCheckboxes = Array.from(selectedPeriod)
            .filter(checkbox => checkbox.checked)
            .map(checkbox => parseFloat(checkbox.value))
            .reduce((sum, value) => sum + value, 0);
        
            let preloaded = { 
                comment: comment.value, 
                refid: transid, 
                status: selectedStatusValue,
                user:'justjoe',
                dueDate: checkedCheckboxes
            }
            console.log(preloaded)
            const apiUrl = '/remarks/new'
        
            const requestOptions = {
                method: 'POST',
                headers: {
                'Content-Type': 'application/json',
                },
                body: JSON.stringify(preloaded)
            };
        
            fetch(apiUrl, requestOptions)
            .then(response => {
                if (!response.ok) {
                    // throw new Error('Network response was not ok');
                    notifyCustom('bell', 'System Issue', 'Network response was not ok!', 'danger')
                }
                return response.json();
            })
            .then(data => {
                if(!data) {
                    notifyCustom('bell', 'Error', 'Failed to create new remarks', 'danger')
                }
        
                let {message} = data
                if(refreshActivity) {
                    refreshActivity.click()
                }
                
                // clearing fields
                selectedStatus.checked = false
                comment.value = ''
                // return notifications
                notifyCustom('check', `${message}`, 'Successfully added the remarks on the transactions!', 'success')
            })
            .catch(error => {
                notifyCustom('exclamation', `There was an error on the system!`, `${error}`, 'danger')
            });
        } catch (error) {
            notifyCustom('exclamation', `Field is empty please check!`, `${error}`, 'danger')
        }
    })
}

async function fetchTransactionByIdWorking(id) {
    try {
        const response = await fetch(`/api/transactions/${id}`); // Assuming your API endpoint is like this
        const data = await response.json(); // Parse JSON response

        if (response.ok) {
        // If the request is successful, log or process the employee data
        return data.response; // Return employee data
        } else {
        // If the employee is not found or there's another issue
        console.error('Error:', data.response);
        return null;
        }
    } catch (error) {
        // Handle errors like network issues
        console.error('Error fetching data:', error);
        return null;
    }
}

async function fetchTransactionById(id) {
    try {
        // Attempt to fetch data from the transactions API
        let response = await fetch(`/api/transactions/${id}`);

        // Parse the JSON response
        const data = await response.json();

        // If the first fetch is not successful or returns no data, try fetching from the documents API
        if (!data) {
            console.log('No transaction found, attempting to fetch document...');
            response = await fetch(`/api/documents/${id}`);
        }

        // Check if the response is successful
        if (response.ok) {
            // Return the response data if successful
            return data.response;
        } else {
            // Handle errors (e.g., document not found)
            console.error('Error:', data.response || 'Unknown error');
            return null;
        }
    } catch (error) {
        // Handle network or other unexpected errors
        console.error('Error fetching data:', error);
        return null;
    }
}

async function fetchQRCode(id) {
    try {
        const response = await fetch(`/api/qrcode/${id}`); // Assuming your API endpoint is like this
        const data = await response.json(); // Parse JSON response 
        // alert(data)
        if (response.ok) {
            const {response, component} = data
            return {response, component}
        } else {
            // If the employee is not found or there's another issue
            console.error('Error:', data.response);
            return null;
        }
    } catch (error) {
        // Handle errors like network issues
        console.error('Error fetching data:', error);
        return null;
    }
}


const transactionsIDs = $("#basicDatatables").DataTable()

function addNewRow(data) {
    // console.log(data)
    const { component, tempTitle, tempCreatedBy } = data
    alert('component', component)
    const newRowData = [
        tempTitle,           // Product ID
        component,           // Notice Title
        tempCreatedBy,       // Initiator
    ];
    // console.log(data)
    // console.log('asdadadasdasdasdadad', newRowData)
    transactionsIDs.row.add(newRowData).draw();
}