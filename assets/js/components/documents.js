const createDocument = '/documents/create'
const activityDocument = '/documents/activity'
const sendDocument = '/documents/send'
const createDocumentTrackerBtn =  document.getElementById('createDocumentTrackerBtn')
const uploadDocumentBtn = document.getElementById('uploadDocumentBtn')
const addMoreEmail = document.getElementById('addMoreEmail')
const emailsToSend = document.getElementById('emailsToSend')

const emailDocumentTracker = document.getElementById('emailDocumentTracker')
const printDocumentTracekerBtn = document.getElementById('printDocumentTracekerBtn')

const documentData = document.getElementById('documentData')

const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

const selectedEmails = []


// SELECT MULTIPLE OPTION
document.querySelectorAll('select[multiple] option').forEach(function(option) {
  option.addEventListener('mousedown', function(e) {
      e.preventDefault();

      var parent = this.parentElement;
      var originalScrollTop = parent.scrollTop;

      // console.log(originalScrollTop);

      // Toggle the 'selected' property
      this.selected = !this.selected;

      // Focus on the parent (the <select> element)
      parent.focus();

      // Reset the scroll position after the selection change
      setTimeout(function() {
          parent.scrollTop = originalScrollTop;
      }, 0);

      return false;
  });
});

if(createDocumentTrackerBtn) {
  createDocumentTrackerBtn.addEventListener('click', ()=>{
    
    const title = document.getElementById('communicationTitle')
    const priority = document.querySelector('input[name="priority"]:checked')
    const created_by = document.getElementById('created_by')
    const data = {
      title: title.value,
      priority: priority.value,
      status: 'draft',
      created_by: created_by.value
    }
    
    console.log(data)
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
  
    if (files.length > 0) {
        const formData = new FormData();
        
        // Append each file to the formData
        for (let i = 0; i < files.length; i++) {
            formData.append('fileToUpload[]', files[i]);
        }
  
        // Send the files to the server using Fetch API
        fetch('/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            let arr = []
            const message = data.files.map(file =>{
              arr.push(file)
              notifyCustom('bell', 'File Uploaded', `File name ${file}`, 'success')
            });

            document.getElementById('message').setAttribute('files', JSON.stringify(arr) ) 
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

if(emailDocumentTracker) {
  emailDocumentTracker.addEventListener('click', function(){
    const documentTitle = document.getElementById('documentTitle')
    const timetocomply = document.getElementById('timetocomply')
    const mailMessage = document.getElementById('mailMessage')
    const selectedOptions = emailsToSend.selectedOptions

    for (let option of selectedOptions) {
      if(option.value) {
        selectedEmails.push(option.value);
      }
    }
    document.getElementById("selectedEmails").textContent = "Selected values: " + selectedEmails.join(", ");

    const emailBody = `
    <h3>Title: ${documentTitle.innerHTML}</h3>
    <time>Time to Comply: ${moment(timetocomply.value).format('LLL hh:mm:ss')}</time>
    <pre style="font: small / 1.5 Arial, Helvetica, sans-serif;">${mailMessage.value}</pre>
    `

    const { id } = JSON.parse(documentData.dataset.document)

    const data = {
      subject: "ORED: New Document has arrived.",
      to: selectedEmails.join(", "),
      html: emailBody, 
      id,
      timetocomply: timetocomply.value
    }
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    };

    console.log(requestOptions)

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
      emailDocumentTracker.innerHTML = '<i class="fas fa-spinner"></i> Sending'
      setTimeout(() => {
        emailDocumentTracker.innerHTML = '<i class="fas fa-check"></i> Sent'
        emailDocumentTracker.classList.add('disabled')
      }, 5000);
      // window.location.href = `/documents/${insertId}`
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