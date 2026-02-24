const express = require('express');
const https = require('https');

const connection = require('../admin/database');

const router = express.Router();

router.get('/employees', async (req, res) => {
    try {
        const { firstname, role, department } = req.query; // capture filters

        // Build a filter object dynamically
        const filters = {};
        if (firstname) filters.firstname = firstname;
        // if (role) filters.role = role;
        // if (department) filters.department = department;

        // Pass filters to your DB function
        const employees = await connection.getEmployees(filters);
        // Remove sensitive information before sending response
        const safeEmployees = employees.map(({ password, ...rest }) => rest);
        // Send the filtered and safe employee data as JSON response
        res.json(safeEmployees);
    } catch (error) {
        console.error('Error fetching employees:', error);
        res.status(500).json({ error: 'Failed to fetch employees' });
    }
});


module.exports = router;