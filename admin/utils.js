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
    },
    statusText(status) {
        let text = ''
        switch(status) {
            case 'dark':
            case 'black':
            text = 'Back to office'
            break;
            case 'secondary':
            text = 'Lack of Signature'
            break;
            case 'info':
            text = 'Lack of Attachments'
            break;
            case 'success':
            text = 'Read to move'
            break;
            case 'warning':
            text = 'Waiting'
            break;
            case 'danger':
            text = 'Issue occured'
            break;
            default:
            text = 'Tooltip'
        }
        return text;
    }
}

module.exports = {...utils}