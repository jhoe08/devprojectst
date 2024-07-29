const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const path = require("path");
const connection = require("./admin/database");
const misc = require("./admin/misc")
const { connect } = require('http2');
const moment = require('moment');
const bodyParser = require('body-parser');
const ejs = require('ejs')
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const hash = require('pbkdf2-password')()

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
  secret: 'ayti an angbu',
  resave: false,
  saveUninitialized: false
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


let defaultUsers = {
  tj: { name: 'tj' }
}

hash({ password: 'asdfg' }, function (err, pass, salt, hash) {

  if (err) throw err;
  // store the salt & hash in the "db"
  defaultUsers.tj.salt = salt;
  defaultUsers.tj.hash = hash;
});


let user = {
  firstName: 'Just',
  lastName: 'Joe',
  fullname: 'Just Joe',
  email: 'justjoe@gmail.com',
  type: 8,
}


function authenticate(name, pass, fn) {
  if (!module) console.log('authenticating %s:%s', name, pass);
  var user = defaultUsers[name];
  // query the db for the given username
  if (!user) return fn(null, null)
  // apply the same algorithm to the POSTed password, applying
  // the hash against the pass / salt, if there is a match we
  // found the user
  hash({ password: pass, salt: user.salt }, function (err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user)
    fn(null, null)
  });
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied!';
    res.redirect('/login');
  }
}

app.get('/', restrict, function(req, res){
  
    res.render('index', {
      logonUser: user,
      title: "Dashboard",
      header: "Some users", 
      path: res.url
    });
  
});

app.get('/login', (req, res) => {
  res.render('pages/login', {
    title: 'Login'
  })
});

// app.post('/login', passport.authenticate('local', {
//   successRedirect: '/ambot',
//   failureRedirect: '/login',
//   failureFlash: false
// }) );

app.post('/login', (req, res) => {
  authenticate(req.body.username, req.body.password, function(err, user){
    if (err) return next(err)
    if (user) {
      // Regenerate session when signing in
      // to prevent fixation
      req.session.regenerate(function(){
        // Store the user's primary key
        // in the session store to be retrieved,
        // or in this case the entire user object
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('/');
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.';
      res.redirect('/login');
    }
  });
})

app.get('/logout', function(req, res){
  // destroy the user's session to log them out
  // will be re-created next request
  req.session.destroy(function(){
    res.redirect('/');
  });
});

app.get('/transactions', restrict, async (req, res) => {
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
        path: req.url
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
        path: req.url, 
        transactions: null,
      }); // Pass the data to the template
  } catch (error) {
      console.error('Error fetching products:', error);
      res.status(500).send('Internal Server Error');
  }
})

app.post('/transactions/new', async (req, res) => {
  try {
    const transactions = await connection.postTransactions( JSON.stringify(req.body) );
    res.status(201).json({ message: 'Transaction created successfully!', response: transactions });
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})



app.put('/transactions/:id', async (req, res) => {
  try {
   
  } catch (error) {
      console.error('Error deleting transaction:', error);
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

app.get('/transactions/:id/update', async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
      res.render('pages/transactions-new', { 
        predata: _preTransactionsData,

        logonUser: user,
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

app.get('/transactions/:id/remarks', async (req, res) => {
  try {
    const transid = req.params.id;

    const transactions = await connection.getTransactionById(transid);
    const remarks = await connection.getRemarksByRefid(transid)

    // console.log(transactions[0])
    // console.log(remarks)
      res.render('pages/transactions-remarks', { 
        logonUser: user,
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

app.get('/remarks/:id', async (req, res) => {
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

app.post('/remarks/new', async (req, res) => {
  try {
    const remarks = await connection.postRemarks( JSON.stringify(req.body) );
    res.status(201).json({ message: 'New remarks is added successfully!', response: remarks });
  } catch (error) {
    console.error('Error addding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/employees', async (req, res) => {
  const employees = await connection.retrieveData('employees');

  res.render('pages/employees', {
    logonUser: user,
    title: 'Employees',
    employees: employees,
    moment: moment
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

// Passport configuration
// passport.use(new LocalStrategy( function (username, password, done) {
//   console.log('Attempting to authenticate user:', username);

//   const user = defaultUsers.find(user => user.username === username);
//   // if (!user) {
//   //   return done(null, false, { message: 'Incorrect username.' });
//   // }
//   // if (user.password !== password) {
//   //   return done(null, false, { message: 'Incorrect password.' });
//   // }
//   // return done(null, user);

//   crypto.pbkdf2(password, user.salt, 310000, 32, 'sha256', function(err, hashedPassword) {
//     if (err) { return cb(err); }
//     if (!crypto.timingSafeEqual(user.hashed_password, hashedPassword)) {
//       return done(null, false, { message: 'Incorrect username or password.' });
//     }
//     return done(null, user);
//   });
// }
// ));

// passport.serializeUser((user, done) => {
//   done(null, user.id);
// });

// passport.deserializeUser((id, done) => {
//   const user = defaultUsers.find(user => user.id === id);
//   done(null, user);
// });
// ============================================
// endof login
// ============================================

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