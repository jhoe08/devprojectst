// Mysql connection configuration
let mysql = require('mysql');

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pCYiE&2wDa^BUWL*#',
    database : 'transto',
    charset  : "utf8mb4",
  });

  connection.connect();


  
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
    updateTransactionsDisplay: (component, data) => new Promise((resolve, reject) => {
        // UPDATE table_name
        // SET column1 = value1, column2 = value2, ...
        // WHERE condition;

        connection.query(`INSERT INTO discarding (component, data) VALUES ('${component}', ${data})`, (error, results) => {
        // connection.query(`UPDATE discarding SET data = ${data} WHERE component='${component}'`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    divisions: (division) => {
        let lists = ["ILD", "PMED", "FOD", "ADMIN", "RESEARCH", "REGULATORY", "AMAD", "RAED", "Others"]
        let colors = ["count", "black", "primary", "secondary", "tertiary", "info", "success", "warning", "danger"]

        let color = lists.indexOf(division)

        return colors[color];

    }
};
