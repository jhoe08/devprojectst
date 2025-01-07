require('dotenv').config();

const http = require('http');
const express = require('express');
// const socketio = require('socket.io');
const { createServer } = require("node:http")
const { Server } = require('socket.io');
const path = require("path");
const fetch = require('node-fetch');
const connection = require("./admin/database");
const misc = require("./admin/misc")
const utils = require("./admin/utils")
const { connect } = require('http2');
const moment = require('moment');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const hash = require('pbkdf2-password')()
const bcrypt = require('bcrypt')
const saltRounds = 10
const cron = require('node-cron');


const _express = require('./admin/express');
const _cronjobs = require('./admin/cron')


const sampleEmployee = require('./admin/employees.json')

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exit } = require('process');
const { count, table } = require('console');
 

const { hashPassword, registerUser,loginUser,hashing, authenticateUser, registerUserCrypto, verifyPasswordCrypto,comparePasswordCrypto } = misc
const {hashPasswordUtils, authenticateUserUtils, peso, isValidJSON, statusText} = utils

const _preDefaultData = {
    blood_type: ['N/A','O+','O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'],
    civil_status: ['Single', 'Married', 'Widowed', 'Separated', 'Other\'s'],
    citizenship: ['Filipino', 'Other\'s'],
    gender: ['N/A', 'Male', 'Female', 'Other\'s'],
    appointments: [
        {
            type: "Permanent",
            description: "A permanent appointment provides job security and stability, typically granted after a competitive selection process. Requires civil service eligibility.",
            benefits: "Includes tenure security, eligibility for promotion, and various benefits and allowances.",
            requirements: "Must have passed civil service examinations or have other required qualifications."
        },
        {
            type: "Temporary",
            description: "Issued for a limited period to address immediate needs or fill in for regular employees who are absent. Does not offer the same level of job security as permanent appointments.",
            benefits: "Limited benefits compared to permanent positions.",
            requirements: "Less stringent than permanent appointments, but must meet basic qualifications and competencies."
        },
        {
            type: "Casual",
            description: "Used for short-term employment to address specific needs or projects. Typically for positions that do not require regular, long-term staffing.",
            benefits: "Minimal benefits and less job security.",
            requirements: "Often does not require civil service eligibility; qualifications may be less stringent."
        },
        {
            type: "Contractual",
            description: "Used for specific projects or time-bound tasks based on a contract that outlines the terms of employment, including duration, duties, and compensation.",
            benefits: "Benefits and security are determined by contract terms, often with limited benefits compared to permanent positions.",
            requirements: "Must fulfill contract terms and may vary depending on the project or task."
        },
        {
            type: "Exempt",
            description: "Positions exempt from certain civil service regulations or examinations due to the specialized nature of the work or the level of the position.",
            benefits: "Varies depending on the position; can include higher compensation but potentially less job security.",
            requirements: "Specific to the position, involving specialized skills or qualifications not covered by standard civil service rules."
        },
        {
            type: "Job Order (JO)",
            description: "Employs individuals on a 'per-job' or 'per-task' basis, often for routine or support functions. Employment is typically short-term or based on specific needs.",
            benefits: "Usually minimal benefits and compensation based on completed jobs or tasks.",
            requirements: "Qualifications are outlined in the job order itself; often does not require civil service eligibility."
        },
        {
            type: "Contract of Service (COS)",
            description: "Engages individuals to perform specific tasks or projects under a defined contract. Often used for specialized, temporary, or project-based roles.",
            benefits: "Compensation and benefits are specified in the contract, typically with fewer benefits compared to permanent positions.",
            requirements: "Specific to the tasks or projects and may not require civil service eligibility."
        }    
    ]
}

const _preTransactionsData = {
  classification: ['', 'Catering Services','Consumables','Food & Accommodation','Freight & Handling','Goods','Infrastructure','Machineries & Equipment','Motor Vehicle','Repair & Maintenance','Services(JO/COS)','Training','Training & Representation', 'Others'],
  banner_program: ['', 'Corn','GASS','HVCDP','Livestock','NUPAP','Organic','Rice','SAAD','STO', 'Others'],
  bac_unit : ['', 'BAC 1', 'BAC 2', 'Others'],
  divisions: ['', "ADMIN", "AMAD", "FOD", "ILD", "PMED", "RAED", "REGULATORY", "RESEARCH","Others"],
  abbrev: [
    {
      "ADMIN": "Administrative and Finance Division",
      "AMAD": "Agribusiness and Marketing Assistance Division",
      "FOD": "Field Operations Division",
      "ILD": "Integrated Laboratory Division",
      "PMED": "Planning, Monitoring and Evaluation Division",
      "RAED": "Regional Agricultural Engineering Division",
      "REG": "Regulartory Division",
      "RES": "Research Division"
    }
  ]
}

const purchaseRequestStatuses = [
  "Draft",               // The PR is being created but not yet submitted.
  "Submitted",           // The PR has been submitted for approval.
  "Under Review",        // The PR is under review by approvers.
  "Approved",            // The PR has been approved and is ready for procurement.
  "Rejected",            // The PR has been rejected by the reviewer or approver.
  "Ordered",             // The items from the PR have been ordered.
  "Received",            // The items requested in the PR have been received.
  "Invoiced",            // The PR has been invoiced and is in payment processing.
  "Paid",                // The PR items have been paid for.
  "Closed",              // The PR has been fully processed and is closed.
  "Canceled",            // The PR was canceled and no further actions are required.
  "Pending",             // The PR is pending and requires further action.
  "Partially Received",  // Some items from the PR are received, others are pending.
  "Backordered"          // The PR items are on backorder and will arrive later.
];

const purchaseRequestRoles = [
  // {
  //   role: "Requester (Initiator)",
  //   description: "The individual or department that identifies the need for a product or service and submits the purchase request."
  // },
  {
    role: "Approver",
    description: "The person who reviews and approves the purchase request before it moves forward in the process."
  },
  {
    role: "Reviewer",
    description: "The person who ensures that the PR is complete and follows organizational policies before it reaches the approver."
  },
  {
    role: "Canvasser",
    description: "The person or team responsible for gathering price quotes from suppliers to compare costs and find the best option."
  },
  {
    role: "Procurement Officer / Buyer",
    description: "The professional responsible for sourcing, negotiating, and issuing a purchase order after the PR is approved."
  },
  {
    role: "Budget Holder / Finance Officer",
    description: "Responsible for ensuring that the purchase is within the organization's budget."
  },
  {
    role: "Finance/Accounts Department",
    description: "Ensures the financial aspects of the purchase, including payment processing and invoice reconciliation."
  },
  {
    role: "Receiving Clerk / Warehouse Manager",
    description: "Confirms that the purchased items are delivered and match the specifications in the PR/PO."
  },
  {
    role: "Legal/Compliance Officer",
    description: "Reviews contracts, terms, and conditions related to the purchase to ensure compliance with laws and policies."
  },
  {
    role: "Supplier / Vendor",
    description: "The external party that provides the goods or services, responds to quotes, and delivers as per the PO."
  },
  {
    role: "Accounts Payable (AP)",
    description: "The department responsible for processing payments to suppliers once goods or services are delivered."
  },
  {
    role: "Internal Audit",
    description: "Internal auditors review the purchase request and procurement process for compliance with company policies and legal regulations."
  }
];

// console.log(purchaseRequestRoles);


let transid = []

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
app.use('/client', express.static(clientPath))
app.use('/assets', express.static(viewsAssets))
app.use('/employees', express.static(viewsAssets))
// ============================================
// login
// ============================================
app.use(express.urlencoded({ extended: true }))
app.use(session({
  secret: 'unsamansecret-ani-oi',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to `true` in production with HTTPS
}));

/////// SERVER
const server = createServer(app);
// const io = socketio(server);
const io = new Server(server)
let connectedUserMap = new Map();
/////// endof SERVER

// CRON JOBS
const {checkDueNotifications, incrementNotification, sendNotification} = _cronjobs(moment, io)
let countNotif = 0
// Define the cron job (this example runs every minute)
const task = cron.schedule('* * * * *', async () => {
  const remarks = await connection.getRemarks()

  console.log('Checking for due tasks...', new Date());
  const duedates = checkDueNotifications(remarks)
}, {
  scheduled: false
}); 
task.start()
// task.stop()
// ENDOFCRONJOBS

app.use(async function(req, res, next){
  // const err = req.session.error;
  // const msg = req.session.success;
  // delete req.session.error;
  // delete req.session.success;
  // res.locals.message = err;
  // if (err) res.locals.message = '<p class="text-danger">' + err + '</p>';
  // if (msg) res.locals.message = '<p class="text-success">' + msg + '</p>';
  // res.status(404).send('Page Not Found');  
  const notifications = await connection.retrieveNotifications()
  
  // Sort using Descending
  notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  res.locals = {
    ENVIRONMENT: process.env.NODE_ENV,
    TEST_MODE: process.env.TEST_MODE,
    TEST_UNIT: process.env.TEST_UNIT,
    SESSION_USER: req.session.user,
    // NOTIFICATIONS: countNotif,
    // NOTIFICATIONS: (req.url === '/login') ? countNotif:JSON.stringify(notifications)
    NOTIFICATIONS: JSON.stringify(notifications),
    logonUser: JSON.stringify(req.session.user),
    perClassification: {},
    employees: {},
    dafaultTransactionData: _preTransactionsData,
    defaultData: _preDefaultData,
    purchaseRequestStatuses,
    purchaseRequestRoles,
    path: req.url,
    path2: req.path,
    isHome: req.originalUrl,
    moment,
    statusText,
  }
  // console.log('locals', res.locals.isHome)
  // console.log(req.socket.remoteAddress )
  // console.log(res.status(404))
  // res.status(404).render('pages/404', {
  //   title: 'Page not Found',
  //   component: 'Page'
  // });
  next();
});

function restrict(req, res, next) {
  // Check if the user is authenticated
  // console.log('res.locals.environment', res.locals.ENVIRONMENT)
  if (!req.session.isAuthenticated) {
    // Redirect to login page if not authenticated
    return (res.locals.ENVIRONMENT === 'production') ? res.redirect('/login') : next() ; // Perform the redirect
  }
  
  // If authenticated, proceed to the next middleware
  return next();
}

app.get('/', restrict, async function(req, res){
  const getTotalApprovedBudget = await connection.getTotalApprovedBudget()
  const getPerPRClassification = await connection.countPerPRClassification()
  const getCardsData = await connection.cardsData()
  const getDataFromLast7Days = await connection.getDataFromLast7Days('remarks', 'date')

  const result = getCardsData.reduce((acc, { table_name, row_count, total_sum }) => {
    acc[table_name] = { row_count, total_sum };
    return acc;
  }, {});
  const perPRClassification = getPerPRClassification.reduce((acc, { pr_classification, item_count }) => {
    acc[pr_classification] = item_count;
    return acc;
  }, {});
  
  res.render('pages/index', {
    title: "Dashboard",
    header: "Some users", 
    path: res.url,
    moment,
    peso,
    totalApprovedBudget: JSON.stringify(getTotalApprovedBudget[0]),
    perClassification: JSON.stringify(perPRClassification),
    tableDashboard: JSON.stringify(getDataFromLast7Days),
    cardsData: result,
  });
});

app.get('/template', async function(req, res) {
  let renderedHtml = await ejs.renderFile(path.join(__dirname, 'views', 'page.ejs'), 
  { 
    title: "Template 2", 
    ENVIRONMENT:res.locals.ENVIRONMENT, 
    TEST_MODE: res.locals.TEST_MODE, 
    NOTIFICATIONS: JSON.stringify({}),
    perClassification:{}, 
    path: req.path,
    path2: req.path, 
    innerContent: '../pages/employees/index2',
    employees: []
  });
  // Rendered HTML
  res.send(renderedHtml)
})

app.get('/template2', async function(req, res) {
  let renderedHtml = await ejs.renderFile(path.join(__dirname, 'components', 'charts', 'pie.ejs'), { });
  renderedHtml += await ejs.renderFile(path.join(__dirname, 'components', 'notifications', 'index.ejs'), 
  { message: "HAHAHHA"  });
  res.send(renderedHtml)
})

// Endpoint to get the countNotif value
app.get('/api/notifications', async (req, res) => {
  const notifications = await connection.retrieveNotifications()
  res.json({ notifications, counts: notifications.length });
});

app.get('/404', (req, res) => {
  res.status(404).render('pages/404');
});

app.get('/login', (req, res) => {
  const error = req.session.error
  
  req.session.error = null

  if (req.session.isAuthenticated) {
    return res.redirect(302, '/');
  } else {
    return res.render('pages/login', {
      title: 'Login',
      path: res.url,
      emitMessage: error,
    })
  }
 
});
// STILL FIXING
app.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body
    if (!username || !password) return res.status(400).json({ message: 'Username and password are required.' });

    let userDetails = await connection.retrieveEmployeeByUsername( username )
    
    if(userDetails.length !== 0) {
      userDetails = userDetails[0] ? JSON.stringify(userDetails[0]) : JSON.stringify({ message: 'Account Not Found' })
      let user = JSON.parse(userDetails)
  
      if(!bcrypt.compareSync(password, user.password)) {
        req.session.error = 401; // Incorrect password
        res.status(404).redirect('/login')
        return next()
      }
      const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
  
      req.session.user = user
      req.session.isAuthenticated = true
      req.session.token = token
  
      res.status(200).redirect('/'); // Only send one response  
    } else {
      req.session.error = 404; // Account Not Found
      res.status(404).redirect('/login')
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }

  next()
})

app.post('/login-HUH', async (req, res) => {
  const {username, password} = req.body
  let userDetails = await connection.retrieveEmployeeByUsername( username );
  
  if(!userDetails) return res.status(200).json({message:'Username wala ni exists', response:{}})

    userDetails = JSON.stringify(userDetails[0])
    let user = JSON.parse(userDetails)
    
    let {hash, salt} = JSON.parse(user.password)
    // console.log(user)
    // console.log('hash', hash)
    // console.log('salt', salt)
    // console.log('pass', password)

    const asdf = await hashPasswordUtils(password)
    // console.log(asdf)
  
  let isxMatch =  verifyPasswordCrypto(password, salt, hash, (err, isCorrect) => {
    if (err) throw err;
    // console.log(`Password is correct: ${isCorrect}`);
    return isCorrect ? res.redirect('/') : res.redirect('/login')
  })

  return userDetails

})

app.post('/verify', async (req, res) => {
  try {
    // Convert request body into JSON
    let data = JSON.stringify(req.body)
    // Retrieve data accessing the database
    // console.log(data)
    const employees = await connection.retrieveEmployee( data );
    // console.log(employees)
    if (employees.length != 0) {
      res.status(200).json({ message: 'Account found!',  response: employees });
    } else {
      res.status(200).json({ message: 'Account not found!',  response: employees });
    }
    
  } catch (error) {
    console.error('Unable to load data', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/register', function(req, res){
  // res.send(req.params)
  let {username} = req.params
  let {blood_type, civil_status} = _preDefaultData

  res.render('pages/register', {
    title: 'Sign Up',
    path: res.url
    // logonUser: user
  })
})

app.post('/register', async (req, res, next) => {
  try {
    let data = JSON.stringify(req.body)
    let {set, where} = JSON.parse(data)

    delete set.confirmPassword

    // set.password = await hashPasswordUtils(set.password)
    // set.password = JSON.stringify(set.password)

    set.password = bcrypt.hashSync(set.password, 8);


    data = {set, where}

    // console.log(data)
    const register = await connection.amendEmployee(JSON.stringify(data));

    if(register.length != 0) {
      res.status(200).json({ message: 'Account is successfully register', response: register})
    } else {
      res.status(200).json({ message: 'Failed to register the account',  response: register });
    }
    next()
  } catch (error) {
    console.error('There\'s issue on the REGISTRATION right now:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.post('/register/new', async (req, res) => {
  try {
    let data = JSON.stringify(req.body)
    const register = await connection.postEmployees(data)
    if(register.length != 0) {
      if(register?.affectedRows){
        const {employeeid} = JSON.parse(data)
        const notif = {
          "message": "New user was registered",
          "link": employeeid, 
          "component": "employees",
          // "created_at": convertDate(new Date())
        }
        await connection.postNotifications(JSON.stringify(notif))
      }
      res.status(200).json({ message: 'Account is successfully register', response: register})
    } else {
      res.status(200).json({ message: 'Failed to register the account',  response: register });
    }
  } catch (error) {
    console.error('There\'s issue on the system right now:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/login');
  });
});

app.get('/transactions', restrict, async (req, res) => {
  try {
    const transactions = await connection.retrieveTransactions();
    const discardedTransaction = await connection.getListOfDiscarded('transactions');
    const {data} = discardedTransaction[0]
    const discardedTransactionIds = data
    // Filter out the discarded transactions from the original transactions
    const filteredTransactions = transactions.filter(transaction => !discardedTransactionIds.includes(transaction.product_id)); // Adjust this if your transaction object has a different identifier
    // console.log(filteredTransactions)

    res.render('pages/transactions/index', { 
      title: 'Transactions',
      transactions: filteredTransactions, 
      moment: moment,
      connection: connection,
      predata: _preTransactionsData,
      path: req.url,
      peso
    }); // Pass the data to the template
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/new', restrict, async (req, res) => {
  try {
      res.render('pages/transactions/new', { 
        title: 'Create a new Transactions',
        moment: moment,
        // formatter: formatter,
        predata: _preTransactionsData,
        path: req.url, 
        transactions: null,
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/scan', restrict, async (req, res) => {
  try {
      res.render('pages/transactions/scan', { 
        title: 'Scan Transaction QRCode',
        moment: moment,
        // formatter: formatter,
        predata: _preTransactionsData,
        path: req.url, 
        transactions: null,
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.post('/transactions/new', restrict, async (req, res) => {
  try {
    const transactions = await connection.postTransactions( JSON.stringify(req.body) );
    if(transactions?.affectedRows){
      const {insertId} = transactions
      const data = {
        "message": "New transaction was created",
        "link": insertId, 
        "component": "transactions",
        // "created_at": convertDate(new Date())
      }
      const nofitifications = await connection.postNotifications(JSON.stringify(data))
    }
    // console.log('transactions', transactions)
    res.status(201).json({ message: 'Transaction created successfully!', response: transactions });
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.put('/transactions/update', restrict, async (req, res) => {
  try {
    const transactions = await connection.putTransactions( JSON.stringify(req.body) );
    res.status(201).json({ message: 'Transaction created successfully!', response: transactions });
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.put('/employees/update', restrict, async (req, res) => {
  try{
    const employee = await connection.amendEmployee(JSON.stringify(req.body))
    if(employee.length != 0) {
      res.status(200).json({ message: 'Successfully updated the Employee', response: employee})
    } else {
      res.status(200).json({ message: 'Failed to update the employee',  response: employee });
    }
  } catch (error) {
    res.status(500).send({ response: error })
  }
})

app.put('/transactions/:id', restrict, async (req, res) => {
  try {
   
  } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/:id', restrict, async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
      res.render('pages/transactions', { 
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

app.get('/transactions/:id/edit', restrict, async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
      res.render('pages/transactions/new', { 
        predata: _preTransactionsData,

        title: 'Transactions',
        transactions: transactions[0], 
        moment: moment,
        path: res.url
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/:id/view', restrict, async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
    const remarks = await connection.getRemarksByRefid(transid)
        
    if(transactions[0]) {
      res.render('pages/transactions/remarks', { 
        title: 'Transactions: Remarks',
        transactions: transactions[0],
        remarks: remarks,
        moment: moment,
        path: res.url,
        peso, isValidJSON
      }); // Pass the data to the template

      console.log('req.session.user', req.session.user)
    } else {
      res.render('pages/404', {
        title: '404 Transaction Not Found',
        referer: req.referer,
        component: 'Transaction'
      });
    }
  } catch (error) {
      console.error('Error deleting transaction:', error);
      // res.status(500).send('Internal Server Error');
      res.status(404).render('pages/404');
  }
})

app.get('/transactions/:id/print', restrict, async (req, res) => {
  try {
    const transid = req.params.id;
    const transactions = await connection.getTransactionById(transid);
    const remarks = await connection.getRemarksByRefid(transid)
    if (transactions[0]) {
      res.render('pages/transactions/print', { 
        title: "Print Tracking Sheet",
        transactions: transactions[0],
        perClassification: {},
        remarks: remarks,
        moment,
        path: req.url,
        peso, isValidJSON
      }); //
      // console.log(transactions[0])
    }
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(404).render('pages/404');
  }
})

app.delete('/transactions/:id', restrict, async (req, res) => {
  try {
    const transid = req.params.id;

    let lists = await connection.hideToDisplay('transactions', transid);
    // console.log('lists', lists)
    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/remarks/:id', restrict, async (req, res) => {
  try {
    const transid = req.params.id;
    const remarks = await connection.getRemarksByRefid(transid);
    const transactions = await connection.getTransactionById(transid)
    const renderedHtml = await ejs.renderFile(path.join(__dirname, 'views', 'partials', 'activity-feed.ejs'), { remarks, moment, transactions, path: req.url});
    res.send(renderedHtml)
  } catch (error) {
    console.error('Error rendering EJS part:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

app.post('/remarks/new', restrict, async (req, res) => {
  try {
    const data = JSON.parse(JSON.stringify(req.body))
    let currentUser = req.session.user

    if(res.locals.ENVIRONMENT === 'development' && currentUser === undefined) currentUser = { username: 'justtest' };
    const updatedRemarks = { ...data, user: currentUser.username };

    console.log(updatedRemarks)
    const remarks = await connection.postRemarks( JSON.stringify(updatedRemarks) );
    if(remarks?.affectedRows){
      const {refid, comment, status} = updatedRemarks
      const data = {
        "message": `New remark is added #${refid}!`,
        "link": refid, 
        "component": "remarks",
        // "created_at": convertDate(new Date())
      }
      await connection.postNotifications(JSON.stringify(data))
    }
    res.status(201).json({ message: 'New remarks is added successfully!', response: remarks });
  } catch (error) {
    console.error('Error addding new remarks on transaction:', error);
    res.status(500).send('Error addding new remarks on transaction:', error);
  }
})

app.post('/notifications/new', restrict, async (req, res) => {
  try {
    const data = JSON.stringify(req.body)
    const results = await connection.postNotifications(data)
    res.status(201).json({ message: 'New notification is added successfully', response: results})
  } catch (error) {
    console.error('Error addding new notification on transaction:', error);
    res.status(500).send('Error addding notification on transaction:', error);
  }
})

app.post('/transcodes/new', restrict, async (req, res) => {
  try {
    const codes = await connection.updateTransactionCodes( JSON.stringify(req.body) );
    res.status(201).json({ message: 'Successfully added transaction codes!', response: codes });
  } catch (error) {
    console.error('Error addding transaction codes:', error);
    res.status(500).send('Error addding transaction codes:', error);
  }
})
app.get('/employees', restrict, async (req, res) => {
  const employees = await connection.retrieveEmployee();
  // console.log(employees)
  res.render('pages/employees/index', {
    defaultData: _preDefaultData,
    dafaultTransactionData: _preTransactionsData,
    sampleEmployee,
    title: 'Employees',
    employees: employees,
    moment,
    peso,
    path: res.url,
  })
})

app.get('/employees/new', restrict, function(req, res){
  res.render('pages/employees/new', {
    defaultData: _preDefaultData,
    title: 'Add Employee', 
    path: res.url,
    moment
  })
})

app.get('/employees/:id', restrict, async function(req, res){
  try {
    if(req.params.id == 'register') {
      res.render('pages/employees/register', {
        defaultData: _preDefaultData,
        title: 'Register Employee',
        path: res.url,
        moment,
      })
    } else {
      const employee = await connection.getEmployeeById(req.params.id);
      if(employee.length > 0) {
        res.render('pages/employees/profile', {
          employee: employee[0],
          moment,
          title: 'Profile', 
          path: res.url
        })
      } else {
        console.error('Employee not found!');
        res.render('pages/404', {
          title: '404 Employee Not Found',
          referer: req.referer,
          component: 'Employee'
        });
      }
    }    
  } catch (error) {
      console.error('Error retrieving employee:', error);
      res.status(500).render('pages/404');
  }
  
})

app.get('/employees/register', restrict, function(req, res){
  res.render('pages/employees/register', {
    defaultData: _preDefaultData,
    title: 'Register Employee',
    path: res.url
  })
})

app.get('/employees/:id/update', restrict, async function(req, res){
  const employeeid = req.params.id;
  const employee = await connection.getEmployeeById(employeeid)
  res.render('pages/employees/register', {
    defaultData: _preDefaultData,
    employees: employee[0], 
    title: 'Update Employee',
    path: res.url,
    moment,
  })
})

app.delete('/employees/:id', restrict, async (req, res) => {
  try {
    // const transid = req.params.id;
    // const force = req.params.force

    const {id} = req.params

    // let lists = await connection.hideToDisplay('employees', transid);
    console.log({id, force})
    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/inventory', restrict, async function(req, res){
  res.render('pages/inventory/', {
    title: "Inventory"
  })
})

app.get('/documents', restrict, async function(req, res){
  
  res.render('pages/documents/index', {
    title: 'Documents',
  })
})


// APIs
app.route('/api/employees')
  .all(restrict)
  .get(async (req, res) =>{
    const employees = await connection.retrieveEmployee();
    if(employees) return  res.status(200).json({response: employees})
    return res.status(400).json({response: 'No Record is Found!'})
  })
app.route('/api/transactions')
  .all(restrict)
  .get(async (req, res) =>{
    const transactions = await connection.retrieveTransactions();
    if(transactions) return  res.status(200).json({response: transactions})
    return res.status(400).json({response: 'No Record is Found!'})
  })
app.route('/api/transactions/:id')
  .all(restrict)
  .get(async (req, res) => {
    const { id } = req.params;
    if (!Number(id)) {
      return res.status(400).json({ response: 'Invalid ID format' });
    }

    const employee = await connection.getTransactionById(id);
    if (employee) {
      return res.status(200).json({ response: employee });
    }
    return res.status(404).json({ response: 'Employee Not Found!' });
  });

app.get('/settings', restrict, async function(req, res){
  res.render('pages/settings', {
    title: "Setting"
  })
})

// DEMO
app.get('/forms/forms.html', restrict, function (req, res) {
  res.redirect('/demo/forms/forms.html');
});
app.get('/request', function(req, res){
  res.render('pages/request',{
    title: "Request",
    path: res.path,
  })
})

app.use(async function(req, res, next){
  res.status(404).render('pages/404', {
    title: 'Page not Found',
    component: 'Page'
  });
  next()
})

// STARTING ON ExpressJS
// const server = http.createServer(app, (req, res) => {
//   // Get the protocol (http or https)
//   const protocol = req.connection.encrypted ? 'https://' : 'http://';
    
//   // Get the host (hostname and port)
//   const host = req.headers.host;
  
//   // Get the request URL
//   const url = req.url;

//   // Construct the full URL
//   const fullUrl = `${protocol}${host}${url}`;

//   // Send the full URL as a response
//   res.writeHead(200, { 'Content-Type': 'text/plain' });
//   res.end(`Full URL: ${fullUrl}\n`);
//   console.log(fullUrl)
// });


const { expressConnect } = _express(io, moment)
expressConnect()

// io.on('connection', (socket)=>{
//   console.log('a user connected', socket.id)
// })

// ENDOF ExpressJS
server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(SERVER_PORT, '0.0.0.0', () => {
  console.log('Server started on', SERVER_PORT);
});