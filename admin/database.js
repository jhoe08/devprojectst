// Mysql connection configuration
let mysql = require('mysql');
let moment = require('moment')

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pCYiE&2wDa^BUWL*#',
    database : 'transto',
    charset  : "utf8mb4",
  });

  connection.connect();

function convertDate (date) {
    return moment(date).format("YYYY-MM-DD hh:mm:ss");
} 
  
module.exports = {
    getTransactions: () => new Promise((resolve, reject) => {
        connection.query('SELECT * FROM transid', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    getTransactionById: (id) => new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM transid WHERE product_id=${id}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    postTransactions: (data) => new Promise((resolve, reject) => {
        console.log(data)
        let {bid_notice_title, pr_classification, requisitioner, division, approved_budget, banner_program, bac_unit, fund_source, remarks} = JSON.parse(data)
        
        let pr_date = convertDate(new Date())

        connection.query(`INSERT INTO transid (bid_notice_title, requisitioner, division, pr_classification, approved_budget, fund_source, banner_program, bac_unit, remarks, pr_date)
        VALUES ('${bid_notice_title}', '${requisitioner}', '${division}', '${pr_classification}', ${approved_budget}, '${fund_source}', '${banner_program}', '${bac_unit}', 0, '${pr_date}')`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        })
    }),
    postRemarks: (data) => new Promise((resolve, reject) => {
        console.log(data)
        let {comment, user, refid, status} = JSON.parse(data)
        let date = convertDate(new Date())

        connection.query(`INSERT INTO remarks (comment, status, refid, user, date) VALUES ('${comment}', '${status}', ${refid}, '${user}', '${date}')`, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    putTransactions: (data) => new Promise((resolve, reject) => {
        
    }),
    updateTransactionsDisplay: (component, data) => new Promise((resolve, reject) => {
        // UPDATE table_name
        // SET column1 = value1, column2 = value2, ...
        // WHERE condition;
        connection.query(`SELECT * FROM discarding WHERE component='${component}'`, (error, results) => {

        // connection.query(`INSERT INTO discarding (component, data) VALUES ('${component}', ${data})`, (error, results) => {
        // connection.query(`UPDATE discarding SET data = ${data} WHERE component='${component}'`, (error, results) => {
            if (error) {
                reject(error);
                console.log('rejected')
            } else {
                resolve(results);
                console.log('resolved')
                console.log(resolve(results))
            }
        });
    }),
    getListOfDiscarded: () => new Promise((resolve, reject) => {
        connection.query('SELECT * FROM discarding', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    getRemarksByRefid: (id) => new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM remarks WHERE refid=${id}`, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    // { id: 1234 } or { refid: 1234 }
    retrieveData: (table, filter) => new Promise((resolve, reject) => {
        let sql = `SELECT * FROM ${table}`
        if(filter) {
            let lastKey = filter.at(-1)
            sql += " WHERE"
            filter.forEach((key, value) => {
                if(lastKey == value) {

                }
                sql += ` ${key}='$value'`
            });
        }
        connection.query(sql, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    createRemarks: (message, user) => new Promise((resolve, reject) => {
        connection.query(`INSERT INTO remarks (message, user) values ('${message}', '${user}')`, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),

    putRemarks: (id) => new Promise((resolve, reject) => {

    }),
    // Sample
    divisions: (division) => {
        let lists = ["ILD", "PMED", "FOD", "ADMIN", "RESEARCH", "REGULATORY", "AMAD", "RAED", "Others"]
        let colors = ["count", "black", "primary", "secondary", "tertiary", "info", "success", "warning", "danger"]

        let color = lists.indexOf(division)

        return colors[color];
    }, 

};
