"use strict";


const misc = {
    divisions: ["ILD", "PMED", "FOD", "ADMIN", "RESEARCH", "REGULATORY", "AMAD", "RAED", "Others"],
    badge: ["count", "black", "primary", "secondary", "tertiary", "info", "success", "warning", "danger"],
    getDivisions(division){
        let color = this.divisions.indexOf(division)

        return this.badge[color]
    },
    date(string) {}
}

module.exports = { misc }

console.log(misc.getDivisions("ADMIN"))