require('dotenv').config();

const express = require('express');
const session = require('express-session');
const flash = require('connect-flash');
const https = require('https');
const MySQLStore = require('express-mysql-session')(session);

const connection = require('../admin/database_backup');
const { route } = require('./root');

const router = express.Router();

const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});

router.use(session({
  key: 'session_cookie_name',
  secret: 'your_secret_key',
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to `true` in production with HTTPS
}));
router.use(flash());

router.get('/checkPayments/:id', async (req, res) => {
    try {
        const disbursementVouchers = await connection.getDisbursementVouchers({ dv_number: req.params.id })
        req.flash('info', 'Drafted disbursement voucher successfully!');
        return res.json(disbursementVouchers);
    } catch (error) {
        console.error('Error fetching transactions:', error);
        req.flash('error', 'Failed to fetch disbursement voucher.');
        res.status(500).json({ error: 'Failed to fetch disbursement voucher' });
    }
});


module.exports = router;