const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require("path");
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

const sampleEmployee = require('./admin/employees.json')

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')
 

const { hashPassword, registerUser,loginUser,hashing, authenticateUser, registerUserCrypto, verifyPasswordCrypto,comparePasswordCrypto } = misc
const {hashPasswordUtils, authenticateUserUtils} = utils

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
  classification: ['Catering Services','Consumables','Food & Accommodation','Freight & Handling','Goods','Infrastructure','Machineries & Equipment','Motor Vehicle','Repair & Maintenance','Services(JO/COS)','Training','Training & Representation', 'Others'],
  banner_program: ['Corn','GASS','HVCDP','Livestock','NUPAP','Organic','Rice','SAAD','STO', 'Others'],
  bac_unit : ['BAC 1', 'BAC 2', 'Others'],
  divisions: ["ADMIN", "AMAD", "FOD", "Field Operations", "ILD", "PMED", "RAED", "REGULATORY", "RESEARCH","Others"]
}

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
app.use('/assets', express.static(viewsAssets))
app.use('/employees', express.static(viewsAssets))
// ============================================
// login
// ============================================
app.use(express.urlencoded({ extended: false }))
app.use(session({
  secret: 'unsamansecret-ani-oi',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }  // Set to `true` in production with HTTPS
}));

app.use(function(req, res, next){
  var err = req.session.error;
  var msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) res.locals.message = '<p class="text-danger">' + err + '</p>';
  if (msg) res.locals.message = '<p class="text-success">' + msg + '</p>';
  next();
});


// let defaultUsers = {
//   justtest: { name: 'justtest' }
// }

// hash({ password: 'asdfg' }, function (err, pass, salt, hash) {

//   if (err) throw err;
//   defaultUsers.justtest.salt = salt;
//   defaultUsers.justtest.hash = hash;
//   defaultUsers.justtest.pass = pass;
  
//   // console.log(defaultUsers.justtest)
// });
// Verify the password

function restrict(req, res, next) {
  if (!req.session.isAuthenticated) {
    // return res.redirect('/login'); // Redirect to login if not authenticated
  }
  return next()
}

// app.route('/')
//   .all(restrict)
//   .get(async (req, res) =>{
//     res.render('index', {
//       logonUser: req.session.user,
//       predata:  _preDefaultData,
//       title: "Dashboard",
//       header: "Some users", 
//       path: res.url
//     });
//   })

app.get('/', restrict, function(req, res){
    res.render('index', {
      logonUser: req.session.user,
      title: "Dashboard",
      header: "Some users", 
      path: res.url
    });
});

app.get('/login', (req, res) => {
  if (req.session.isAuthenticated) {
    return res.redirect(302, '/');
  } else {
    return res.render('pages/login', {
      title: 'Login',
      path: res.url
    })
  }
 
});
// STILL FIXING
app.post('/login', async (req, res, next) => {
  try {
    const {username, password} = req.body
    let userDetails = await connection.retrieveEmployeeByUsername( username )

    console.log(userDetails)

    if(!userDetails) return res.status(404).json({message:'Account Not Found', response:{}})
  
    userDetails = userDetails[0] ? JSON.stringify(userDetails[0]) : JSON.stringify({message: 'Account Not Found'})
    let user = JSON.parse(userDetails)

    if(!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
    // console.log('token', token)

    req.session.user = user
    req.session.isAuthenticated = true
    req.session.token = token


    // console.log('req.session')
    // console.log(req.session)

    res.status(200).redirect('/'); // Only send one response

  } catch (error) {
    console.error(error);
    res.status(200).json({ message: 'Internal server error' });
  }
})

app.post('/login-HUH', async (req, res) => {
  const {username, password} = req.body
  let userDetails = await connection.retrieveEmployeeByUsername( username );
  
  if(!userDetails) return res.status(200).json({message:'Username wala ni exists', response:{}})

    userDetails = JSON.stringify(userDetails[0])
    let user = JSON.parse(userDetails)
    
    let {hash, salt} = JSON.parse(user.password)
    console.log(user)
    console.log('hash', hash)
    console.log('salt', salt)
    console.log('pass', password)

    const asdf = await hashPasswordUtils(password)
    console.log(asdf)
  
  let isxMatch =  verifyPasswordCrypto(password, salt, hash, (err, isCorrect) => {
    if (err) throw err;
    console.log(`Password is correct: ${isCorrect}`);
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

app.get('/register', restrict, function(req, res){
  // res.send(req.params)
  let {username} = req.params
  let {blood_type, civil_status} = _preDefaultData

  res.render('pages/register', {
    title: 'Sign Up',
    path: res.url
    // logonUser: user
  })
})

app.post('/register', async (req, res) => {
  try {
    let data = JSON.stringify(req.body)
    let {set, where} = JSON.parse(data)

    delete set.confirmPassword

    // set.password = await hashPasswordUtils(set.password)
    // set.password = JSON.stringify(set.password)

    set.password = bcrypt.hashSync(set.password, 8);


    data = {set, where}

    console.log(data)
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
  console.log(req.url)
  try {
    const transactions = await connection.getTransactions();
      res.render('pages/transactions', { 
        logonUser: req.session.user,
        title: 'Transactions',
        transactions: transactions, 
        moment: moment,
        connection: connection,
        formatter: formatter,
        path: req.url
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/transactions/new', restrict, async (req, res) => {
  try {
      res.render('pages/transactions-new', { 
        logonUser: req.session.user,
        title: 'Create a new Transactions',
        moment: moment,
        formatter: formatter,
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
    res.status(201).json({ message: 'Transaction created successfully!', response: transactions });
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
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
        logonUser: req.session.user,
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
      res.render('pages/transactions-new', { 
        predata: _preTransactionsData,

        logonUser: req.session.user,
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

app.get('/transactions/:id/remarks', restrict, async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
    const remarks = await connection.getRemarksByRefid(transid)

    // console.log(transactions[0])
    // console.log(remarks)
      res.render('pages/transactions-remarks', { 
        logonUser: req.session.user,
        title: 'Transactions ${} - Remarks',
        transactions: transactions[0],
        remarks: remarks,
        moment: moment,
        path: res.url,
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error deleting transaction:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.delete('/transactions/:id', restrict, async (req, res) => {
  try {
    const transid = req.params.id;

    await connection.updateTransactionsDisplay('employees', transid);
    res.status(204).send(); // No content (successful deletion)
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.get('/remarks/:id', restrict, async (req, res) => {
  try {
    const transid = req.params.id;
    const remarks = await connection.getRemarksByRefid(transid); console.log(remarks)
    const transactions = await connection.getTransactionById(transid)
    const renderedHtml = await ejs.renderFile(path.join(__dirname, 'views', 'partials', 'activity-feed.ejs'), { remarks, moment:moment, transactions, path: req.url});
    res.send(renderedHtml)
  } catch (error) {
    console.error('Error rendering EJS part:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }

})

app.post('/remarks/new', restrict, async (req, res) => {
  try {
    const remarks = await connection.postRemarks( JSON.stringify(req.body) );
    res.status(201).json({ message: 'New remarks is added successfully!', response: remarks });
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/employees', restrict, async (req, res) => {
  const employees = await connection.retrieveEmployee();
  console.log(employees)
  res.render('pages/employees', {
    logonUser: req.session.user,
    defaultData: _preDefaultData,
    sampleEmployee,
    title: 'Employees',
    employees: employees,
    moment: moment,
    path: res.url
  })
})

app.get('/employees/new', restrict, function(req, res){
  res.render('pages/employees-new', {
    logonUser: req.session.user,
    defaultData: _preDefaultData,
    title: 'Add Employee', 
    path: res.url
  })
})

app.get('/employees/register', restrict, function(req, res){
  res.render('pages/employees/register', {
    defaultData: _preDefaultData,
    logonUser: req.session.user,
    title: 'Register Employee',
    path: res.url
  })
})

  app.route('/api/employees')
  .all(restrict)
  .get(async (req, res) =>{
    const employees = await connection.retrieveEmployee();
    if(employees) return  res.status(200).json({response: employees})
    return res.status(400).json({response: 'No Record is Found!'})
  })
  app.get('/forms/forms.html', restrict, function (req, res) {
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