(()=>{
    const registerEmployee = document.getElementById('registerEmployee')
    const updateEmployee = document.getElementById('updateEmployee')
    const fields = document.querySelectorAll('#input, select')
    const predataRegisterEmployee = document.querySelector('#predataRegisterEmployee')
    
    const deleteEmployee = document.querySelectorAll('.form-button-action .btn-danger');

    let fieldsValue = []
  
    const employeeid = document.getElementById('employeeid')
    const firstname = document.getElementById('firstname')
    const lastname = document.getElementById('lastname')
    const middlename = document.getElementById('middlename')
    let extname = document.querySelector('input[name="nameExtension"]:checked')
    const emailAdd = document.getElementById('emailadd')
      const mobile = document.getElementById('mobile')

    const dob = document.getElementById('dob')
    const gender = document.getElementById('gender')
    const civilstatus = document.getElementById('civilstatus')
    const companyname = document.getElementById('companyname')
      const division = document.getElementById('division')
      const banner = document.getElementById('banner')
    const position = document.getElementById('position')
    const salary = document.getElementById('salary')
    const employment = document.getElementById('employment')
    const startdate = document.getElementById('startdate')

    const roleInputEnter = document.getElementById('roleInputEnter')
    const setRoles = document.getElementById('setRoles')

    if (predataRegisterEmployee) {
      predataRegisterEmployee.addEventListener('click', function(){
        fields.forEach(field =>{
          // console.dir(field)
          if(field.localName == 'input') {
            switch(field.type){
              case 'text':
                field.value = field.id
                break;
              case 'number':
                field.value = 888
                break;
              case 'date':
                field.value = '1993-10-08'
                break;
              case 'radio':
                field.value = 'III'
                field.checked = true
            }
          }
          
          if (field.localName == 'select') {
            field.value = "Other's" ?? "Permanent"
          }
        })
      })
    }
    if (registerEmployee) {
      const apiUrl = '/register/new';
  
      
      registerEmployee.addEventListener('click', function(){
        const data = {
          employeeid: employeeid.value,
          firstname: firstname.value,
          middlename: middlename.value,
          lastname: lastname.value,
          extname: extname?.value,
          birthdate: dob.value,
          experience: {
            lists: [{
              office: companyname.value,
              division: division.value,
              salary: salary.value,
              status: true,
              enddate: 'present',
              position: position.value,
              startdate: startdate.value,
              employment: employment.value,
              arrangements: 'On-site', 
            }],
          },
          contacts: {
            email: emailAdd.value,
            mobile: mobile.value,
          },
          others: {
            civilstatus: civilstatus.value,
            gender: gender.value
          }
        }
        // into JSON format
        let {experience, contacts, others} = data
        experience = JSON.stringify(experience)
        contacts = JSON.stringify(contacts)
        others = JSON.stringify(others)
        data.experience = experience
        data.contacts = contacts
        data.others = others
  
        const requestOptions = {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data)
        };
        
        fetch(apiUrl, requestOptions)
        .then(response => {
          if (!response.ok) {
            // throw new Error('Network response was not ok');
            notifyCustom('bell', 'System Error', 'Network response was not ok!', 'danger')
          }
          return response.json();
        })
        .then(data => {
          if(!data) {
            notifyCustom('bell', 'Error', 'Failed to create the Transaction', 'danger')
          }
  
          let {message, response } = data
          let {insertId} = response
          
          $.notify({
            icon: 'icon-bell',
            title: `${message}`,
            message: `Transaction ID#${insertId}`,
          },{
            type: 'success',
            placement: {
              from: "top",
              align: "right"
            },
            time: 1000,
          });
        })
        .catch(error => {
            notifyCustom('bell', 'Failed to fetch data', error, 'danger')
        });
      })
    }
    if (updateEmployee) {
      const apiUrl = '/employees/update';
      

      const container = '#formEmployee'
      fieldsUpdated(container)

      updateEmployee.addEventListener('click', function(){
        extname = document.querySelector('input[name="nameExtension"]:checked')

        const data = {
          firstname: firstname.value,
          middlename: middlename.value,
          lastname: lastname.value,
          extname: extname.value,
          birthdate: dob.value,
          experience: {
            lists: [{
              office: companyname.value,
              division: division.value,
              salary: salary.value,
              status: true,
              enddate: 'present',
              position: position.value,
              startdate: startdate.value,
              employment: employment.value,
              arrangements: 'On-site', 
            }],
          },
          contacts: {
            email: emailAdd.value,
            mobile: mobile.value,
          },
          others: {
            civilstatus: civilstatus.value,
            gender: gender.value
          }
        }

        let {experience, contacts, others} = data

        if(!firstname.classList.contains('updated')) delete data.firstname
        if(!middlename.classList.contains('updated')) delete data.middlename
        if(!lastname.classList.contains('updated')) delete data.lastname
        if(!extname.classList.contains('updated')) delete data.extname
        if(!dob.classList.contains('updated')) delete data.birthdate
        
        data.experience = JSON.stringify(experience)
        data.contacts = JSON.stringify(contacts)
        data.others = JSON.stringify(others)

        const employeeID = employeeid.value
        const payload = {set: data, where: {employeeid:employeeID}}

        const requestOptions = {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        };

        fetch(apiUrl, requestOptions)
        .then(response => {
          if (!response.ok) {
            // throw new Error('Network response was not ok');
            notifyCustom('bell', 'System Error', 'Network response was not ok!', 'danger')
          }
          return response.json();
        })
        .then(data => {
          if(!data) { notifyCustom('bell', 'Error', 'Failed to update the Employee', 'danger') }
  
          let {message, response } = data
  
          console.log(data)
          notifyCustom('bell', `${message}`, 'Successfully updated the Employee', 'success')
        })
        .catch(error => {
            notifyCustom('bell', 'Failed to fetch data', error, 'danger')
        });
      })
    }
    if (deleteEmployee) {
      deleteEmployee.forEach(danger=>{
        danger.addEventListener('click', (event)=>{
          let employees = danger
          let {id, name} = employees.dataset

          document.querySelectorAll('#employees tr').forEach(row => row.classList.remove('selected'));
          event.target.closest('tr').classList.add('selected')

          title = `Are you sure to delete ${name}?`
          message = "Once deleted, you will not be able to recover this file!"

            swal({
                title,
                text: "Once deleted, you will not be able to recover this employee file!",
                icon: "warning",
                // buttons: ["Cancel", "Delete it!", "ASD"],
                buttons: {
                  cancel: true,
                  confirm: "Confirm",
                  roll: {
                    text: "Force Delete!",
                    value: "forceDelete",
                  },
                },
                dangerMode: true, })
            .then((willDelete) => {
              let url = `/employees/${id}`
             
              switch(willDelete) {
                case true:
                  console.log('Confirm 1', url)
                break;
                case 'forceDelete':
                  url += '/force'
                  console.log('Confirm 2', url)
                break;
                default:
                  document.querySelectorAll('#employees tr').forEach(row => row.classList.remove('selected'));
                break;
              }

              fetch(url, {
                method: 'DELETE' })
              .then(res => {
                return res.text()}) // or res.json()
              .then(data => {
                swal("Poof! Transaction file has been deleted!", {
                icon: "success", });
                // if Yes
                document.querySelector('tr.selected').remove().draw(false)
              }) // endof fetch()
            });
        })
      })
    }
    if (roleInputEnter) {
      roleInputEnter.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
          // Get the input value and trim whitespace
        let inputText = event.target.value.trim();
        
        if (inputText) {
          // Split the text by commas (if any)
          let items = inputText.split(',').map(item => item.trim());
          
          // Access the list element where items will be added
          const list = document.getElementById('listRoles');
          
          // Iterate through the items and add them to the list
          items.forEach(item => {
            listRoles.setAttribute('data-roles', roleNames);
            let html = `<label class="selectgroup-item">
                          <input type="checkbox" name="roles" value="${item}" class="selectgroup-input">
                          <span class="selectgroup-button">${item}</span>
                        </label>`
            list.innerHTML += html;
          });

            // Clear the input field after adding
            event.target.value = '';
        }
      }
    });
    
    }

  document.addEventListener('DOMContentLoaded', function () {
    // Get references to the select input and checkboxes container
    const rolesSelect = document.getElementById('roles');
    const permissionsContainer = document.getElementById('permissions-container');
    if(!rolesSelect) return
    // Handle change event on role select input
    rolesSelect.addEventListener('change', function () {
      const selectedRole = rolesSelect.value;
      
      // Find the corresponding role data based on the selected role
      const selectedRoleData = rolesSelect.querySelector('option:checked');
      // const selectedRoleData = selectedRole.dataset.permissions
      if (selectedRoleData) {
        let selectedPermissions = selectedRoleData.dataset.permissions;
        selectedPermissions = JSON.parse(selectedPermissions)
        console.log(selectedPermissions)

        // Loop through the checkboxes and update their checked status based on the permissions
        const checkboxes = permissionsContainer.querySelectorAll('.selectgroup-input');
        checkboxes.forEach(checkbox => {
          const permission = checkbox.value;
          // If the permission is in the selected role's permissions, check the box
          checkbox.checked = selectedPermissions[permission]
        });
      }
    });

    // Trigger the change event once on page load to initialize the checkboxes for the default role
    rolesSelect.dispatchEvent(new Event('change'));
  });

})()