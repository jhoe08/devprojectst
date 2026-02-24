const express = require('express');
const https = require('https');

const connection = require('../admin/database');

const router = express.Router();

router.get('/transactions', async (req, res) => {
    try {
        const { name } = req.query; // capture filters

        // Build a filter object dynamically
        // const filters = {};
        // if (name) filters['JSON_UNQUOTE(JSON_EXTRACT(prepared_by, \'$.name\'))'] = name;
        // if (role) filters.role = role;
        // if (department) filters.department = department;
        
        const filter = {'JSON_UNQUOTE(JSON_EXTRACT(prepared_by, \'$.name\'))': name}
        // console.log({filter})
        // Pass filters to your DB function
        const transactions = await connection.getTransactions(filter);
        // Send the filtered and safe employee data as JSON response
        res.json(transactions);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});


module.exports = router;