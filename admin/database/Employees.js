const DatabaseConnection = require('./DatabaseConnection');

class Employees {
    constructor(db) {
        this.db = db;
    }
    
    async connect(config) {
        if (!this.db) {
            this.db = new DatabaseConnection();
        }
        await this.db.connect(config);
    }

    async getAll() {
        try {
            const employees = await this.db.query('SELECT * FROM employees');
            return employees.rows || employees;
        } catch (error) {
            throw new Error('Error fetching employees: ' + error.message);
        }
    }

    async getById(id) {
        try {
            const employee = await this.db.query('SELECT * FROM employees WHERE id = ?', [id]);
            return employee[0] || employee.rows?.[0] || null;
        } catch (error) {
            throw new Error('Error fetching employee: ' + error.message);
        }
    }

    async create(employeeData) {
        try {
            const { name, email, position } = employeeData;
            const newEmployee = await this.db.query(
                'INSERT INTO employees (name, email, position) VALUES (?, ?, ?)',
                [name, email, position]
            );
            return newEmployee[0] || newEmployee.insertId || newEmployee;
        } catch (error) {
            throw new Error('Error creating employee: ' + error.message);
        }
    }

    async update(id, employeeData) {
        try {
            const { name, email, position } = employeeData;
            const updatedEmployee = await this.db.query(
                'UPDATE employees SET name = ?, email = ?, position = ? WHERE id = ?',
                [name, email, position, id]
            );
            return updatedEmployee;
        } catch (error) {
            throw new Error('Error updating employee: ' + error.message);
        }
    }

    async delete(id) {
        try {
            await this.db.query('DELETE FROM employees WHERE id = ?', [id]);
            return { message: 'Employee deleted successfully' };
        } catch (error) {
            throw new Error('Error deleting employee: ' + error.message);
        }
    }

    async getEmployeeSummary() {
        const query = `
            SELECT
                COUNT(*) AS total_employees,
                AVG(salary) AS average_salary
            FROM employees
        `;
        return await this.db.executeQuery(query);
    }

    async getEmployeeByUsername(username) {
        const query = 'SELECT * FROM employees WHERE username = ?';
        const result = await this.db.executeQuery(query, [username]);
        return result[0] || null;
    }

}

module.exports = Employees;