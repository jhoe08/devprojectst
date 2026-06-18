const moment = require('moment')
const crypto = require('crypto');

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
  addLeadingZeros(number, totalLength = 5) {
    // Convert to string
    console.log('addLeadingZeros', number, totalLength)
    const numStr = number?.toString() || String(number);

    // Pad with leading zeros until it reaches the desired length
    return numStr.padStart(totalLength, "0");
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
    return 'PENDING'
  },
  toCapitalize(str) {
    if (str && typeof str === 'string') {
      return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
    return str;
  },
  isActive(currentPath, pathToCheck) {
    return (currentPath === pathToCheck) ? 'active' : '';
  },
  generateGuestToken() {
    return crypto.randomBytes(24).toString('hex');
  },
  submitGuestToken() {
    document.getElementById('guestForm').submit();
  }

}

module.exports = { ...utils }