const prejs = {
    currency(amount){ 
        const locale = 'en';
        const options = {style: 'currency', currency: 'php', minimumFractionDigits: 2, maximumFractionDigits: 2};
        let formatter = new Intl.NumberFormat(locale, options);

        return formatter.format(amount);
    },
    // peso(amount) {
    //     return new Intl.NumberFormat('en-US', {
    //         style: 'currency',
    //         currency: 'PHP',
    //     }).format(amount); 
    // }
}

// let { currency } = prejs
export default {...prejs}