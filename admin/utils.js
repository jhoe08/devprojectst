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
    isValidJSON(jsonString) {
        try {
            JSON.parse(jsonString);
            return true; // If parse is successful, return true
        } catch (e) {
            return false; // If there's an error, return false
        }
    }
}

module.exports = {...utils}