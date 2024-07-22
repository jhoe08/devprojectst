const prejs = {
    currency(amount){ 
        const locale = 'en';
        const options = {style: 'currency', currency: 'php', minimumFractionDigits: 2, maximumFractionDigits: 2};
        let formatter = new Intl.NumberFormat(locale, options);

        return formatter.format(amount);
    }
}

let { currency } = prejs