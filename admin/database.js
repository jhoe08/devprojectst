// Mysql connection configuration
let mysql = require('mysql');
let moment = require('moment')
const misc = require("./misc")

const { hashPassword, registerUser, loginUser } = misc

let prefix = 'transto'

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pCYiE&2wDa^BUWL*#',
    database : prefix,
    charset  : "utf8mb4",
  });

  connection.connect();

function convertDate (date) {
    return moment(date).format("YYYY-MM-DD hh:mm:ss");
} 

function isEmpty(value) {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
    return false;
  }

const databaseUtils = {
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
        // console.log(data)
        let {bid_notice_title, pr_classification, requisitioner, division, approved_budget, banner_program, bac_unit, fund_source, remarks} = JSON.parse(data)
        
        if(isEmpty(bid_notice_title) || isEmpty(pr_classification) || isEmpty(fund_source)) reject('Fields are empty!')

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
    postEmployees: (data) => new Promise((resolve, reject) => {

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
    // Trapping Injectors
    // { id: 1234 } or { refid: 1234 }
    retrieveData: (table, filter, where) => new Promise((resolve, reject) => {
        if(!filter) { filter = '*';}
        let query = `SELECT ${filter} FROM ${prefix}.${table}`
        console.log({table, where})
        if(where) {
            query += " WHERE"
            query += Object.entries(where)
            .map(([key, value]) => {
                if (value === '' || value === null) return ` ${key} IS NULL`;
                return ` ${key}='${value}'`
            })
            .join(' AND');
        }
        console.log(query)
        connection.query(query, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    retrieveEmployee: async (data, username) => {
        if (data) {
            data = JSON.parse(data)
            return await databaseUtils.retrieveData('employees', '*', data)
        }
        
        return await databaseUtils.retrieveData('employees')
    },
    retrieveEmployeeByUsername: async (username) => {
        return await databaseUtils.retrieveData('employees', '*', {username})
    },
    storeData: (table, data) => new Promise((resolve, reject) => {
        
        data = JSON.parse(data )

        let keys = Object.keys(data)
        let values = Object.values(data);

        let query = `INSERT INTO ${table} (`
        query += (keys.join(', ', keys));
        query += ") VALUES (";
        query += '"' + (values.join('", "', values)) +'"';
        query += ");";

        console.log(query)
    }),
    amendData: async (table, data) => {
        try {
            // console.log(table)
            // console.log(data)
            let { set, where } = JSON.parse(data);
            // console.log(set)
            // console.log(where)
            // delete set.confirmPassword;
            // let {hash, salt} = set.password
    
            // Construct SQL query
            let query = `UPDATE ${prefix}.${table} SET `;
                query += Object.entries(set)
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(', ');
                query += ' WHERE ';
                query += Object.entries(where)
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(' AND ');
    
            // console.log('Update')
            // console.log(query)

            // // Execute the query
            return new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });
    
        } catch (error) {
            console.log('amendData', error)
            return Promise.reject(error);
        }
    
    },
    amendEmployeeError: async (data) => {
        try {
            const table = 'employees'
            let { set, where } = JSON.parse(data);
            delete set.confirmPassword;
            
            data.set.password = JSON.parse({password: set.password})

            console.log(table, data)
            let query = `SELECT * FROM ${table} `
            // Execute the query
            return new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) reject(error);
                    else resolve(results);
                });
            });

        } catch (error) {
            return Promise.reject(error);
        }
    },
    amendEmployeePending: (data) => new Promise((resolve, reject) => {
        // console.log(query)
        data = JSON.parse(data)
        let {set, where} = data
        set.password = hashPassword(set.password)
        console.log(set)
    }),
    amendEmployeeObjectObject: async (data) => {
        data = JSON.parse(data)
        let {set, where} = data
        set.password = await hashPassword(set.username, set.password)
        set.password = JSON.stringify(set.password)
        // delete set.confirmPassword
        data = { set, where }
        
        
        const amend = databaseUtils.amendData('employees', set)
        console.log("amending", set)
        console.log(amend)
    },
    amendEmployee: async (data) =>{
        console.log(data)
       return await databaseUtils.amendData('employees', data)
    },
    // Sample
    divisions: (division) => {
        let lists = ["ILD", "PMED", "FOD", "ADMIN", "RESEARCH", "REGULATORY", "AMAD", "RAED", "Others"]
        let colors = ["count", "black", "primary", "secondary", "tertiary", "info", "success", "warning", "danger"]

        let color = lists.indexOf(division)

        return colors[color];
    }, 
}


module.exports = databaseUtils
