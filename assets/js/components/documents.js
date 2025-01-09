$('select[multiple] option').mousedown(function(e) {
    e.preventDefault();
    var originalScrollTop = $(this).parent().scrollTop();
    console.log(originalScrollTop);
    $(this).prop('selected', $(this).prop('selected') ? false : true);
    var self = this;
    $(this).parent().focus();
    setTimeout(function() {
        $(self).parent().scrollTop(originalScrollTop);
    }, 0);
    
    return false;
});

const createDocumentAPI = '/documents/create'
const createDocumentTrackerBtn =  document.getElementById('createDocumentTrackerBtn')
const uploadDocumentBtn = document.getElementById('uploadDocumentBtn')
const emailsToSend = document.getElementById('emailsToSend')

const myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

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
    
    fetch(createDocumentAPI, requestOptions)
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
            const message = data.files.map(file =>{
              notifyCustom('bell', 'File Uploaded', `File name ${file}`, 'success')
            }).join('<br>');
        })
        .catch(error => {
            notifyCustom('exclamation', 'File Upload', `Error uploading the files ${error}`, 'danger')
        });
    }
  });
}

if(emailsToSend) {
  let emails = []
  // emailsToSend.
}
