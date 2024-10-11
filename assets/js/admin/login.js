const login = {
    loginBtn: document.getElementById('login'),
    init() {
        if(!this.loginBtn) return // Do not call the next statement if the button not existed
       
        const form = document.getElementsByTagName('form')[0]
        const fields = form.getElementsByClassName('form-control')
        const message = form.dataset.message

        // Add a submit event listener to the form
        form.addEventListener('submit', function(event) {
            let allFilled = true;

            // Check each field to see if it's empty
            for (let field of fields) {
            if (!field.value.trim()) {
                allFilled = false;
                break; // Exit loop if any field is empty
            }
            }

            // If any field is empty, prevent form submission
            if (!allFilled) {
            event.preventDefault(); // Prevent form submission
            // alert('Please fill out all fields before submitting.');
            $.notify({ icon: 'icon-bell', title: 'Empty fields', message: 'Please fill out all fields before submitting.' },
                { type: 'danger', placement: { from: "top", align: "right" },
                time: 1000});
            }
        });
        if(message == 404) {
            $.notify({ icon: 'icon-bell', title: 'Account Not Found', message: 'No account is registered using the credentials.' },
            { type: 'danger', placement: { from: "top", align: "right" },
            time: 1000});
        } 
        if(message == 401) {
            $.notify({ icon: 'icon-bell', title: 'Wrong Credentials', message: 'Incorrect username or password. Please try again.' },
            { type: 'danger', placement: { from: "top", align: "right" },
            time: 1000});
        }
    }
}

export default {...login}