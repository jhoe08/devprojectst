const mysql = require('mysql');

class DatabaseConnection {
    constructor() {
        this.connection = null;
    }

    async connect(config) {
        return new Promise((resolve, reject) => {
            this.connection = mysql.createConnection(config);

            this.connection.connect((err) => {
                if (err) {
                    console.error('Database connection failed:', err);
                    reject(err);
                } else {
                    console.log('Database connected successfully');
                    resolve(this.connection);
                }
            });
        });
    }

    async disconnect() {
        if (this.connection) {
            return new Promise((resolve, reject) => {
                this.connection.end((err) => {
                    if (err) {
                        reject(err);
                    } else {
                        console.log('Database disconnected');
                        resolve();
                    }
                });
            });
        }
    }

    // Helper method to execute queries
    async executeQuery(sql, values = []) {
        return new Promise((resolve, reject) => {
            this.connection.query(sql, values, (err, results) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(results);
                }
            });
        });
    }

    async query(sql, values = []) {
        return this.executeQuery(sql, values);
    }

    // // User operations
    // async createUser(data) {
    //     const sql = 'INSERT INTO users (name, email, password, created_at) VALUES (?, ?, ?, NOW())';
    //     const values = [data.name, data.email, data.password];
    //     return await this.executeQuery(sql, values);
    // }

    // async findUser(query) {
    //     let sql = 'SELECT * FROM users WHERE ';
    //     const conditions = [];
    //     const values = [];

    //     if (query.email) {
    //         conditions.push('email = ?');
    //         values.push(query.email);
    //     }
    //     if (query.id) {
    //         conditions.push('id = ?');
    //         values.push(query.id);
    //     }

    //     sql += conditions.join(' AND ');
    //     sql += ' LIMIT 1';

    //     const results = await this.executeQuery(sql, values);
    //     return results[0] || null;
    // }

    // // Product operations
    // async createProduct(data) {
    //     const sql = 'INSERT INTO products (name, description, price, created_at) VALUES (?, ?, ?, NOW())';
    //     const values = [data.name, data.description, data.price];
    //     return await this.executeQuery(sql, values);
    // }

    // async findProducts(query = {}) {
    //     let sql = 'SELECT * FROM products';
    //     const conditions = [];
    //     const values = [];

    //     if (query.name) {
    //         conditions.push('name LIKE ?');
    //         values.push(`%${query.name}%`);
    //     }
    //     if (query.price_min) {
    //         conditions.push('price >= ?');
    //         values.push(query.price_min);
    //     }
    //     if (query.price_max) {
    //         conditions.push('price <= ?');
    //         values.push(query.price_max);
    //     }

    //     if (conditions.length > 0) {
    //         sql += ' WHERE ' + conditions.join(' AND ');
    //     }

    //     return await this.executeQuery(sql, values);
    // }
}

module.exports = DatabaseConnection;