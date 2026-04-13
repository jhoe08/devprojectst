require('dotenv').config();
// Mysql connection configuration
let mysql = require('mysql');
let moment = require('moment')
const misc = require("./misc")
const { isValidJSON } = require("./utils");
const DatabaseConnection = require('./database/DatabaseConnection');
const PurchaseRequest = require('./database/PurchaseRequest');
const Transactions = require('./database/Transactions');
const Notifications = require('./database/Notifications');
const Employees = require('./database/Employees');

let prefix = 'procurementtracker'
const tables = {
  employee: 'employees',
  transaction: 'purchase_request',
  // transaction: 'transid',
  transaction_activity: 'transid_activity',
  transaction_status: 'transid_status_history',
  remark: 'remarks',
  document: 'documents',
  notification: 'notifications',
  settings: 'settings',
  market_scope: 'market_scoping',
  market_scope_results: 'market_scoping_results',
  executives: 'executive_offices',
  divisions: 'departments'
}
const TEST_UNIT = process.env.TEST_UNIT

// Configuration for DatabaseConnection
const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: prefix,
  charset: "utf8mb4",
};

const dbUtils = new DatabaseConnection();

// Initialize Transactions and Notifications instances
const transactions = new Transactions(dbUtils);
const notifications = new Notifications(dbUtils);
const purchaseRequests = new PurchaseRequest(dbUtils);
const employees = new Employees(dbUtils);

async function initializeConnection() {
  await dbUtils.connect(dbConfig);
  await transactions.connect(dbConfig);
  await notifications.connect(dbConfig);
  await purchaseRequests.connect(dbConfig);
  await employees.connect(dbConfig);
  console.log('Database connection initialized successfully.');
  return {
    transactions,
    notifications,
    purchaseRequests,
    employees
  };
}

// Function to initialize database connection
// async function initializeDatabase() {
//   try {
//     await dbUtils.connect(dbConfig);
//     console.log('Database connection established successfully.');

//     // Connect Transactions instance
//     await transactions.connect(dbConfig);

//     // Sample database creation: Create transid_activity table if it doesn't exist
//     const createTableQuery = `
//       CREATE TABLE IF NOT EXISTS \`${prefix}\`.\`transid_activity\` (
//         \`id\` int NOT NULL AUTO_INCREMENT,
//         \`trans_id\` int DEFAULT NULL,
//         \`status\` varchar(50) DEFAULT NULL,
//         \`remarks\` text,
//         \`updated_by\` varchar(100) DEFAULT NULL,
//         \`updated_at\` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
//         PRIMARY KEY (\`id\`)
//       ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
//     `;
//     await dbUtils.executeQuery(createTableQuery);
//     console.log('Sample table transid_activity created or already exists.');

//     // Sample usage of Transactions
//     // Note: This assumes a 'transactions' table exists. For demo purposes, you can create it or comment out.
//     /*
//     try {
//       // Create a sample transaction
//       const newTransaction = await transactions.createTransaction({
//         amount: 100.00,
//         description: 'Sample transaction',
//         date: new Date()
//       });
//       console.log('Sample transaction created:', newTransaction);

//       // Get all transactions
//       const allTransactions = await transactions.getAllTransactions();
//       console.log('All transactions:', allTransactions);
//     } catch (error) {
//       console.log('Transactions operations skipped (table may not exist):', error.message);
//     }
//     */

//   } catch (error) {
//     console.error('Failed to initialize database:', error);
//     throw error;
//   }
// }

// async function disconnectDatabase() {
//   try {
//     await dbUtils.disconnect();
//     console.log('Database connection closed successfully.');
//   } catch (error) {
//     console.error('Failed to disconnect database:', error);
//     throw error;
//   }
// }

// async function executeQuery(sql, values = []) {
//   try {
//     const results = await dbUtils.executeQuery(sql, values);
//     return results;
//   } catch (error) {
//     console.error('Query execution failed:', error);
//     throw error;
//   } finally {
//     await disconnectDatabase();
//   }
// }

// Initialize the database connection and sample creation
initializeConnection();

module.exports = {
  // ...Transactions,
  // ...notifications,
  retrieveNotifications: async (userId = null, limit = 10) => await notifications.retrieveNotifications(userId, limit),
  getTransactions: async (filters = {}) => await transactions.getAllTransactions(filters),
  createTransaction: async (data) => await transactions.createTransaction(data),
  updateTransaction: async (id, data) => await transactions.updateTransaction(id, data),
  deleteTransaction: async (id) => await transactions.deleteTransaction(id),
  getTransactionSummary: async () => await transactions.getTransactionSummary(),
  getEmployeeSummary: async () => await transactions.getEmployeeSummary(),
  getTransactionActivity: async () => await transactions.getTransactionActivity(),
  getMarketScopesSummary: async () => await transactions.getMarketScopesSummary(),
  getPurchaseRequestsSummary: async () => await purchaseRequests.getPurchaseRequestsSummary(),
  getEmployeeSummary: async () => await employees.getEmployeeSummary(),
  getPurchaseRequestsByPreparedBy: async (preparedBy) => await purchaseRequests.getPurchaseRequestsByPreparedBy(preparedBy),
  getEmployeeByUsername: async (username) => await employees.getEmployeeByUsername(username),
};
