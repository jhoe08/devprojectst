// Mysql connection configuration
let mysql = require('mysql');
let moment = require('moment')
const misc = require("./misc")
const { isValidJSON } = require("./utils");

const { hashPassword, registerUser, loginUser } = misc

let prefix = 'procurementtracker'
const tables = {
  employee: 'employees',
  transaction: 'transid',
  transaction_activity: 'transid_activity',
  remark: 'remarks',
  document: 'documents',
  notification: 'notifications'

}
const TEST_UNIT = process.env.TEST_UNIT

var connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: prefix,
  charset: "utf8mb4",
});

connection.connect();

function convertDate(date, hours) {
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
function toSentenceCase(str) {
  if (typeof str !== 'string') return str; // Ensure input is a string
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function addEmployeeToRole(role_name, employeeid, rolesData) {
  for (let role of rolesData) {
    if (role.name === role_name) {
      // If no array exists yet, create one
      if (!Array.isArray(role.employees)) {
        role.employees = [employeeid];
      } else {
        // Add employee ID only if it's not already in the array
        if (!role.employees.includes(employeeid)) {
          role.employees.push(employeeid);
        }
      }
      return role; // Return the updated role
    }
  }
  // Optional: Handle case when role_name not found
  console.warn(`Role '${role_name}' not found.`);
  return null;
}

const databaseUtils = {
  getDistinct: (column, table) => new Promise((resolve, reject) => {
    connection.query(`SELECT DISTINCT(${column}) FROM ${prefix}.${table}`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    })
  }),
  cardsData: () => new Promise((resolve, reject) => {
    // const query = `
    //   SELECT 
    //     '${tables.employee}' AS table_name,
    //     COUNT(*) AS row_count
    //   FROM ${prefix}.${tables.employee}

    //   UNION ALL

    //   SELECT 
    //     '${tables.transaction}' AS table_name,
    //     COUNT(*) AS row_count,
    //     SUM(approved_budget) AS total_sum
    //   FROM ${prefix}.${tables.transaction}

    //   UNION ALL

    //   SELECT 
    //     '${tables.notification}' AS table_name,
    //     COUNT(*) AS row_count,
    //     NULL AS total_sum
    //   FROM ${prefix}.${tables.notification}
    // `;
    const query = `
      SELECT 
        '${tables.transaction}' AS table_name,
        COUNT(*) AS row_count,
        SUM(approved_budget) AS total_sum
      FROM ${prefix}.${tables.transaction}`;
    connection.query(query, (error, results) => {
      if (error) {
        return reject(error);
      }
      resolve(results);
    });

  }),
  countPerPRClassification: async () => {
    try {
      const distinctClassifications = await databaseUtils.getDistinct('pr_classification', tables.transaction);
      let classificationsArray = distinctClassifications.map(row => `'${row.pr_classification}'`);

      if (classificationsArray.length === 0) {
        return [];
      }

      const classificationList = classificationsArray.join(', ');
      const query = `SELECT 
                                pr_classification,
                                COUNT(*) AS item_count
                            FROM 
                                ${prefix}.${tables.transaction}
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
  countTotalRows: (table) => new Promise((resolve, reject) => {
    connection.query(`SELECT count(${table}) as total FROM ${prefix}.${tables.transaction}`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  }),
  getTotalApprovedBudget: () => new Promise((resolve, reject) => {
    connection.query(`SELECT sum(approved_budget) as total FROM ${prefix}.${tables.transaction}`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  }),
  getEmployeeSummary: async () => {
    const query = `SELECT 
        'employees' AS table_name,
        COUNT(*) AS row_count
      FROM ${prefix}.${tables.employee}`;

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  },
  getTransactionSummary: async () => {
    const query = `SELECT 
        '${tables.transaction}' AS table_name,
        COUNT(*) AS row_count,
        SUM(approved_budget) AS total_abc
      FROM ${prefix}.${tables.transaction}`;

    return new Promise((resolve, reject) => {
        connection.query(query, (error, results) => {
          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
  },
  getEmployees: async (data) => {
    if (data) {
      data = JSON.parse(data)
      return await databaseUtils.retrieveData(`${tables.employee}`, '*', data)
    }
    return await databaseUtils.retrieveData(`${tables.employee}`)
  },
  getTransactions: async (data) => {
     if (data) {
      data = JSON.parse(data)
      return await databaseUtils.retrieveData(`${tables.transaction}`, '*', data)
    }
    return await databaseUtils.retrieveData(`${tables.transaction}`)
  },
  getActivities: async (data) => {
    if (data) {
      return await databaseUtils.retrieveData(`${tables.transaction_activity}`, '*', JSON.parse(data))
    }
    return await databaseUtils.retrieveData(`${tables.transaction_activity}`)
  },
  getTransactionById2: (id) => new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${prefix}.${tables.transaction} WHERE product_id=${id}`, (error, results) => {
      if (error) {
        reject(error);
      } else {
        resolve(results);
      }
    });
  }),
  getTransactionById: async (id) => {
    const data = { product_id: id }
    return await databaseUtils.retrieveData(tables.transaction, '*', data)
  },
  getEmployeeById: async (id) => {
    return await databaseUtils.retrieveData(tables.employee, '*', { employeeid: id })
  },
  getEmployeeByUsername: (username) => new Promise((resolve, reject) => {
    connection.query(`SELECT * FROM ${prefix}.${tables.employee} WHERE username LIKE '${username}'`, (error, results) => {
      error ? reject(error) : resolve(results);
    })
  }),
  getEmployeesUnderSameDivision: (employeeid) => new Promise((resolve, reject) => {
    // First, get the division and section of the reference employee
    const query = `SELECT
      JSON_UNQUOTE(JSON_EXTRACT(experience, '$.lists[0].division')) AS division
    FROM transto.employees
    WHERE employeeid = ?
    LIMIT 1;
`;
    connection.query(query, [employeeid], (error, results) => {
      if (error) return reject(error);
      if (!results.length) return resolve([]);

      const { division } = results[0];

      // Now, get all employees with the same division or section
      const query2 = `
        SELECT * FROM ${prefix}.employees
        WHERE 
          JSON_UNQUOTE(JSON_EXTRACT(experience, '$.lists[0].division')) = ?
      `;

      console.log({query, query2})
      connection.query(query2, [division], (error2, results2) => {
        if (error2) return reject(error2);
        resolve(results2);
      });
    });
  }),
  postTransactions: async (data) => {
    let enrichedData = {
      ...data,
      pr_date: convertDate(new Date()) // or use Date.now() for a timestamp
    };
    enrichedData = JSON.stringify(enrichedData)
    return await databaseUtils.storeData(tables.transaction, enrichedData);
  },
  postRemarks: async (data) => {
    const { dueDate } = JSON.parse(data)
    console.log('data - adding remarks', data, dueDate)
    if (dueDate) {
      data = JSON.stringify({ ...JSON.parse(data), dueDate: convertDate(new Date(), dueDate) })
    }
    return await databaseUtils.storeData(tables.remark, data)
  },
  ___postRemarks: (data) => new Promise((resolve, reject) => {
    return databaseUtils.storeData('remarks', data)
    let { comment, user, refid, status, dueDate } = JSON.parse(data)
    let date = convertDate(new Date(), 0) // No additional hours
    let values = ''

    refid = JSON.parse(refid)
    dueDate = convertDate(new Date(), dueDate)

    if (Array.isArray(refid)) {
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
    console.log('data - updating transactions', data)
    return await databaseUtils.amendData(table.transaction, data)
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
      const { transid, code } = JSON.parse(data)
      let rows = await databaseUtils.retrieveData(tables.transaction, 'trans_code', { 'product_id': transid })
      console.log(rows[0])
      if (rows.length > 0) {
        let codes = rows[0].trans_code;
        if (!codes || codes.length === 0 || typeof codes === 'string') { codes = [codes] }
        if (isValidJSON(codes)) { codes = JSON.parse(codes) }
        if (!codes.includes(code)) { codes.push(code) }

        new Promise((resolve, reject) => {
          connection.query(`UPDATE ${prefix}.${tables.transaction} SET trans_code = ? WHERE product_id = ?`, [JSON.stringify(codes), transid], (error, results) => {
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
  getListOfDiscarded: (component = NULL) => new Promise((resolve, reject) => {
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
                                ${prefix}.remarks AS remarks
                                    JOIN
                                ${prefix}.employees AS employees ON remarks.user = employees.username
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
    return await databaseUtils.retrieveData('employees', '*', { username })
  },
  retrieveEmployeeIdsWithRole: async () => {
    const query = ` SELECT emp.employeeid, rol.role_name
                        FROM ${prefix}.employees AS emp
                        INNER JOIN ${prefix}.roles AS rol
                        ON CONCAT('[', rol.employee_ids, ']') LIKE CONCAT('%', emp.employeeid, '%');`

    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },
  retrieveTransactions: async (data) => {
    if (data) {
      data = JSON.parse(data)
      return await databaseUtils.retrieveData(tables.transaction, '*', data)
    }

    return await databaseUtils.retrieveData(tables.transaction)
  },
  getData: (table) => new Promise((resolve, reject) => {
    let query = `SELECT * FROM ${prefix}.${table}`;

    connection.query(query, (error, results) => {
      if (error) {
        reject(error)
      } else {
        resolve(results)
      }
    })
  }),
  getDataById: (table, data) => new Promise((resolve, reject) => {
    console.log({table, data})
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

    const query = `INSERT INTO ${prefix}.${table} (${keys.join(',')}) VALUES (${values.map(() => '?').join(',')})`;

    console.log({query})
    connection.query(query, values, (error, results) => {
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
      set = Object.fromEntries(
        Object.entries(set).map(([key, value]) => {
          // Check if value is a string, and apply TRIM
          if (typeof value === 'string') {
            return [key, value.trim()]
          }
          return [key, value]; // Leave other types unchanged
        })
      );
      // Construct SQL query
      // let query = `UPDATE ${prefix}.${table} SET `;
      // query += Object.entries(set)
      //   .map(([key, value]) => `${key}='${value}'`)
      //   .join(', ');
      // query += ' WHERE ';
      // query += Object.entries(where)
      //   .map(([key, value]) => `${key}='${value}'`)
      //   .join(' AND ');

      const keys = Object.keys(set);
      const values = Object.values(set);
      const conditions = Object.entries(where)
        .map(([key, value]) => `${key} = ?`)
        .join(' AND ');

      const query = `UPDATE ${prefix}.${table} SET ${keys.map(k => `${k} = ?`).join(', ')} WHERE ${conditions}`;
      const params = [...values, ...Object.values(where)];


      console.log(query)
      // Execute the query
      return new Promise((resolve, reject) => {
        connection.query(query, params, (error, results) => {
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
    if (!filter) { filter = '*'; }
    let query = `SELECT ${filter} FROM ${prefix}.${table}`
    if (where) {
      query += " WHERE"
      query += Object.entries(where)
        .map(([key, value]) => {
          if (value === '' || value === null) return ` ${key} IS NULL`;
          return ` ${key}='${value}'`
        })
        .join(' AND');
    }
    // console.log('Retrieving Data...', query)
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
    // FROM ${prefix}.documents AS doc
    // INNER JOIN ${prefix}.documents_activity AS act ON doc.id = act.refid
    // WHERE act.refid = 3;

  }),
  ///////////////////////////////////////////////////////////////
  // UPDATE
  amendEmployee: async (data) => {
    return await databaseUtils.amendData('employees', data)
  },
  // STORE
  postEmployees: async (data) => {
    try {
      const { employeeid, roles } = JSON.parse(data); // Only parse if data is a string
      console.log({ employeeid, roles });

      // let parsedData = JSON.parse(data)
      // delete parsedData.roles;
      // parsedData = JSON.encode(parsedData)

      // Optional: Store employee data if needed
      await databaseUtils.storeData('employees', data);
      console.log('Stored employee data for:', employeeid);
    } catch (error) {
      console.error('Error during employee and role storage:', error);
    }
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
    data = JSON.stringify({ ...data, created_at: convertDate(new Date()), updated_at: convertDate(new Date()) })
    return await databaseUtils.storeData('notifications', data)
  },
  // endof NOTIFICATIONS
  // DOCUMENTS
  getDocumentTrackerAnalysis: () => new Promise((resolve, reject) => {
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
  getDocumentTrackerActivityReplies: () => new Promise((resolve, reject) => {
    const query = ` SELECT 
                            COUNT(*) AS total_rows,
                            SUM(CASE WHEN timetocomply IS NULL THEN 1 ELSE 0 END) AS replies
                        FROM ${prefix}.documents_activity`
    return connection.query(query, (error, results) => {
      if (error) { reject(error) }
      else { resolve(results) }
    })
  }),
  createDocumentTracker: async (data) => {
    const now = convertDate(new Date())
    data = JSON.parse(data)
    data = JSON.stringify({ ...data, created_at: now, updated_at: now })
    return await databaseUtils.storeData('documents', data)
  },
  getDocumentTrackerData: async (data) => {
    if (data) {
      data = JSON.parse(data)
      return await databaseUtils.retrieveData('documents', '*', data)
    }

    return await databaseUtils.retrieveData('documents')
  },
  updateDocumentTrackerStatus: async (data) => {
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

    const result = await databaseUtils.retrieveData('documents', '*', { id })
    if (result.length > 0) {
      const { created_at } = JSON.parse(JSON.stringify(result[0]))
      return (date === moment(created_at).format('YYYYMMDD')) ? JSON.stringify(result[0]) : false
    }

    return false
  },
  // endof DOCUMENTS
  getDataFromLast7Days: async (table, column) => {
    const query = `SELECT * FROM ${prefix}.${table} WHERE ${column} >= CURDATE() - INTERVAL 7 DAY;`
    // const query = ` SELECT 
    //                     ${tables.remark}.*, ${tables.transaction}.*
    //                 FROM
    //                     ${prefix}.remarks AS remarks
    //                         JOIN
    //                     ${prefix}.${tables.transaction} 
    //                         AS transactions ON remarks.refid = transactions.product_id
    //                 WHERE
    //                     remarks.date >= CURDATE() - INTERVAL 7 DAY;`

    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },
  getRoles: async () => {
    return await databaseUtils.retrieveData('roles')
  },
  getCurrentUserRole: async (employeeid, columnName = 'role_name') => {
    const query = `SELECT ${columnName} FROM ${prefix}.roles WHERE employee_ids LIKE '%${employeeid}%'`
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },
  getDivisionAndPosition: async (position, division) => {
    const query = `SELECT * 
      FROM ${prefix}.employees 
      WHERE JSON_EXTRACT(experience, '$.position') = '${position}'
        AND JSON_EXTRACT(experience, '$.division') = '${division}';`
    
    return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },
  // Transaction Activity
  postTransactionActivity: async (data) => {
    return await databaseUtils.storeData(`${tables.transaction_activity}`, data)
  },

  getTransactionActivity: async (data) => {
    return await databaseUtils.getData(`${tables.transaction_activity}`)
  },
  getTransactionActivityId: async (data) => {
    return await databaseUtils.getDataById(`${tables.transaction_activity}`, data)
  },
  updateTransactionActivity: async (data) => {
    return await databaseUtils.amendData(`${tables.transaction_activity}`, data)
  },
  // endof Transaction Activity
  retrieveDocuments: async (table, data) => {
    return await databaseUtils.getDataById(table, data)
  },

  postSettings: async (table, data) => {
    console.log('postSettings', data)
    return await databaseUtils.storeData(table, data)
  },

  getSettings: async (data) => {
    if (data) {
      data = JSON.parse(data)
      return await databaseUtils.retrieveData('settings', '*', data)
    }

    return await databaseUtils.retrieveData('settings')
  },

  // Sample
  divisions: (division) => {
    let lists = ["ILD", "PMED", "FOD", "ADMIN", "RESEARCH", "REGULATORY", "AMAD", "RAED", "Others"]
    let colors = ["count", "black", "primary", "secondary", "tertiary", "info", "success", "warning", "danger"]

    let color = lists.indexOf(division)

    return colors[color];
  },
  //////////////////////////////////////////////////////
  // GUEST TOKENS

  async storeGuestToken(tokenData) {
    // tokenData: { token, created_at, expires_at, ip, device, used }
    // status: 'active' by default
    const {
      token,
      created_at,
      expires_at,
      meta,
    } = tokenData;
    const status = 'active';
    const metadata = JSON.stringify(meta);

    return new Promise((resolve, reject) => {
      const query = `
        INSERT INTO ${prefix}.guest_accounts
          (guest_token, created_at, expires_at, status, metadata)
        VALUES (?, ?, ?, ?, ?)
      `;
      connection.query(query, [token, created_at, expires_at, status, metadata], (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

  async findGuestToken(token) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT * FROM ${prefix}.guest_accounts
        WHERE guest_token = ?
        LIMIT 1
      `;
      connection.query(query, [token], (error, results) => {
        if (error) reject(error);
        else resolve(results.length ? results[0] : null);
      });
    });
  },

  async markGuestTokenUsed(data) {
    const { token, expires_at, meta } = data
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE ${prefix}.guest_accounts
        SET status = ?, metadata = JSON_SET(metadata, '$.used', true), expires_at = ?, metadata = ?
        WHERE guest_token = ?
      `;

      const values = [
        'used',
        expires_at,
        meta,
        token
      ];

      connection.query(query, values, (error, results) => {
        if (error) reject(error);
        else resolve(results);
      });
    });
  },

}

module.exports = databaseUtils
