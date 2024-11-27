const utils = {
    notifyCustom(type, title, message, status) {
        return $.notify({
            icon: `icon-${type ?? 'bell'}`,
            title: `${title ?? 'Error'}`,
            message: `${message ?? 'System found an issue!'}`,
            },{
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
            field.addEventListener('input', function() {
                this.classList.toggle('updated', !!this.value);
            });
        
            // For select elements, listen for the 'change' event
            if (field.tagName === 'SELECT') {
                field.addEventListener('change', function() {
                    this.classList.toggle('updated', !!this.value);
                });
            }
        });
    }
}

export default {...utils}