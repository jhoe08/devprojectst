// Mysql connection configuration
let mysql = require('mysql');
let moment = require('moment')
const misc = require("./misc")
const {isValidJSON} = require("./utils");
const { reject } = require('bcrypt/promises');

const { hashPassword, registerUser, loginUser } = misc

let prefix = 'transto'
const tables = {
    employee: 'employees',
    transaction: 'transid',
    remark: 'remarks',
    document: 'documents',

}
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
    .format("YYYY-MM-DD HH:MM:ss");
} 

function isEmpty(value) {
    if (value === undefined || value === null) return true;
    if (typeof value === 'string' && value.trim() === '') return true;
    if (Array.isArray(value) && value.length === 0) return true;
    if (typeof value === 'object' && value !== null && Object.keys(value).length === 0) return true;
    return false;
  }

const databaseUtils = {
    getDistinct: (column, table) => new Promise((resolve, reject) =>{
       connection.query(`SELECT DISTINCT(${column}) FROM ${prefix}.${table}`, (error, results) => {
        if (error) {
            reject(error);
        } else {
            resolve(results);
        }
    }) 
    }),
    cardsData: () => new Promise((resolve, reject) =>{
        connection.query(`  SELECT 
                                'employees' AS table_name,
                                COUNT(*) AS row_count,
                                NULL AS total_sum
                            FROM
                                transto.employees 
                            UNION ALL 
                            SELECT 
                                'transactions' AS table_name,
                                COUNT(*) AS row_count,
                                SUM(approved_budget) AS total_sum
                            FROM 
                                transto.transid 
                            UNION ALL 
                            SELECT 
                                'notifications' AS table_name,
                                COUNT(*) AS row_count,
                                NULL AS total_sum
                            FROM
                                transto.notifications
                        `, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    countPerPRClassification: async () => {
        try {
            const distinctClassifications = await databaseUtils.getDistinct('pr_classification', 'transid');
            let classificationsArray = distinctClassifications.map(row => `'${row.pr_classification}'`);

            if (classificationsArray.length === 0) {
                return [];
            }
            
            const classificationList = classificationsArray.join(', ');
            const query = `SELECT 
                                pr_classification,
                                COUNT(*) AS item_count
                            FROM 
                                ${prefix}.transid
                            WHERE 
                                pr_classification IN (${classificationList})
                            GROUP BY 
                                pr_classification
                            ORDER BY 
                                pr_classification`;

            // Execute the query
            return new Promise((resolve, reject) => {
                connection.query(query, (error, results) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(results);
                    }
                });
            });
        } catch (error) {
            throw error;
        }
    },
    countTotalRows:  (table) => new Promise((resolve, reject) => {
        connection.query(`SELECT count(${table}) as total FROM ${prefix}.transid`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
    getTotalApprovedBudget: () => new Promise((resolve, reject) => {
        connection.query(`SELECT sum(approved_budget) as total FROM ${prefix}.transid`, (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    }),
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
    getEmployeeByUsername: (username) => new Promise((resolve, reject) => {
        connection.query(`SELECT * FROM ${prefix}.${tables.employee} WHERE username LIKE '${username}'`, (error, results) => {
            error ? reject(error) : resolve(results);
        })
    }),
    postTransactions: (data) => new Promise((resolve, reject) => {
        // console.log(data)
        let {bid_notice_title, pr_classification, requisitioner, division, approved_budget, banner_program, bac_unit, fund_source, remarks} = JSON.parse(data)
        
        if(isEmpty(bid_notice_title) || isEmpty(pr_classification) /*|| isEmpty(fund_source)*/) {reject('Fields are empty!'); return }

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
            values = refid
            .filter(id => id !== '0' && id !== 0) // Exclude both '0' (string) and 0 (number)
            .map(id => 
              `('${comment}', '${status}', ${id}, '${user}', '${date}', '${dueDate}')`
            )
            .join(', ');
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
        return await databaseUtils.amendData('transactions', data)
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
    getRemarks: async (data) => {
        if (data) {
            data = JSON.parse(data)
            return await databaseUtils.retrieveData('remarks', '*', data)
        }
        
        return await databaseUtils.retrieveData('remarks')
    },
    getRemarksByRefid: (id) => new Promise((resolve, reject) => {
        connection.query(`  SELECT 
                                remarks.*, employees.*
                            FROM
                                transto.remarks AS remarks
                                    JOIN
                                transto.employees AS employees ON remarks.user = employees.username
                            WHERE remarks.refid = ${id}`, (error, results) => {
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
    getDataById: (table, data) => new Promise((resolve, reject) => {
        data = JSON.parse(data)

        let key = Object.keys(data)
        let value = Object.values(data)

        let query = `SELECT * FROM ${prefix}.${table} WHERE ${key}=${value}`
        console.log(query)
        connection.query(query, (error, results) => {
            if (error) {
                reject(error)
            } else {
                resolve(results)
            }
        })
    }),
    ////////////////////////////////////////////////////////////////
    // CREATE DATA
    storeData: (table, data) => new Promise((resolve, reject) => {
        
        data = JSON.parse(data)

        let keys = Object.keys(data)
        let values = Object.values(data);

        let query = `INSERT INTO ${prefix}.${table} (`
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
    // UPDATE DATA
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

            console.log(query)
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
    // READ DATA
    // Trapping Injectors
    // { id: 1234 } or { refid: 1234 }
    // filter = column_name
    retrieveData: (table, filter, where) => new Promise((resolve, reject) => {
        if(!filter) { filter = '*';}
        let query = `SELECT ${filter} FROM ${prefix}.${table}`
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
    retrieveDatas: (tables, filter, where) => new Promise((resolve, reject) => {
        // SELECT doc.*, act.*
        // FROM transto.documents AS doc
        // INNER JOIN transto.documents_activity AS act ON doc.id = act.refid
        // WHERE act.refid = 3;

    }),
    ///////////////////////////////////////////////////////////////
    // UPDATE
    amendEmployee: async (data) =>{
        return await databaseUtils.amendData('employees', data)
    },
    // STORE
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
        data = JSON.parse(data)
        data = JSON.stringify({...data, created_at: convertDate(new Date())})
        return await databaseUtils.storeData('notifications', data)
    },
    // endof NOTIFICATIONS
    // DOCUMENTS
    getDocumentTrackerAnalysis: () => new Promise((resolve, reject) =>{
        const query = `SELECT 
                        COUNT(*) AS total_rows,
                        SUM(CASE WHEN status = 'draft' THEN 1 ELSE 0 END) AS draft_rows,
                        SUM(CASE WHEN status = 'outgoing' THEN 1 ELSE 0 END) AS outgoing_rows
                        FROM ${prefix}.${tables.document};`
        // console.log(query)
        return connection.query(query, (error, results) => {
            if (error) { reject(error) }
            else { resolve(results) }
        })
    }),
    getDocumentTrackerActivityReplies: () => new Promise((resolve, reject) =>{
        const query = ` SELECT 
                            COUNT(*) AS total_rows,
                            SUM(CASE WHEN timetocomply IS NULL THEN 1 ELSE 0 END) AS replies
                        FROM transto.documents_activity`
        return connection.query(query, (error, results) => {
            if (error) { reject(error) }
            else { resolve(results) }
        })
    }),
    createDocumentTracker: async (data) => {
        const now = convertDate(new Date())
        data = JSON.parse(data)
        data = JSON.stringify({...data, created_at: now, updated_at: now })
        return await databaseUtils.storeData('documents', data) 
    },
    getDocumentTrackerData: async (data) => {
        if (data) {
            data = JSON.parse(data)
            return await databaseUtils.retrieveData('documents', '*', data)
        }
        
        return await databaseUtils.retrieveData('documents')
    },
    updateDocumentTrackerStatus: async(data) => {
        return await databaseUtils.amendData('documents', data)
    },
    createDocumentTrackerActivity: async (data) => {
        return await databaseUtils.storeData('documents_activity', data)
    },
    getDocumentTrackerActivity: async (data) => {
        if (data) {
            data = JSON.parse(data)
            return await databaseUtils.retrieveData('documents_activity', '*', data)
        }
        
        return await databaseUtils.retrieveData('documents_activity')
    },
    getDocumentTrackerID: async (params) => {
        const data = params.split('-')
        let id = Number(data[1])
        let date = moment(data[0]).format('YYYYMMDD')

        const result = await databaseUtils.retrieveData('documents', '*', {id})
        if(result.length > 0) {
            const { created_at } = JSON.parse(JSON.stringify(result[0]))
            return (date===moment(created_at).format('YYYYMMDD')) ? JSON.stringify(result[0]) : false
        }
       
        return false
    },
    // endof DOCUMENTS
    getDataFromLast7Days: async (table, column) => {
        // const query = `SELECT * FROM ${prefix}.${table} WHERE ${column} >= CURDATE() - INTERVAL 7 DAY;`
        const query = ` SELECT 
                            remarks.*, transactions.*
                        FROM
                            transto.remarks AS remarks
                                JOIN
                            transto.transid AS transactions ON remarks.refid = transactions.product_id
                        WHERE
                            remarks.date >= CURDATE() - INTERVAL 7 DAY;`

        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    },

    getCurrentUserRole: async (employeeid, columnName='role_name') => {
        const query = `SELECT ${columnName} FROM transto.roles WHERE employee_ids LIKE '%${employeeid}%'`
        return new Promise((resolve, reject) => {
            connection.query(query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
    },

    retrieveDocuments: async (table, data) => {
        return await databaseUtils.getDataById(table, data)
    },

    postSettings: async(table, data) => {
        console.log('postSettings', data)
        return await databaseUtils.storeData(table, data)
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
