const DatabaseConnection = require('./DatabaseConnection');

class Notifications {
    constructor(db) {
        this.db = db;
    }

    async connect(config) {
        if (!this.db) {
            this.db = new DatabaseConnection();
        } 
        await this.db.connect(config);
    }

    async create(userId, message, type) {
        return this.db.executeQuery(
            'INSERT INTO notifications (user_id, message, type, created_at) VALUES (?, ?, ?, NOW())',
            [userId, message, type]
        );
    }

    async getByUserId(userId, limit = 10) {
        return this.db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT ?',
            [userId, limit]
        );
    }

    async markAsRead(notificationId) {
        return this.db.query(
            'UPDATE notifications SET is_read = true WHERE id = ?',
            [notificationId]
        );
    }

    async delete(notificationId) {
        return this.db.query(
            'DELETE FROM notifications WHERE id = ?',
            [notificationId]
        );
    }

    async getUnreadCount(userId) {
        return this.db.query(
            'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND is_read = false',
            [userId]
        );
    }

    async retrieveNotifications(userId = null, limit = 10) {
        let query = 'SELECT * FROM notifications';
        const params = [];

        if (userId !== null && userId !== undefined) {
            query += ' WHERE user_id = ?';
            params.push(userId);
        }

        query += ' ORDER BY created_at DESC';

        if (limit !== null && limit !== undefined) {
            query += ' LIMIT ?';
            params.push(limit);
        }

        return this.db.executeQuery(query, params);
    }
}

module.exports = Notifications;