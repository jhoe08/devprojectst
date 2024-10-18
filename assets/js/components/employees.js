(()=>{
    const registerEmployee = document.querySelector('#addEmployeeModal #registerEmployee')
    const fields = document.querySelectorAll('#addEmployeeModal input, #addEmployeeModal select')
    const predataRegisterEmployee = document.querySelector('#addEmployeeModal #predataRegisterEmployee')
  
    let fieldsValue = []
  
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
  
      const employeeid = document.getElementById('employeeid')
      const firstname = document.getElementById('firstname')
      const lastname = document.getElementById('lastname')
      const middlename = document.getElementById('middlename')
      const dob = document.getElementById('dob')
      const gender = document.getElementById('gender')
      const civilstatus = document.getElementById('civilstatus')
      const companyname = document.getElementById('companyname')
      const position = document.getElementById('position')
      const salary = document.getElementById('salary')
      const employment = document.getElementById('employment')
      const startdate = document.getElementById('startdate')
  
      registerEmployee.addEventListener('click', function(){
        const data = {
          employeeid: employeeid.value,
          firstname: firstname.value,
          middlename: middlename.value,
          lastname: lastname.value,
          birthdate: dob.value,
          experience: {
            lists: [{
              office: companyname.value,
              salary: salary.value,
              status: true,
              enddate: 'present',
              position: position.value,
              startdate: startdate.value,
              employment: employment.value,
              arrangements: 'On-site'
            }],
          }
        }
  
        let {experience} = data
        experience = JSON.stringify(experience)
        data.experience = experience
  
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
            $.notify({
              icon: 'icon-bell',
              title: `Hello, Joe!`,
              message: 'Network response was not ok!',
            },{
              type: 'danger',
              placement: {
                from: "top",
                align: "right"
              },
              time: 1000,
            });
          }
          return response.json();
        })
        .then(data => {
          if(!data) {
            $.notify({ icon: 'icon-bell', title: `Error`, message: `Failed to create the Transaction` },
                    { type: 'danger', placement: { from: "top", align: "right" },
                    time: 1000});
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
          $.notify({ icon: 'icon-bell', title: `There was an error on the system!`, message: error },
            { type: 'danger', placement: { from: "top", align: "right" },
            time: 1000});
        });
      })
    }
})()