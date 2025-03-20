const createDocument = '/documents/create'
const activityDocument = '/documents/activity'
const sendDocument = '/documents/send'

const createDocumentTrackerBtn =  document.getElementById('createDocumentTrackerBtn')
const uploadDocumentBtn = document.getElementById('uploadDocumentBtn')
const addMoreEmail = document.getElementById('addMoreEmail')
const emailsToSend = document.getElementById('emailsToSend')
const createActivityBtn = document.getElementById('createActivityBtn')

const mailToDocumentTrackerBtn = document.getElementById('mailToDocumentTrackerBtn')
const emailDocumentTracker = document.getElementById('emailDocumentTracker')
const printDocumentTracekerBtn = document.getElementById('printDocumentTracekerBtn')

const documentData = document.getElementById('documentData')
const created_by = document.getElementById('created_by')

const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

const selectedEmails = []

function datetimeformat(string) {
  // Create a new Date object for the current date and time
  const currentDate = new Date(string);

  // Define an array of month names for better readability
  const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
  ];

  // Get the full month name, day of the month, and year
  const monthName = months[currentDate.getMonth()];
  const day = currentDate.getDate();
  const year = currentDate.getFullYear();

  // Get the time (hours, minutes, seconds)
  const hours = currentDate.getHours();
  const minutes = currentDate.getMinutes();
  const seconds = currentDate.getSeconds();

  // Format the time to always show 2 digits for minutes and seconds
  const formattedTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // Combine date and time into a single string
  const formattedDateTime = `${monthName} ${day}, ${year} ${formattedTime}`;

  return formattedDateTime;

}

const isAllFieldsFilled = (...fields) => fields.every(field => field.value !== "");



if(createDocumentTrackerBtn) {
  const documentSources = document.querySelectorAll('input[name="source"]')
  const documentSourceTitle = document.querySelector('#documentSourceDiv')
  documentSourceTitle.style.display = 'none'

  documentSources.forEach(source => {
    source.addEventListener('click', function(event){
      console.log(event.target.value)
      if(event.target.value == 'external'){
        documentSourceTitle.style.display = 'block'
      } else {
        documentSourceTitle.style.display = 'none'
      }
    })
  })
  // Create document
  createDocumentTrackerBtn.addEventListener('click', ()=>{
    
    const title = document.getElementById('communicationTitle')
    const priority = document.querySelector('input[name="priority"]:checked')
    const source = document.querySelector('input[name="source"]:checked')
    const name = document.querySelector('#documentSourceInput')
    const created_by = document.getElementById('created_by')

    const data = {
      title: title.value,
      priority: priority.value,
      source: source.value,
      source_name: name.value,
      status: 'draft',
      created_by: created_by.value,
    }
    
    var {title: preFieldTitle, priority: preFieldPriority} = data

    if(preFieldTitle === '' || preFieldPriority === '') return notifyCustom('bell', 'Error', 'Please fill in all the required fields.', 'danger')
      
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };
    
    fetch(createDocument, requestOptions)
    .then(response => {
      if (!response.ok) {
        // throw new Error('Network response was not ok');
        notifyCustom('bell', 'System Error', 'Network response was not ok!', 'danger')
      }
      return response.json();
    })
    .then(data => {
      if(!data) {
        notifyCustom('bell', 'Error', 'Failed to create the Communication', 'danger')
        return
      }

      let {message, response } = data
      let {insertId} = response
      
      $.notify({
        icon: 'icon-bell',
        title: `${message}`,
        message: `/documents/${insertId}`,
      },{
        type: 'success',
        placement: {
          from: "top",
          align: "right"
        },
        time: 1000,
      });

      window.location.href = `/documents/${insertId}`
    })
    .catch(error => {
        notifyCustom('bell', 'Failed to fetch data', error, 'danger')
    });
  })
}

if(uploadDocumentBtn) {
  uploadDocumentBtn.addEventListener('click', function(event) {
    event.preventDefault(); // Prevent the form from submitting normally
  
    const fileInput = document.getElementById('file-upload');
    const files = fileInput.files; // Get the selected files
    const {id} = uploadDocumentBtn.dataset
  
    if (files.length > 0) {
        const formData = new FormData();
        
        // Append each file to the formData
        for (let i = 0; i < files.length; i++) {
            formData.append('fileToUpload[]', files[i]);
        }
        formData.append('refid', id)
        // Send the files to the server using Fetch API
        fetch('/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            let arr = []
            const message = data.files.map(file =>{
              arr.push(file)
              notifyCustom('bell', 'File Uploaded', `File name ${file}`, 'success')
            });

            document.getElementById('attachments').setAttribute('files', JSON.stringify(arr) ) 
        })
        .catch(error => {
            notifyCustom('exclamation', 'File Upload', `Error uploading the files ${error}`, 'danger')
        });
    }
  });
}

if(addMoreEmail) {
  let emails = []
  addMoreEmail.addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
      const inputValue = event.target.value;
      const checkEmail = validateEmail(inputValue)
      if (inputValue && checkEmail) {
        const outputDiv = document.getElementById("emailsToSend");
        // outputDiv.textContent = "You typed: " + inputValue;
        const newOption = document.createElement("option");
        newOption.title = inputValue;
        newOption.value = inputValue;
        newOption.textContent = inputValue;
        newOption.selected = true;
        // Add a click event listener to toggle the selected state
        newOption.addEventListener("mouseup", function() {
          this.selected = !this.selected;
        });
        emailsToSend.appendChild(newOption);
      }
      // Optionally clear the input after pressing Enter
      event.target.value = "";
    }
  });
}

if(mailToDocumentTrackerBtn) {
  // Resets the button when it fails to do the task
  mailToDocumentTrackerBtn.addEventListener('click', function(){
    emailDocumentTracker.innerHTML = '<i class="fas fa-paper-plane"></i> Email'
    // emailDocumentTracker.classList.add('disabled')
  })
}

if(emailDocumentTracker) {
  const body = document.querySelector('body')
  const documentTitle = document.getElementById('documentTitle')
  const timetocomply = document.getElementById('timetocomply')
  const mailMessage = document.getElementById('mailMessage')

  const inputs = [documentTitle, timetocomply, mailMessage]

  // Function to toggle the button disabled state
  const toggleButtonState = () => {
    emailDocumentTracker.disabled = !isAllFieldsFilled(...inputs);
  };
  
  // Add event listeners to each input field
  inputs.forEach(input => input.addEventListener('input', toggleButtonState));

  emailDocumentTracker.addEventListener('click', function(){
    
    const selectedOptions = emailsToSend.selectedOptions

    const { username } = JSON.parse(body.dataset.currentuser)

    for (let option of selectedOptions) {
      if(option.value) {
        selectedEmails.push(option.value);
      }
    }
    document.getElementById("selectedEmails").textContent = "Selected values: " + selectedEmails.join(", ");
    let attachments = document.getElementById("attachments")
    attachments = attachments.getAttribute('files')

    const emailBody = `<!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>New Email</title>
      </head>
      <body>
          <div class="wrapper" style="overflow: hidden; width: 794px;">
              <div class="header row" style="margin-bottom: -120px;">
                  <img src="https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/border.png" style="width: 100%;">
              </div>
              <div class="main" style="padding: 0 40px;">
                  <div class="row reciever" style="display: flex; margin-bottom: 20px;">
                      <div class="col-2 mr-4" style="flex: 0 0 auto; width: 16.66666667%;">
                          <strong style="font-weight: 600; text-transform: uppercase;">For: </strong>
                      </div>
                      <div class="col-10" style="flex: 0 0 auto; width: 83.33333333%;">${selectedEmails}</div>
                  </div>
                  <div class="row sender" style="display: flex; margin-bottom: 20px;">
                      <div class="col-2 mr-4" style="flex: 0 0 auto; width: 16.66666667%;">
                          <strong style="font-weight: 600; text-transform: uppercase;">From: </strong>
                      </div>
                      <div class="col-10" style="flex: 0 0 auto; width: 83.33333333%;">Regional Executive Director</div>
                  </div>
                  <div class="row subject" style="display: flex; margin-bottom: 20px;">
                      <div class="col-2 mr-4" style="flex: 0 0 auto; width: 16.66666667%;">
                          <strong style="font-weight: 600; text-transform: uppercase;">Subject: </strong>
                      </div>
                      <div class="col-10" style="flex: 0 0 auto; width: 83.33333333%;">${documentTitle.innerHTML}</div>
                  </div>
                  <div class="row timetocomply" style="display: flex; margin-bottom: 20px;">
                      <div class="col-2 mr-4" style="flex: 0 0 auto; width: 16.66666667%;">
                          <strong style="font-weight: 600; text-transform: uppercase;">Time to Comply: </strong>
                      </div>
                      <div class="col-10" style="flex: 0 0 auto; width: 83.33333333%;">${datetimeformat(timetocomply.value)}</div>
                  </div>
                  <div class="additional" style="display: flex; margin-bottom: 20px;">
                      <div class="col-2 mr-4 hidden" style="display: none; flex: 0 0 auto; width: 16.66666667%;">
                          <strong style="font-weight: 600; text-transform: uppercase;">Additional Message: </strong>
                      </div>
                      <div style="flex: 0 0 auto; width: 100%; margin: 0; font-family: inherit;">${ mailMessage.value }</div>
                  </div>
                  <div class="message" style="margin-bottom: 20px;">
                      <div style="width: 100%;">Kindly confirm receipt of this communication and provide any updates.</div>
                  </div>
              </div>
              <div class="footer" style="display: flex;">
                  <div class="col-4 mr-4" style="flex: 0 0 auto; width: 33.33333333%;display: flex;justify-content: space-around;align-items: center;">
                      <img src="https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/bagong-pilipinas.png" width="100vw">
                      <img src="https://raw.githubusercontent.com/jhoe08/devprojectst/refs/heads/main/assets/img/da-logo.png" width="100vw">
                  </div>
                  <div class="col-8" style="flex: 0 0 auto; width: 66.66666667%;">
                      <h3 style="margin: 0 2px;">OFFICE OF THE REGIONAL EXECUTIVE DIRECTOR</h3>
                      <h1 style="margin: 0 2px; font-weight: 100;">Department of Agriculture</h1>
                      <h3 style="margin: 0 2px;">Regional Field Office No. VII</h3>
                      <p style="margin: 0 2px;">DA-RFO 7 Complex, Highway Maguikay, Mandaue City 6014, Cebu</p>
                      <p style="margin: 0 2px;">Tel. No. (032) 268-5187; Email: redsoffice7@gmail.com</p>
                  </div>
              </div>
          </div>
      </body>
      </html>`

          const { id } = JSON.parse(documentData.dataset.document)

          const data = {
            subject: "You have a new communication from the Regional Directors office",
            to: selectedEmails.join(", "),
            html: emailBody, 
            id,
            attachments,
            timetocomply: timetocomply.value,
            created_at: new Date(),
            created_by: username,
          }
          const requestOptions = {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
          };

          console.log(requestOptions)
          emailDocumentTracker.innerHTML = '<i class="fas fa-spinner"></i> Sending'
          emailDocumentTracker.classList.add('disabled')
          
          fetch(sendDocument, requestOptions)
          .then(response => {
            if (!response.ok) {
              // throw new Error('Network response was not ok');
              notifyCustom('bell', 'System Error', 'Network response was not ok!', 'danger')
            }
            return response.json();
          })
          .then(data => {
            if(!data) {
        notifyCustom('bell', 'Error', 'Failed to send the Communication', 'danger')
        return
      }
      setTimeout(() => {
        emailDocumentTracker.innerHTML = '<i class="fas fa-check"></i> Sent'
      }, 3000);
    })
    .catch(error => {
        notifyCustom('bell', 'Failed to fetch data', error, 'danger')
    });
  })
}

if(createActivityBtn) {
  createActivityBtn.addEventListener('click', function(){
    const { id } = JSON.parse(documentData.dataset.document)
    const activityApi = `/documents/${id}/activity`
    const activityRemark = document.getElementById('activityRemark')


    const data = {
      refid: id, 
      message: activityRemark.value,
      created_at: new Date(),
      created_by: created_by.value
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    console.log(requestOptions)

    fetch(activityApi, requestOptions)
    .then(response => {
      if (!response.ok) {
        // throw new Error('Network response was not ok');
        notifyCustom('bell', 'System Error', 'Network response was not ok!', 'danger')
      }
      return response.json();
    })
    .then(data => {
      if(!data) {
        notifyCustom('bell', 'Error', 'Failed to send the Communication', 'danger')
        return
      }
      emailDocumentTracker.innerHTML = '<i class="fas fa-spinner"></i> Sending'
      setTimeout(() => {
        emailDocumentTracker.innerHTML = '<i class="fas fa-check"></i> Sent'
        emailDocumentTracker.classList.add('disabled')
      }, 5000);
      notifyCustom('bell', 'Success', 'Posted comment successfully!', 'danger')

    })
    .catch(error => {
        notifyCustom('bell', 'Failed to fetch data', error, 'danger')
    });
  })
}

if(printDocumentTracekerBtn) {
  printDocumentTracekerBtn.addEventListener('click', function(){
    window.print()
  })
}