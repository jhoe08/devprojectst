const express = require('express');
const https = require('https');

const connection = require('../admin/database');
const { route } = require('./root');

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

router.get('/transactions/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await connection.getTransactionById(id);
        console.log({transaction})
        if (transaction.length > 0) {
            res.json(transaction);
        } else {
            res.status(404).json({ error: 'Transaction not found' });
        }
    } catch (error) {
        console.error('Error fetching transaction:', error);
        res.status(500).json({ error: 'Failed to fetch transaction' });
    }
});


module.exports = router;