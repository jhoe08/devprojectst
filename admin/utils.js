const moment = require('moment')

const utils = {
    peso(amount) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'PHP',
        }).format(amount); 
    },
    dateFormat(date, display) {
        if(!display) display = 'LLL'
        return moment.format(display)
    }, 
}

module.exports = {...utils}