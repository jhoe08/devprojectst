const DatabaseConnection = require('./DatabaseConnection');

class Transactions {
    constructor(db) {
        this.db = db;
    }

    async connect(config) {
        if (!this.db) {
            this.db = new DatabaseConnection();
        }
        await this.db.connect(config);
    }

    async getAllTransactions() {
        const query = 'SELECT * FROM transactions';
        return await this.db.executeQuery(query);
    }

    async getTransactionById(id) {
        const query = 'SELECT * FROM transactions WHERE id = ?';
        return await this.db.executeQuery(query, [id]);
    }

    async createTransaction(data) {
        const query = 'INSERT INTO transactions (amount, description, date) VALUES (?, ?, ?)';
        return await this.db.executeQuery(query, [data.amount, data.description, data.date]);
    }

    async updateTransaction(id, data) {
        const query = 'UPDATE transactions SET amount = ?, description = ?, date = ? WHERE id = ?';
        return await this.db.executeQuery(query, [data.amount, data.description, data.date, id]);
    }

    async patchTransaction(id, data) {
        const updates = [];
        const values = [];

        if (data.amount !== undefined) {
            updates.push('amount = ?');
            values.push(data.amount);
        }
        if (data.description !== undefined) {
            updates.push('description = ?');
            values.push(data.description);
        }
        if (data.date !== undefined) {
            updates.push('date = ?');
            values.push(data.date);
        }

        if (updates.length === 0) {
            throw new Error('No fields to update');
        }

        const query = `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`;
        values.push(id);

        return await this.db.executeQuery(query, values);
    }

    async deleteTransaction(id) {
        const query = 'DELETE FROM transactions WHERE id = ?';
        return await this.db.executeQuery(query, [id]);
    }
}

module.exports = Transactions;