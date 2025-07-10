const moment = require('moment')

const utils = {
  peso(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  },
  dateFormat(date, display) {
    if (!display) display = 'LLL'
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
    switch (status) {
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
        text = 'For Approval'
    }
    return text;
  },
  addLeadingZeros(number) {
    // Convert the number to a string to count its digits
    const numStr = number.toString();
    const numDigits = numStr.length;

    // Determine how many leading zeros to add
    if (numDigits === 1) {
      return "0000" + number; // Add 4 leading zeros for single-digit
    } else if (numDigits === 2) {
      return "000" + number;  // Add 3 leading zeros for two digits
    } else if (numDigits === 3) {
      return "00" + number;   // Add 2 leading zeros for three digits
    } else if (numDigits === 4) {
      return "0" + number;    // Add 1 leading zero for four digits
    } else {
      return number.toString(); // No leading zeros for five or more digits
    }
  },
  validateEmail(email) {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailPattern.test(email);
  },
  findDivisionBySection(arr, searchItem) {
    if (arr[searchItem]) return searchItem
    for (let division in arr) {
      if (arr[division].sections[searchItem]) return division
    }
    return null
  },
  toCapitalize(str) {
    if (str && typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
  },
  isActive(currentPath, pathToCheck) {
    return (currentPath === pathToCheck) ? 'active' : '';
  }
}

module.exports = { ...utils }