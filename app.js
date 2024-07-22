// import { firebase } from 'firebase';

const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require("path");
const connection = require("./admin/database");
const misc = require("./admin/misc")
const { connect } = require('http2');
const moment = require('moment');
const bodyParser = require('body-parser');


// const { log } = require('console');
// const firebase = require('firebase');

// const preDefaultData = require('./assets/js/const');

const locale = 'en';
const options = {style: 'currency', currency: 'php', minimumFractionDigits: 2, maximumFractionDigits: 2};
let formatter = new Intl.NumberFormat(locale, options);
// How to use
// var amount = 5000.25;
// console.log(formatter.format(amount));

const _preDefaultData = {
    blood_type: ['N/A','O+','O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    civil_status: ['Single', 'Married', 'Widowed', 'Separated', 'Other\'s'],
    citizenship: ['Filipino', 'Other\'s'],
    gender: ['N/A', 'Male', 'Female', 'Other\'s']
}

const _preTransactionsData = {
  classification: ['Catering Services','Consumables','Food & Accommodation','Freight & Handling','Goods','Infrastructure','Machineries & Equipment','Motor Vehicle','Repair & Maintenance','Services(JO/COS)','Training','Training & Representation', 'Others'],
  banner_program: ['Corn','GASS','HVCDP','Livestock','NUPAP','Organic','Rice','SAAD','STO', 'Others'],
  bac_unit : ['BAC 1', 'BAC 2', 'Others'],
  

}

// const _express = require('./server/express');

// let transactions = db.getConnection(
//   'SELECT * FROM transid WHERE product_id=17102'
// );

// pool.getConnection()
//   .then(conn => {
//     const res = conn.query('SELECT * FROM transid');
//     conn.release();
//     return res;
//   }).then(results => {
//     console.log('Connected to MySQL DB');
//     // console.log(results)
//     return results;
//   }).catch(err => {
//     console.log(err); 
//   });

// console.log(JSON.stringify(transactions))


// let dataListsTrans = pool.query('SELECT 1 + 1 AS solution', function (error, results, fields) {
//   if (error) throw error;
//   console.log('The solution is: ', results[0].solution);
// });

// console.log(dataListsTrans)

// let transactions = db.query('SELECT * FROM transid WHERE product_id=17195');
// transactions = JSON.stringify(transactions)

// console.log(transactions)

let transid = []

// let yawa = connection.query('SELECT * FROM transid WHERE product_id=17102', function (error, results, fields) {
//       if (error) throw error;
//       // console.log('The solution is: ', JSON.stringify(results[0]));
//       transid = results[0]
//       return JSON.stringify(results[0])
//     });

// let yawa = connection.query('SELECT * FROM transid WHERE product_id=17102', (error, results, fields) => {
//   if (error) throw error;
//       // console.log('The solution is: ', JSON.stringify(results[0]));
//       transid = JSON.stringify(results[0])

//       console.log(transid)

//       return transid 
// })

// console.log(yawa._results)
  // let yawa = connection.query('SELECT * FROM transid WHERE product_id=17102');

const app = express();
const router = express.Router();

const clientPath = `${__dirname}/client/`;
const modulesPath = `${__dirname}/node_modules/`;
const csvPath = `${__dirname}/pages/`;
const adminPath = `${__dirname}/demo/`;
const viewsAssets = `${__dirname}/assets/`;

// const transPath = `${__dirname}/pages/transactions.ejs`;

const SERVER_PORT = 4000;



// router.get('/', function(req, res, next) {
//   res.end()
// })

app.set("view engine", "ejs")
app.set("views", path.join(__dirname), "views")

app.use('/', require('./routes/root'))
app.use(bodyParser.json());


//pages
app.use('/pages', express.static(csvPath))
app.use('/salary', express.static(clientPath));
app.use('/demo', express.static(adminPath))
//paths
app.use('/modules', express.static(modulesPath))
app.use('/assets', express.static(viewsAssets))
app.use('/employees', express.static(viewsAssets))
// app.use('/employees', express.static(path.join(__dirname, '/assets')))
// Dummy users
// let logonUsers = [
//   { name: 'tobi', email: 'tobi@learnboost.com' },
//   { name: 'loki', email: 'loki@learnboost.com' },
//   { name: 'jane', email: 'jane@learnboost.com' }
// ];
let user = {
  firstName: 'Just',
  lastName: 'Joe',
  fullname: 'Just Joe',
  email: 'justjoe@gmail.com',
  type: 8,
}

// console.log(transid)

// app.get("/", (req, res) => {
//   res.render('index', { title: 'Hey', message: 'Hello there!' })
// });
// app.all('*', function(req, res){
//   console.log('wildcard')
// })
app.get('/', function(req, res){
  res.render('index', {
    // users: users,
    logonUser: user,
    title: "Dashboard",
    header: "Some users", 
    path: res.url
  });
});

app.get('/transactions', async (req, res) => {
  console.log(req.url)
  try {
    const transactions = await connection.getTransactions();
      res.render('pages/transactions', { 
        logonUser: user,
        title: 'Transactions',
        transactions: transactions, 
        moment: moment,
        connection: connection,
        formatter: formatter,
        path: '/transactions'
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/new', async (req, res) => {
  try {
      res.render('pages/transactions-new', { 
        logonUser: user,
        title: 'Create a new Transactions',
        moment: moment,
        formatter: formatter,
        predata: _preTransactionsData,
        path: '/transactions/new'
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.post('/transactions/new', async (req, res) => {
  try {

    const transactions = await connection.postTransactions( JSON.stringify(req.body) );

    res.status(201).json({ message: 'Transaction created successfully', data: JSON.stringify(transactions) });
      
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/:id', async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
      res.render('pages/transactions', { 
        logonUser: user,
        title: 'Transactions',
        transactions: transactions, 
        moment: moment,
        path: res.url
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/:id/remarks', async (req, res) => {
  try {
    const transid = req.params.id;
    const { qrcode } = misc

    const transactions = await connection.getTransactionById(transid);

    console.log(transactions[0])
      res.render('pages/transactions-remarks', { 
        logonUser: user,
        title: 'Transactions ${} - Remarks',
        transactions: transactions[0], 
        moment: moment,
        path: res.url,
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.delete('/transactions/:id', async (req, res) => {
  try {
    const transid = req.params.id;

    await connection.updateTransactionsDisplay('employees', transid);
    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/employees', function(req, res){
  res.render('pages/employees', {
    logonUser: user,
    title: 'Employees'
  })
})

app.get('/employees/new', function(req, res){
  // res.send(req.params)
  let {path} = req.params
  let {blood_type, civil_status} = _preDefaultData

  res.render('pages/employees-new', {
    logonUser: user,
    defaultData: _preDefaultData,
    title: 'Add Employee'
  })
})

app.get('/forms/forms.html', function (req, res) {
  res.redirect('/demo/forms/forms.html');
});


const server = http.createServer(app);
const io = socketio(server);

// let { connection } = _express(io)

// connection()


server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(SERVER_PORT, () => {
  console.log('Server started on', SERVER_PORT);
});