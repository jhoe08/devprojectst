"use strict";


const misc = {
    // createTrans: document.getElementById('createTransactions'),
    divisions: ["ILD", "PMED", "FOD", "ADMIN", "RESEARCH", "REGULATORY", "AMAD", "RAED", "Others"],
    badge: ["count", "black", "primary", "secondary", "tertiary", "info", "success", "warning", "danger"],
    getDivisions(division){
        let color = this.divisions.indexOf(division)

        return this.badge[color]
    }
}

module.exports = { misc }


// console.log(misc.getDivisions("ADMIN"))

