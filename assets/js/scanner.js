"use strict"

const video = document.getElementById('qrcodeScanner');
const output = document.getElementById('qrCodeData');

if(video && output) {
    let transIDs = [];

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
        const btnRemarks = document.getElementById('createRemarks')
    
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
    
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
    
        // Try to decode QR code from the canvas
        const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
        const decoded = jsQR(imageData.data, canvas.width, canvas.height);
    
        if (decoded) {
            output.innerText = `QR Code data: ${decoded.data}`;
            if(!transIDs.includes(decoded.data) && decoded.data !== "") {
                transIDs.push(decoded.data)
                const data = await fetchTransactionById(decoded.data)
                const {approved_budget, bid_notice_title, product_id} = data
                if(data) {
                    addNewRow(data)
                    btnRemarks.dataset.transid = JSON.stringify(transIDs)
                }
                
            }
    
        } else {
            output.innerText = 'No QR code detected.';
        }
    
        // Call the function again to keep scanning
        requestAnimationFrame(scanQRCode);
        // console.log(transIDs)
    }
    
    async function fetchTransactionById(transactionId) {
        try {
          const response = await fetch(`/api/transactions/${transactionId}`); // Assuming your API endpoint is like this
          const data = await response.json(); // Parse JSON response
      
          if (response.ok) {
            // If the request is successful, log or process the employee data
            console.log('Transaction Data:', data.response);
            return data.response; // Return employee data
          } else {
            // If the employee is not found or there's another issue
            console.error('Error:', data.response);
            return null;
          }
        } catch (error) {
          // Handle errors like network issues
          console.error('Error fetching employee data:', error);
          return null;
        }
      }
      
}
