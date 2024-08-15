const fields = {
    register: {
        firstname: 'text',
        lastname: 'text',
        birthdate: 'date',
        company: {
            office: 'text',
            salary: 'number',
            status: 'radio',
            enddate: 'date',
            position: 'text',
            startdate: 'date',
            employment: 'option',
            arrangements: 'option'
        }
    }
}

module.exports = {...fields}