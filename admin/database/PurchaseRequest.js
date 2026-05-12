const DatabaseConnection = require('./DatabaseConnection');

class PurchaseRequest {
    constructor(db) {
        this.db = db;
    }

    async connect(config) {
        if (!this.db) {
            this.db = new DatabaseConnection();
        }
        await this.db.connect(config);
    }

    async getAllPurchaseRequests() {
        const query = 'SELECT * FROM purchase_requests';
        return await this.db.executeQuery(query);
    }

    async getPurchaseRequestById(id) {
        const query = 'SELECT * FROM purchase_requests WHERE id = ?';
        return await this.db.executeQuery(query, [id]);
    }

    async createPurchaseRequest(data) {
        const query = 'INSERT INTO purchase_requests (amount, description, date) VALUES (?, ?, ?)';
        return await this.db.executeQuery(query, [data.amount, data.description, data.date]);
    }

    async updatePurchaseRequest(id, data) {
        const query = 'UPDATE purchase_requests SET amount = ?, description = ?, date = ? WHERE id = ?';
        return await this.db.executeQuery(query, [data.amount, data.description, data.date, id]);
    }

    // async patchPurchaseRequest(id, data) {
    //     const updates = [];
    //     const values = [];

    //     if (data.amount !== undefined) {
    //         updates.push('amount = ?');
    //         values.push(data.amount);
    //     }
    //     if (data.description !== undefined) {
    //         updates.push('description = ?');
    //         values.push(data.description);
    //     }
    //     if (data.date !== undefined) {
    //         updates.push('date = ?');
    //         values.push(data.date);
    //     }

    //     if (updates.length === 0) {
    //         throw new Error('No fields to update');
    //     }

    //     const query = `UPDATE transactions SET ${updates.join(', ')} WHERE id = ?`;
    //     values.push(id);

    //     return await this.db.executeQuery(query, values);
    // }

    async deletePurchaseRequest(id) {
        const query = 'DELETE FROM purchase_requests WHERE id = ?';
        return await this.db.executeQuery(query, [id]);
    }

    async getPurchaseRequestsSummary() {
        const query = `
            SELECT
                DATE_FORMAT(date, '%Y-%m') AS month,
                SUM(amount) AS total_amount,
                COUNT(*) AS total_requests
            FROM purchase_requests
            GROUP BY month
            ORDER BY month DESC
        `;
        return await this.db.executeQuery(query);
    }

    async getPurchaseRequestsActivity() {
        const query = `
            SELECT
                DATE_FORMAT(date, '%Y-%m') AS month,
                COUNT(*) AS total_activities
            FROM purchase_requests
            GROUP BY month
            ORDER BY month DESC
        `;
        return await this.db.executeQuery(query);
    }

    async getPurchaseRequestsByPreparedBy(preparedBy) {
        const query = 'SELECT * FROM purchase_requests WHERE JSON_UNQUOTE(JSON_EXTRACT(prepared_by, `$.name`)) = ?';
        
        return await this.db.executeQuery(query, [preparedBy]);
    }

}

module.exports = PurchaseRequest;