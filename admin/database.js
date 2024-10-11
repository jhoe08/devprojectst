// Mysql connection configuration
let mysql = require('mysql');
let moment = require('moment')
const misc = require("./misc")
const {isValidJSON} = require("./utils")

const { hashPassword, registerUser, loginUser } = misc

let prefix = 'transto'
const TEST_UNIT = process.env.TEST_UNIT

var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'pCYiE&2wDa^BUWL*#',
    database : prefix,
    charset  : "utf8mb4",
  });

  connection.connect();

function convertDate (date, hours) {
    return moment(date)
    .add(hours, TEST_UNIT)
    .format("YYYY-MM-DD hh:mm:ss");
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
        connection.query(`SELECT * FROM ${prefix}.transid`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    getTransactionById: (id) => new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${prefix}.transid WHERE product_id=${id}`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    getEmployeeById: (id) => new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${prefix}.employees WHERE employeeid=${id}`, (error, results) => {
            error ? reject(error) : resolve(results);
        })
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
        let {comment, user, refid, status, dueDate} = JSON.parse(data)
        let date = convertDate(new Date(), 0) // No additional hours
        let values = ''
       
        refid = JSON.parse(refid)
        dueDate = convertDate(new Date(), dueDate)
      
        if(Array.isArray(refid)) {
            values = refid.map(id => 
                `('${comment}', '${status}', ${id}, '${user}', '${date}', '${dueDate}')`
              ).join(', ');
        } else {
            values = `('${comment}', '${status}', ${refid}, '${user}', '${date}', '${dueDate}')`
        }

        connection.query(`INSERT INTO remarks (comment, status, refid, user, date, dueDate) VALUES ${values}`, (error, results) => {
            if (error) {    
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    putTransactions: async (data) => {
        console.log('putTransactions')
        console.log(data)
    },
    hideToDisplay: async (component, id) => {
        try {
            // Fetch the existing list for the given component
            // let [rows] = connection.query(`SELECT * FROM ${prefix}.discarding WHERE component = ?`, [component]);
            
            let rows = await databaseUtils.getListOfDiscarded(component)
            if (rows.length > 0) {
                // List exists, update it
                let data = JSON.parse(rows[0].data);
    
                // Add new ID if it does not already exist
                if (!data.includes(id)) {
                    data.push(id);
                }
    
                // Update the existing record with the new data
                // connection.query(`UPDATE ${prefix}.discarding SET data = ? WHERE component = ?`, [JSON.stringify(data), component]);
                new Promise((resolve, reject) => {
                    connection.query(`UPDATE ${prefix}.discarding SET data = ? WHERE component = ?`, [JSON.stringify(data), component], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });
            } else {
                // List does not exist, create a new one
                let newData = [id];
                // connection.query(`INSERT INTO ${prefix}.discarding (component, data) VALUES (?, ?)`, [component, JSON.stringify(newData)]);
                new Promise((resolve, reject) => {
                    connection.query(`INSERT INTO ${prefix}.discarding (component, data) VALUES (?, ?)`, [component, JSON.stringify(newData)], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });
            }
    
            console.log('Operation successful');
            return 'Operation successful'; // Return a success message or data if needed
        } catch (error) {
            console.error('Error occurred:', error);
            throw error; // Propagate the error for further handling if necessary
        }
    },
    updateTransactionCodes: async (data) => {
        try {
            const {transid, code} = JSON.parse(data)
            let rows = await databaseUtils.retrieveData('transid', 'trans_code', {'product_id': transid})
            console.log(rows[0])
            if(rows.length > 0) {
                let codes = rows[0].trans_code;
                if (!codes || codes.length === 0 || typeof codes === 'string') { codes = [codes] }
                if (isValidJSON(codes)) { codes = JSON.parse(codes) }
                if (!codes.includes(code)) { codes.push(code) }
                
                new Promise((resolve, reject) => {
                    connection.query(`UPDATE ${prefix}.transid SET trans_code = ? WHERE product_id = ?`, [JSON.stringify(codes), transid], (error, results) => {
                        if (error) reject(error);
                        else resolve(results);
                    });
                });
            } 
           
            console.log('Operation successful');
            return 'Operation successful'; // Return a success message or data if needed
        } catch (error) {
            console.error('Error occurred:', error);
            throw error; // Propagate the error for further handling if necessary
        }
    },
    getListOfDiscarded: (component=NULL) => new Promise((resolve, reject) => {
        let query = `SELECT * FROM ${prefix}.discarding`
        if (component) query += ` WHERE component = '${component}'`
        connection.query(query, (error, results) => {
            if (error) reject(error);
            else resolve(results);
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
    retrieveTransactions: async (data) => {
        if (data) {
            data = JSON.parse(data)
            return await databaseUtils.retrieveData('transid', '*', data)
        }

        return await databaseUtils.retrieveData('transid')
    },
    storeData: (table, data) => new Promise((resolve, reject) => {
        
        data = JSON.parse(data )

        let keys = Object.keys(data)
        let values = Object.values(data);

        let query = `INSERT INTO ${table} (`
        query += (keys.join(', ', keys));
        query += ") VALUES (";
        // query += '"' + (values.join('", "', values)) +'"';
        query += `'${values.join("', '", values)}'`
        query += ");";

        console.log(query)
        connection.query(query, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    // Update data
    amendData: async (table, data) => {
        try {
            let { set, where } = JSON.parse(data);
            // Construct SQL query
            let query = `UPDATE ${prefix}.${table} SET `;
                query += Object.entries(set)
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(', ');
                query += ' WHERE ';
                query += Object.entries(where)
                    .map(([key, value]) => `${key}='${value}'`)
                    .join(' AND ');
    
            // Execute the query
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
    // amendEmployeeError: async (data) => {
    //     try {
    //         const table = 'employees'
    //         let { set, where } = JSON.parse(data);
    //         delete set.confirmPassword;
            
    //         data.set.password = JSON.parse({password: set.password})

    //         console.log(table, data)
    //         let query = `SELECT * FROM ${table} `
    //         // Execute the query
    //         return new Promise((resolve, reject) => {
    //             connection.query(query, (error, results) => {
    //                 if (error) reject(error);
    //                 else resolve(results);
    //             });
    //         });

    //     } catch (error) {
    //         return Promise.reject(error);
    //     }
    // },
    // amendEmployeePending: (data) => new Promise((resolve, reject) => {
    //     // console.log(query)
    //     data = JSON.parse(data)
    //     let {set, where} = data
    //     set.password = hashPassword(set.password)
    //     console.log(set)
    // }),
    // amendEmployeeObjectObject: async (data) => {
    //     data = JSON.parse(data)
    //     let {set, where} = data
    //     set.password = await hashPassword(set.username, set.password)
    //     set.password = JSON.stringify(set.password)
    //     // delete set.confirmPassword
    //     data = { set, where }
        
        
    //     const amend = databaseUtils.amendData('employees', set)
    //     console.log("amending", set)
    //     console.log(amend)
    // },
    amendEmployee: async (data) =>{
        return await databaseUtils.amendData('employees', data)
    },
    // store
    postEmployees: async (data) => {
        return await databaseUtils.storeData('employees', data)
    },
    // NOTIFICATIONS
    retrieveNotifications: async (data) => {
        if (data) {
            data = JSON.parse(data)
            return await databaseUtils.retrieveData('notifications', '*', data)
        }
        
        return await databaseUtils.retrieveData('notifications')
    },
    changeNotificationStatus: async (data) => {
        return await databaseUtils.amendData('notifications', data)
    },
    postNotifications: async (data) => {
        return await databaseUtils.storeData('notifications', data)
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
