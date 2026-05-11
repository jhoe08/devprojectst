
// let notifyIcon = ['check', 'close', 'exclamation', 'bell'];

let views = document.querySelectorAll('#basic-datatables .form-button-action .btn-primary');
if (views) {
  views.forEach(view => {
    view.addEventListener('click', () => {
      let transactions = view
      // transid = danger.target
      let { transid } = transactions.dataset
      let title = `Transaction Details ${transid}`
      let description = 'Peskot na~'
    })
  })
}

function progressBar(length, progress, title="Not Yet Set!") {
  if (progress > 0) {
    progress = parseInt(progress)

    progress = Number((progress / length) * 100).toFixed(2);
    var html = `<div class="progress progress-sm" style="height: 5px;"><div class="progress-bar" style="width: ${progress}%" role="progressbar" aria-valuenow="${progress}" aria-valuemin="0" aria-valuemax="100" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-title="${title}"></div></div>`
  }

  return (progress > 0) ? html : '';
}

function numberFormat(data) {
  let s = (data + ""), a = s.split(""), out = "", iLen = s.length;

  for (var i = 0; i < iLen; i++) {
    if (i % 3 === 0 && i !== 0) {
      out = ',' + out;
    }
    out = a[iLen - i - 1] + out;
  }
  return out;
}

function dateFormat(date) {
  return new Date(date).toDateString()
}

function pr_date() {
  let dates = document.querySelectorAll('[data-pr_date]')
  dates.forEach(date => {
    let pr = date.dataset.pr_date
    let child = date.children[0]

    child.innerHTML = dateFormat(pr)

  })
}
function isEmpty(value) {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string' && value.trim() === '') return true;
  if (Array.isArray(value) && value.length === 0) return true;
  if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
  return false;
}
function peso(amount) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'PHP',
  }).format(amount);
}

function stringToArray(str, callback) {
  const separated = str.slice(1, -1).split(',').map(item => item.trim().replace(/"/g, '')).filter(item => item !== 'null' && item !== '');
  return separated.map(callback).join(' ')
}

function isValidJSON(jsonString) {
  try {
    JSON.parse(jsonString);
    return true; // If parse is successful, return true
  } catch (e) {
    return false; // If there's an error, return false
  }
}

function notifyCustom(type, title, message, status) {
  return $.notify({
    icon: `icon-${type ?? 'bell'}`,
    title: `${title ?? 'Error'}`,
    message: `${message ?? 'System found an issue!'}`,
  }, {
    type: `${status ?? 'danger'}`,
    placement: {
      from: "top",
      align: "right"
    },
    time: 2000,
  });
}

function fieldsUpdated(container) {
  const fields = document.querySelectorAll(`
    ${container} .form-control,
    ${container} .form-select,
    ${container} input[type="checkbox"],
    ${container} textarea
  `);

  fields.forEach(field => {
    // For text inputs and textareas
    if (field.tagName === 'INPUT' || field.tagName === 'TEXTAREA') {
      field.addEventListener('input', function () {
        this.classList.toggle('updated', !!this.value);
      });
    }

    // For select elements
    if (field.tagName === 'SELECT') {
      field.addEventListener('change', function () {
        this.classList.toggle('updated', !!this.value);
      });
    }

    // For checkbox elements
    if (field.tagName === 'INPUT' && field.type === 'checkbox') {
      field.addEventListener('input', function () {
        field.closest('.selectgroup').classList.toggle('updated', this.checked);
      });
    }
  });
}

function statusText(status) {
  let text = ''
  switch (status) {
    case 'dark':
      text = 'data-bs-title="Back to office"'
      break;
    case 'secondary':
      text = 'data-bs-title="Lack of Signature"'
      break;
    case 'info':
      text = 'data-bs-title="Lack of Attachments"'
      break;
    case 'success':
      text = 'data-bs-title="Read to move"'
      break;
    case 'warning':
      text = 'data-bs-title="Waiting"'
      break;
    case 'danger':
      text = 'data-bs-title="Issue occured"'
      break;
    default:
      text = 'data-bs-title="For Approval"'
  }

  return text;
}
// Function to fetch the countNotif from the server
async function fetchNotificationCount() {
  try {
    const response = await fetch('/api/notifications');
    const data = await response.json();
    const notifCount = document.getElementById('notifDropdown')
    // console.log(data)
    if (notifCount) {
      notifCount.querySelector('span').textContent = data.counts;
      notifCount.querySelector('span').dataset.lastupdated = new Date()
    }

  } catch (error) {
    console.error('Error fetching notification count:', error);
  }
}
function refreshDiv() {
  let realtimeDiv = document.querySelectorAll('.realtime')
  if (realtimeDiv) {
    realtimeDiv.forEach(container => {
      // const currentTime = new Date().toLocaleTimeString();
      // const currentTime = new Date().toLocaleTimeString();

      container.textContent = realtimeDiv.value
    })
  }
}

function initial(string) {
  return string.chartAt(0) + '.'
}

function addLeadingZeros(number) {
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
}

function validateEmail(email) {
  const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
  return emailPattern.test(email);
}

function isActive(currentPath, pathToCheck) {
  return (currentPath === pathToCheck) ? 'active' : '';
}

// Function to sum all unitCount fields and update totalCo
function updateTotal(selector) {
  const inputs = document.querySelectorAll(selector);
  let total = 0;
  inputs.forEach(input => {
    const val = parseInt(input.value.replace(/,/g, ''), 10);
    // console.log('ASD', val)
    if (!isNaN(val)) total += val;
  });
  // console.log('Total:', total);
  const totalCountEl = document.getElementById('totalCount');
  const budgetEl = document.getElementById('budget');

  if (totalCountEl) {
    totalCountEl.value = total;
  }
  if (budgetEl) {
    budgetEl.value = total.toLocaleString('en-US', { style: 'decimal', minimumFractionDigits: 0 });
  }
}

// Function to add commas on the field that set to data-type=number
function formatNumberWithCommas_working_but_not_when_automatically_populated(event) {
  const input = event.target;
  const rawValue = input.value;

  // Save caret position relative to digits
  const caretPos = input.selectionStart;
  const digitsBeforeCaret = rawValue.slice(0, caretPos).replace(/[^0-9]/g, '').length;

  // Clean value: keep digits and one decimal
  let value = rawValue.replace(/[^0-9.]/g, '');
  const firstDecimal = value.indexOf('.');
  if (firstDecimal !== -1) {
    value =
      value.slice(0, firstDecimal + 1) +
      value.slice(firstDecimal + 1).replace(/\./g, '');
  }

  if (value === '') {
    input.value = '';
    return;
  }

  // Split integer/decimal
  const parts = value.split('.');
  let integerPart = parts[0];
  let decimalPart = parts[1] ?? '';

  // Detect if user just typed a trailing dot
  const hasTrailingDot = value.endsWith('.') && decimalPart === '';

  // Limit decimals only if digits exist
  if (decimalPart) {
    decimalPart = decimalPart.slice(0, 2);
  }

  // Add commas
  integerPart = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  // Rebuild value
  input.value = hasTrailingDot
    ? integerPart + '.'
    : decimalPart
      ? `${integerPart}.${decimalPart}`
      : integerPart;

  // Restore caret
  let newCaretPos;
  if (hasTrailingDot) {
    // If user just typed ".", put caret right after it
    newCaretPos = input.value.length;
  } else {
    // Otherwise restore based on digitsBeforeCaret
    newCaretPos = 0;
    let digitsSeen = 0;
    while (newCaretPos < input.value.length && digitsSeen < digitsBeforeCaret) {
      if (/\d/.test(input.value[newCaretPos])) {
        digitsSeen++;
      }
      newCaretPos++;
    }
  }
  input.setSelectionRange(newCaretPos, newCaretPos);
}

function formatNumberWithCommas(event) {
  const input = event.target;
  const rawValue = input.value;

  // Save caret position relative to digits
  const caretPos = input.selectionStart;
  const digitsBeforeCaret = rawValue.slice(0, caretPos).replace(/\D/g, '').length;

  // Clean value: keep digits and one decimal
  let value = rawValue.replace(/[^0-9.]/g, '');
  const firstDecimal = value.indexOf('.');
  if (firstDecimal !== -1) {
    value = value.slice(0, firstDecimal + 1) + value.slice(firstDecimal + 1).replace(/\./g, '');
  }

  if (!value) {
    input.value = '';
    return;
  }

  // Split integer/decimal
  const [integerPartRaw, decimalPartRaw = ''] = value.split('.');
  let integerPart = integerPartRaw.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  let decimalPart = decimalPartRaw.slice(0, 2);

  // Rebuild value
  input.value = decimalPart ? `${integerPart}.${decimalPart}` : integerPart;

  // Restore caret
  let newCaretPos = 0, digitsSeen = 0;
  while (newCaretPos < input.value.length && digitsSeen < digitsBeforeCaret) {
    if (/\d/.test(input.value[newCaretPos])) digitsSeen++;
    newCaretPos++;
  }
  input.setSelectionRange(newCaretPos, newCaretPos);
}


function getNumericValue(inputElement) {
  if (!inputElement) return null;

  // Strip commas but keep decimal point
  let raw = inputElement.value.replace(/,/g, '');

  // Convert to float so decimals are preserved
  let num = parseFloat(raw);

  return isNaN(num) ? null : num;
}

function normalizeName(fullName) {
  return fullName
    .trim()
    .replace(/\./g, '') // remove dots
    .split(/\s+/);      // split by spaces
}

function compareNames(name1, name2) {
  const parts1 = normalizeName(name1);
  const parts2 = normalizeName(name2);

  const last1 = parts1.at(-1).toLowerCase();
  const last2 = parts2.at(-1).toLowerCase();

  const firstInitial1 = parts1[0][0].toLowerCase();
  const firstInitial2 = parts2[0][0].toLowerCase();

  return {
    lastMatch: last1 === last2,
    initialMatch: firstInitial1 === firstInitial2,
    likelySamePerson: last1 === last2 && firstInitial1 === firstInitial2
  };
}



// SELECT MULTIPLE OPTION
document.querySelectorAll('select[multiple] option').forEach(function (option) {
  option.addEventListener('mousedown', function (e) {
    e.preventDefault();

    var parent = this.parentElement;
    var originalScrollTop = parent.scrollTop;

    // console.log(originalScrollTop);

    // Toggle the 'selected' property
    this.selected = !this.selected;

    // Focus on the parent (the <select> element)
    parent.focus();

    // Reset the scroll position after the selection change
    setTimeout(function () {
      parent.scrollTop = originalScrollTop;
    }, 0);

    return false;
  });
});

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.form-select').forEach(selectElement => {
    // Attach the change event
    selectElement.addEventListener('change', handleSelectChange);

    // 🔁 Trigger the logic manually for the preselected option
    handleSelectChange.call(selectElement);
  });
});

function handleSelectChange() {
  const selectedOption = this.options[this.selectedIndex];
  if (selectedOption && selectedOption.value) {
    const selectedDivision = selectedOption.dataset.division;
    this.dataset.selected = selectedOption.value;
    this.dataset.division = selectedDivision || selectedOption.value;
  } else {
    this.dataset.selected = '';
    this.dataset.division = '';
  }
}

function submitGuestToken() {
  document.getElementById('guestForm').submit();
}

// DO NOT FUCKING DELETE THIS CODE
// Initial call to set the time
// refreshDiv();

// Refresh every second
// setInterval(refreshDiv, 1000);

// Initial call to fetch the notification
// fetchNotificationCount() // Enable this shits

// Periodically check for updated notif`ication count (e.g., every 5 seconds)
// setInterval(fetchNotificationCount, 5000); // Adjust interval as needed  // Enable this shits
