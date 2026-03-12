const utils = {
    notifyCustom(type, title, message, status) {
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
    },
    fieldsUpdated(container) {
        const fields = document.querySelectorAll(`${container} .form-control`);

        fields.forEach(field => {
            field.addEventListener('input', function () {
                this.classList.toggle('updated', !!this.value);
            });

            // For select elements, listen for the 'change' event
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', function () {
                    this.classList.toggle('updated', !!this.value);
                });
            }
        });
    },
    // Function to sum all unitCount fields and update totalCo
    updateTotal(selector) {
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
    },
    // Function to add commas on the field that set to data-type=number
    formatNumberWithCommas(event) {
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
}

export default { ...utils }