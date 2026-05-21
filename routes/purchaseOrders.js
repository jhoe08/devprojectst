const express = require('express');
const https = require('https');

const connection = require('../admin/database_backup');
const { route } = require('./root');

const router = express.Router();

router.get('/purchaseOrders/:id', async (req, res) => {
    try {
       const purchaseOrder = await connection.getPurchaseOrders({ pr_id: req.params.id })
        console.log({purchaseOrder})

       return res.json(purchaseOrder);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        res.status(500).json({ error: 'Failed to fetch transactions' });
    }
});

router.get('/purchaseOrders/:code/products', async (req, res) => {
    try {
         const purchaseOrderProducts = await connection.getPurchaseOrderProducts({ po_number: req.params.code })
         return res.json(purchaseOrderProducts);
    } catch (error) {
        console.error('Error fetching purchase order products:', error);
        res.status(500).json({ error: 'Failed to fetch purchase order products' });
    }
});


module.exports = router;