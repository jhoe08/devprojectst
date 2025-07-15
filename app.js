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
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');



const _express = require('./admin/express');
const _cronjobs = require('./admin/cron')


const sampleEmployee = require('./admin/employees.json')

const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { exit } = require('process');
const { count, table } = require('console');
const { permission } = require('node:process');
 

const { hashPassword, registerUser,loginUser,hashing, authenticateUser, registerUserCrypto, verifyPasswordCrypto,comparePasswordCrypto } = misc
const {hashPasswordUtils, authenticateUserUtils, peso, isValidJSON, statusText, addLeadingZeros, findDivisionBySection, toCapitalize, isActive} = utils

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
  divisions: ['', "ADMIN", "AMAD", "FOD", "ILD", "ICT", "PMED", "RAED", "REGULATORY", "RESEARCH","Others"],
  abbrev: [
    {
      "ADMIN": "Administrative and Finance Division",
      "AMAD": "Agribusiness and Marketing Assistance Division",
      "FOD": "Field Operations Division",
      "ILD": "Integrated Laboratory Division",
      "ICT": "Information and Communications Technology",
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
  {
    role: "Reciever",
    description: "The individual or department that identifies as someone to recieve the purchase request."
  },
  {
    role: "Requester (Initiator)",
    description: "The individual or department that identifies the need for a product or service and submits the purchase request."
  },
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

// =========================
// Permissions Configuration
// =========================
const permissions = {
  can: ["create", "read", "update", "delete"],
  roles: [
    {
      role: "Admin",
      permissions: { create: true, read: true, update: true, delete: true }
    },
    {
      role: "Editor",
      permissions: { create: true, read: true, update: true, delete: false }
    },
    {
      role: "Viewer",
      permissions: { create: false, read: true, update: false, delete: false }
    },
    {
      role: "Contributor",
      permissions: { create: true, read: true, update: false, delete: false }
    },
    {
      role: "Moderator",
      permissions: { create: false, read: true, update: true, delete: true }
    },
    {
      role: "Manager",
      permissions: { create: false, read: true, update: true, delete: true }
    },
    {
      role: "Support",
      permissions: { create: false, read: true, update: true, delete: false }
    }
  ]
};


const department = {
  directors: {
    ORED: {
      stands: "Office of the Regional Executive Director",
      email: "",
      admin: "",
      responsible: { employeeid: "107", name: "Dir. Angel C. Enriquez, CESO III" },
      acting: "",
    },
    RTDs: {
      RTDRR: {
        stands: "Regional Technical Director for Research and Regulations ",
        email: "",
        admin: "",
        responsible: { employeeid: "108", name: "Wilberto O. Castillo" },
        acting: "",
      }, 
      RTDO: {
        stands: "Regional Technical Director for Operations",
        email: "",
        admin: "",
        responsible: { employeeid: "109", name: "Engr. Cirilo N. Namoc" },
        acting: "",
      }
    }, 
    BACs: {
      "BAC_1": {
          stands: "BAC Secretariat 1",
          email: "",
          admin: "",
      },
      "BAC_2": {
          stands: "BAC Secretariat 2",
          email: "",
          admin: "",
      }
    }
  },
  divisions: {
    "ADMIN": {
      stands: "Administrative and Finance Division",
      email: "",
      admin: "",
      responsible: { employeeid: "110", name: "Melquiades B. Ibarra, Ph.D" },
      acting: "",
      sections: {
        HRMS: {
          stands: "Human Resource Management Section",
          email: "",
          admin: "",
          responsible: { employeeid: "111", name: "Maria Isabel A. Martinez" },
          acting: "",
        },
        GS: {
          stands: "General Services Section",
          email: "",
          admin: "",
          responsible: { employeeid: "112", name: "Anecita A. Sespeñe" },
          acting: "",
        },
        PROCUREMENT: {
          stands: "Procurement Section",
          email: "",
          admin: "",
          responsible: "",
          acting: "",
        },
        ACCOUNTING: {
          stands: "Accounting Section",
          email: "",
          admin: "",
          responsible: { employeeid: "113", name: "Mark Rey T. Paguray" },
          acting: "",
        },
        INFORMATION: {
          stands: "Information Section",
          email: "",
          admin: "",
          responsible: { employeeid: "114", name: "Cheryl M. Dela Victoria" },
          acting: "",
        },
        BUDGET: {
          stands: "Budget Section",
          email: "",
          admin: "",
          responsible: { employeeid: "115", name: "Rosalie S. Gallego" },
          acting: "",
        }
      }
    },
    "ICTD": {
      stands: "Information and Communications Technology Division",
      email: "",
      admin: "",
      responsible: { employeeid: "116", name: "Annearth V. Maribojoc" },
      acting: "",
      sections: {
        IPPTS: {
          stands: "ICT Planning, Policy, and Training Section",
          email: "",
          admin: "",
        },
        GEOSEC: {
          stands: "Geoinformatics Section",
          email: "",
          admin: "",
        },
        NMTSS: {
          stands: "Network Management and Technical Support Section",
          email: "lemoref@gmail.com",
          admin: "",
          responsible: { employeeid: "117", name: "Feromel Magalso" },
          acting: { employeeid: "118", name: "Ian Roy Butron" },
        },
        DPCS: {
          stands: "Data Privacy and Cybersecurity Section",
          email: "",
          admin: "",
        },
        SDS: {
          stands: "Systems Development Section",
          email: "red.mrjhon8@gmail.com",
          admin: "",
          responsible: { employeeid: "119", name: "Wrongrammer" },
          acting: "",
        },
        DMS: {
          stands: "Database Management Section",
          email: "",
          admin: "",
          acting: "",
        }
      }
    },
    "PMED": {
      stands: "Planning, Monitoring and Evaluation Division",
      "email": "",
      "admin": "",
      responsible: { employeeid: "120", name: "Elvin J. Milleza" },
      acting: "",
      sections: {
        PPS: {
          stands: "Planning and Programming Section",
          email: "",
          admin: "",
        },
        PDS: {
          stands: "Project Development Section",
          email: "",
          admin: "",
        },
        MES: {
          stands: "Monitoring and Evaluation Section",
          email: "",
          admin: "",
        },
      }
    },
    "REGULATORY": {
      stands: "Regulartory Division",
      "email": "",
      "admin": "",
      sections: {
        RLICASS: {
          stands: "Registration/Licensing/Inspection Certification/Accreditation Service Section",
          email: "",
          admin: "",
        },
        QCIS: {
          stands: "Quality Control and Inspection Section",
          email: "",
          admin: "",
        },
        PPADMSEWS: {
          stands: "Plant Pest and Animal Disease Monitoring Surveillance and Early Warning Section",
          email: "",
          admin: "",
        },
      }
    },
    "RESEARCH": {
      stands: "Research Division",
      "email": "",
      "admin": "",
      sections: {
        TPCS: {
          stands: "Technology Packaging and Commercialization Section",
          email: "",
          admin: "",
        },
        SRDC: {
          stands: "Siquijor Research Development Center",
          email: "",
          admin: "",
        },
        SWRDC: {
          stands: "Soil Water Research and Development Center",
          email: "",
          admin: "",
        },
        SCFRDSS: {
          stands: "Southern Cebu Farming System R&D Satellite Station",
          email: "",
          admin: "",
        },
        CRDC: {
          stands: "Carmen Research and Development Center",
          email: "",
          admin: "",
        },
        BES: {
          stands: "Bohol Experiment Station",
          email: "",
          admin: "",
        },
        CES: {
          stands: "Cebu Experiment Station",
          email: "",
          admin: "",
        },
        USF: {
          stands: "Ubay Stock Farm",
          email: "",
          admin: "",
        },
        BAPC: {
          stands: "Bohol Agricultural Promotion Center",
          email: "",
          admin: "",
        },
        NORDC: {
          stands: "Negros Oriental Research and Development Center",
          email: "",
          admin: "",
        },
      }
    },
    "ILD": {
      stands: "Integrated Laboratory Division",
      email: "",
      admin: "",
      sections: {
        SOILS: {
          stands: "Regional Soils Laboratory",
          email: "",
          admin: "",
        },
        RADDL: {
          stands: "Regional Animal Disease Diagnostic Laboratory",
          email: "",
          admin: "",
        },
        RCPC: {
          stands: "Regional Crop Protection Center",
          email: "",
          admin: "",
        },
        FCAL: {
          stands: "Feed Chemical Analysis Laboratory",
          email: "",
          admin: "",
        },
        RVPL: {
          stands: "Regional Vaccine Production Laboratory",
          email: "",
          admin: "",
        }
      }
    },
    "AMAD": {
      stands: "Agribusiness and Marketing Assistance Division",
      email: "",
      admin: "",
      sections: {
        AGRIBUSINESS: {
          stands: "AgriBusiness Promotion Section",
          email: "",
          admin: "",
        },
        MARKET: {
          stands: "Market Development Section",
          email: "",
          admin: "",
        },
        SUPPORT: {
          stands: "AgriBusiness Industry Support Section",
          email: "",
          admin: "",
        }
      }
    },
    "FOD": {
      stands: "Field Operations Division",
      email: "",
      responsible: {employeeid: "180", name: "Gerry S. Avila"},
      admin: "",
      sections: {
        RICE: {
          stands: "Rice Program",
          email: "",
          responsible: "",
          admin: "",
        },
        LIVESTOCK: {
          stands: "Livestock Program",
          email: "",
          responsible: "",
          admin: "",
        },
        CORN: {
          stands: "Corn Program",
          email: "",
          responsible: "",
          admin: "",
        },
        HVCDP: {
          stands: "High Value-Crops Development Program",
          email: "",
          responsible: "",
          admin: "",
        },
        OAP: {
          stands: "Organic Agriculture Program",
          email: "",
          responsible: "",
          admin: "",
        },
        NUPAP: {
          stands: "National Urban and Peri-Urban Agriculture Program",
          email: "",
          responsible: "",
          admin: "",
        },
        PATCOCEBU: {
          stands: "Patco-Cebu",
          email: "",
          responsible: "",
          admin: "",
        },
        PATCOBOHOL: {
          stands: "Patco-BOHOL",
          email: "",
          responsible: "",
          admin: "",
        },
        PATCONEGROSOR: {
          stands: "Patco-Negros Oriental",
          email: "",
          responsible: "",
          admin: "",
        },
        PATCOSIQUIJOR: {
          stands: "Patco-Siquijor",
          email: "",
          responsible: "",
          admin: "",
        },
        SAAD: {
          stands: "Special Area of Agriculture Development",
          email: "",
          responsible: {employeeid: "180", name: "Liezl S. Pagaran"},
          admin: "",
        },
        IDS: {
          stands: "Institutional Development Services",
          email: "",
          responsible: "",
          admin: "",
        },
      }
    },
    "RAED": {
      stands: "Regional Agricultural Engineering Division",
      "email": "",
      "admin": "",
      sections: {
        EPDSS: {
          stands: "Engineering Plans, Design and Specifications Section",
          email: "",
          admin: "",
        },
        PPMS: {
          stands: "Program and Project Management Section",
          email: "",
          admin: "",
        },
        SRES: {
          stands: "Standard Regulation and Enforcement Section",
          email: "",
          admin: "",
        }
      }
    },
  },
  permissions
}


// =========================
// Funds Availability Sample
// =========================
const fundsAvailability = [
  { STO: { remaining_balance: 123456.60 } },
  { GASS: { remaining_balance: 123456.60 } }
];


// =========================
// Approval Steps (SVP)
// =========================
const approvalStepsSVP = [
  { id: 1, steps_title: "End-User" },
  { id: 2, steps_title: "Division Chief" },
  { id: 3, steps_title: "Budget Section" },
  { id: 4, steps_title: "Procurement Section (PS)" },
  { id: 5, steps_title: "BAC Secretariat" },
  { id: 6, steps_title: "Procurement Section (PS)" },
  { id: 7, steps_title: "Canvassers" },
  { id: 7.1, steps_title: "Supplier/Contractors" },
  { id: 8, steps_title: "BAC & BAC Sec." },
  { id: 9, steps_title: "Procurement Section (PS)" },
  { id: 10, steps_title: "RED/RTD" },
  { id: 11, steps_title: "BAC Sec./ Procurement Section (PS)" },
  { id: 12, steps_title: "Procurement Section (PS)" },
  { id: 13, steps_title: "End-User/Program Coor./Division Chief" },
  { id: 14, steps_title: "Budget Section" },
  { id: 15, steps_title: "Accounting Section" },
  { id: 16, steps_title: "RED/RTD" },
  { id: 17, steps_title: "General Services Section" },
  { id: 18, steps_title: "RED/RTD" },
  { id: 19, steps_title: "BAC Sec." },
  { id: 20, steps_title: "GS/RAED/End-User" },
  { id: 21, steps_title: "Inspectors" },
  { id: 22, steps_title: "End-Users" },
  { id: 23, steps_title: "GS/End-Users" },
  { id: 24, steps_title: "End-Users" },
  { id: 25, steps_title: "Accounting Section" },
  { id: 26, steps_title: "Division Chief" },
  { id: 27, steps_title: "Cashering Unit" },
  { id: 28, steps_title: "Accounting Section" },
  { id: 29, steps_title: "RED/RTD/Admin Chief" },
  { id: 30, steps_title: "Cashering Unit" }
];


function getStepsDetails(stepNumber) {
  return approvalStepsSVP.find(step => 
    step.id === stepNumber
  );
}
function findAminByEmail(department, emailToFind) {
  for(let division in department.divisions) {
    const divisionData = department.divisions[division]
    if(divisionData.email === emailToFind) {
      return divisionData.admin
    } 
  }
  return "Admin not found"
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
app.use('/client', express.static(clientPath))
app.use('/assets', express.static(viewsAssets))
app.use('/employees', express.static(viewsAssets))
app.use('/uploads', express.static('uploads'));

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

// EMAIL
let transporter = nodemailer.createTransport({
  service: 'gmail',  // Gmail service
    auth: {
      user: process.env.APP_EMAIL,  // Your Gmail address
      pass: process.env.APP_PASS      // Your App Password (not your main Gmail password)
    }
});
// endof EMAIL

app.use(async function(req, res, next){

  var components = ['Transactions', 'Employees', 'Documents']

  const notifications = await connection.retrieveNotifications()
  const employees = await connection.retrieveEmployee()
  const summaryTransaction = await connection.getTransactionSummary()
  const summaryEmployee = await connection.getEmployeeSummary()
  
  // Sort using Descending
  notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  const defaultNullUser = {
    employeeid: 70712,
    firstname: 'Just',
    middlename: 'The',
    lastname: 'Tester',
    extname: 'asdw',
    birthdate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    username: 'justtest',
    password: 'hay1122',
    experience: {
      lists: [{
        office: 'DA - RFO7',
        division: 'SAAD',
        salary: '123456',
        status: true,
        enddate: 'present',
        position: 'Data Controller X',
        startdate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        employment: 'Permanent',
        arrangements: 'On-site', 
      }],
    },
    contacts: {
      email: 'justtest@gmail.com',
      mobile: '09913983598',
    },
    others: {
      civilstatus: 'Married',
      gender: 'Male'
    },
    components: ['Transactions', 'Employees', 'Documents']
  }
  
  let role = ''
  const { employeeid, components:availComponents } = req.session?.user || defaultNullUser;
  if(employeeid) {
    role = await connection.getCurrentUserRole(employeeid)
    role = (role[0]?.role_name) ?? 'user'
  }

  let { experience, contacts, others } = defaultNullUser
  experience = JSON.stringify(experience)
  contacts = JSON.stringify(contacts)
  others = JSON.stringify(others)

  defaultNullUser.experience = experience
  defaultNullUser.contacts = contacts
  defaultNullUser.others = others

  // console.log('SESSION', req.session?.user || JSON.parse(JSON.stringify(defaultNullUser)))
  const fullUrl = req.protocol + '://' + req.get('host');

  const { divisions } = department

  const { experience:userExperience } = req.session.user || defaultNullUser
  const { lists } = JSON.parse(userExperience)
  let { division: userDivision, position } = lists[0]
  userDivision = userDivision.toUpperCase();
  
  // console.log(summaryTransaction)

  res.locals = {
    HOST: fullUrl,
    ENVIRONMENT: process.env.NODE_ENV,
    TEST_MODE: process.env.TEST_MODE,
    TEST_UNIT: process.env.TEST_UNIT,
    SESSION_USER: req.session?.user || defaultNullUser,
    defaultNullUser,
    DEPARTMENT: JSON.stringify(department),
    // NOTIFICATIONS: countNotif,
    // NOTIFICATIONS: (req.url === '/login') ? countNotif:JSON.stringify(notifications), // *** DO NOT REMOVE
    NOTIFICATIONS: JSON.stringify(notifications),
    logonUser: JSON.stringify(req.session.user),
    currentRole: role ?? 'developer',
    perClassification: {},
    employees,
    dafaultTransactionData: _preTransactionsData,
    defaultData: _preDefaultData,
    purchaseRequestStatuses,
    purchaseRequestRoles,
    path: req.url,
    path2: req.path,
    currentPath: req.path,
    isHome: req.originalUrl,
    moment,
    approval_steps: approvalStepsSVP,
    getUserDivisionResponsible: (division) => {
      const divisionData = department.divisions[division];
      return divisionData ? divisionData.responsible : null;
    },
    getUserResponsible: (division, section) => {
      const divisionData = department.divisions[division];
      return divisionData && divisionData.sections[section] ? {
          division: divisionData.responsible, 
          section: divisionData.sections[section].responsible
        } : null;
    },  
    userDesignation: {
      division: findDivisionBySection(divisions, userDivision),
      section: userDivision,
      position,
      role,
    },
    summary: {
      transactions: JSON.stringify(summaryTransaction[0]),
      employees: JSON.stringify(summaryEmployee[0])
    },
    stepsList: approvalStepsSVP,
    getStepTitle(step_id) {
      const step = res.locals.stepsList.find(step => String(step.id) === String(step_id));
      return step ? step.steps_title : `Unknown Step (step_id: ${step_id})`;
    },
    peso,
    isValidJSON,
    statusText,
    addLeadingZeros,
    findDivisionBySection,
    toCapitalize,
    isActive,
    userAvailComponents: (component) => {
      // Single component
      if (typeof component === 'string') {
        return availComponents.includes(component);
      }
  
      // Multiple components
      if (Array.isArray(component)) {
        return availComponents.every(c => components.includes(c));
      }
  
      return false;
    },
    getEmployeeById: (id) => {
      const data = res.locals.employees;
      const result = data.filter(e => String(e.employeeid) === String(id));
      const employee = result[0];
    
      if (!employee) {
        console.warn(`No employee found for ID: ${id}`);
        return JSON.stringify({ error: 'Employee not found' });
      }
    
      // Parse experience
      let experienceData = {};
      try {
        experienceData = JSON.parse(employee.experience);
      } catch (err) {
        console.error('Failed to parse experience:', employee.experience);
      }
    
      // Parse contacts
      let contactData = {};
      try {
        contactData = JSON.parse(employee.contacts);
      } catch (err) {
        console.error('Failed to parse contacts:', employee.contacts);
      }
    
      const getExperiences = (index) => {
        const item = experienceData.lists?.[index];
        if (!item) return {}; // Handle case where index is invalid
        return {
          office: item.office ?? 'Not set',
          salary: item.salary ?? 'Not set',
          status: item.status ?? 'Not set',
          endate: item.endate ?? 'Not set',
          division: item.division ?? 'Not set',
          position: item.position ?? 'Not set',
          startdate: item.startdate ?? 'Not set',
          employment: item.employment ?? 'Not set',
          arrangements: item.arrangements ?? 'Not set',
        };
      };
    
      const fullname = `${employee.firstname} ${employee.middlename} ${employee.lastname}`;
    
      const response = {
        ...employee,
        fullname,
        username: employee.username,
        contacts: contactData,
        firstname: employee.firstname,
        middlename: employee.middlename,
        lastname: employee.lastname,
        birthdate: employee.birthdate,
        experience: experienceData,
        office: experienceData.lists?.[0]?.office ?? 'Unknown',
        division: experienceData.lists?.[0]?.division ?? 'Unknown',
        position: experienceData.lists?.[0]?.position ?? 'Unknown',
        experiences: getExperiences(0),
      };
    
      return JSON.stringify(response);
    },
    trimName(fullName) {
      const parts = fullName.trim().split(' ');
      if (parts.length === 0) return '';

      const firstInitial = parts[0].charAt(0).toUpperCase();
      const lastName = parts[parts.length - 1];

      return `${firstInitial}. ${lastName}`;
    }
     
  }
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

function getDivisionAndPosition(experienceJson) {
  try {
    const parsed = JSON.parse(experienceJson);
    const firstEntry = parsed.lists?.[0];

    if (!firstEntry) {
      console.warn("No experience entries found.");
      return null;
    }

    const { division, position } = firstEntry;
    return { division, position };

  } catch (error) {
    console.error("Failed to parse experience JSON:", error);
    return null;
  }
}

// // Example use
// const experienceString = '{"lists": [{"office": "DA RFO7", "salary": "12333", "status": true, "enddate": "present", "division": "BUDGET", "position": "budget", "startdate": "2025-06-20", "employment": "Temporary", "arrangements": "On-site"}]}';

// const result = extractDivisionAndPosition(experienceString);
// console.log(result); // { division: "BUDGET", position: "budget" }

// FILE UPLOADS
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
      const uploadDir = './uploads';
      if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir); // Create the uploads directory if it doesn't exist
      }
      cb(null, uploadDir); // Save files in the 'uploads' directory
  },
  filename: (req, file, cb) => {
      // Rename the file using a unique name
      const ext = path.extname(file.originalname);
      const newFileName = `file_${Date.now()}_${Math.floor(Math.random() * 1000)}${ext}`;
      cb(null, newFileName); // Rename the file
  }
});

const upload = multer({ storage: storage });
// endof FILE UPLOADS

// POST route for multiple file upload
app.post('/upload', upload.array('fileToUpload[]'), async (req, res) => {
  console.log('assssssssssssssssssssss', req.body.refid)
  if (req.files && req.files.length > 0) {
      // Send response with the new file names
      const fileNames = req.files.map(file => file.filename);

      if(req.body.refid) {
        const { refid } = req.body
        const updateDocumentAttachements = {
          set: {
            attachments: fileNames,
            updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
          },
          where: {
            id: refid
          }
        }
        // If the Document is Updated successfully
        // it will now generate a new remarks
        const result = await connection.updateDocumentTrackerStatus(JSON.stringify(updateDocumentAttachements))
        if(result) {
          const { username } = res.locals.SESSION_USER
          const createActivity = {
            refid,
            message: "File attachments have been successfully added.", 
            reciever: "N/A",
            attachments: fileNames,
            created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            created_by: username,
          }
          await connection.createDocumentTrackerActivity(JSON.stringify(createActivity))
        }
      }

      res.json({ files: fileNames });
  } else {
      res.status(400).json({ error: 'No files uploaded' });
  }
});

app.get('/', restrict, async function(req, res){
  const getTotalApprovedBudget = await connection.getTotalApprovedBudget()
  const getPerPRClassification = await connection.countPerPRClassification()
  const getCardsData = await connection.cardsData()
  const getDataFromLast7Days = await connection.getDataFromLast7Days('remarks', 'date')

  const charts = getCardsData.reduce((acc, { table_name, row_count, total_sum }) => {
    acc[table_name] = { row_count, total_sum };
    return acc;
  }, {});
  
  const perPRClassification = getPerPRClassification.reduce((acc, { pr_classification, item_count }) => {
    acc[pr_classification] = item_count;
    return acc;
  }, {});

  console.log('charts', perPRClassification)
  
  res.render('pages/index', {
    title: "Dashboard",
    header: "Some users", 
    totalApprovedBudget: JSON.stringify(getTotalApprovedBudget[0]),
    perClassification: JSON.stringify(perPRClassification),
    tableDashboard: JSON.stringify(getDataFromLast7Days),
    cardsData: charts,
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
  res.status(200).send(renderedHtml)
})

app.get('/template2', async function(req, res) {
  let renderedHtml = await ejs.renderFile(path.join(__dirname, 'components', 'charts', 'pie.ejs'), { });
  renderedHtml += await ejs.renderFile(path.join(__dirname, 'components', 'notifications', 'index.ejs'), 
  { message: "HAHAHHA"  });
  res.status(200).send(renderedHtml)
})

// Endpoint to get the countNotif value
app.get('/api/notifications', async (req, res) => {
  const notifications = await connection.retrieveNotifications()
  res.json({ notifications, counts: notifications.length });
});

app.get('/404', (req, res) => {
  res.status(404).render('pages/404', {
    title: 'Page Not Found',
    component: 'Page'
  });
});

app.get('/unauthorized', (req, res) => {
  res.status(404).render('pages/unauthorize', {
    title: 'Page Not Found',
    component: 'Page'
  });
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
    
    // console.log({userDetails})

    if(userDetails.length !== 0) {
      userDetails = userDetails[0] ? JSON.stringify(userDetails[0]) : JSON.stringify({ message: 'Account Not Found' })
      let user = JSON.parse(userDetails)
      const {experience} = user
  
      if(!bcrypt.compareSync(password, user.password)) {
        req.session.error = 401; // Incorrect password
        res.status(404).redirect('/login')
        return next()
      }
      const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });
  
      req.session.user = user
      req.session.isAuthenticated = true
      req.session.token = token

     const {division, position} = getDivisionAndPosition(experience)

    //  console.log({division, position})

      // req.session.userDivision = division
      // req.session.userSection = 
      // req.session.userPosition =
  
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
      res.status(404).json({ message: 'Account not found!',  response: employees });
    }
    
  } catch (error) {
    console.error('Unable to load data', error);
    res.status(500).send('Internal Server Error');
  }
})

app.get('/register', function(req, res){
  // res.status(200).send(req.params)
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
    const steps = await connection.getTransactionActivity()
    
    let filteredTransactions = transactions; // Default to the original transactions

    if (discardedTransaction.length > 0) { 
        const { data: discardedTransactionIds } = discardedTransaction[0]; 
        filteredTransactions = transactions.filter(transaction => !discardedTransactionIds.includes(transaction.product_id)); // Adjust this if your transaction object has a different identifier 
    }

    // console.log('filteredTransactions', filteredTransactions);

    res.render('pages/transactions/index', { 
        title: 'Transactions',
        transactions: filteredTransactions, // Use filteredTransactions here
        moment: moment,
        connection: connection,
        predata: _preTransactionsData,
        path: req.url,
        steps: steps.sort((a, b) => b.id - a.id),
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
      await connection.postTransactionActivity(JSON.stringify({
        steps_number: 2,
        trans_id: insertId,
        status: "pending",
      }))
      const nofitifications = await connection.postNotifications(JSON.stringify(data))
    }
    // console.log('transactions', transactions)
    res.status(201).json({ message: 'Transaction created successfully!', response: transactions });
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).send('Internal Server Error');
  }
})

app.put('/transactions/update', restrict, async (req, res) => {
  try {
    const {set} = JSON.stringify(req.body)
    const { username } = res.locals.SESSION_USER

    const transactions = await connection.putTransactions( JSON.stringify(req.body) );
    if(set.includes('amount')) {
      await connection.putRemarks(JSON.stringify({
        comment: `Add quoted amount of ${set?.amount}`,
        refid: transid,
        status: 'selectedStatusValue',
        user: username,
        dueDate: 'checkedCheckboxes'
      }))
    }
    res.status(200).json({ message: 'Transaction Successfully Updated!', response: transactions });
  } catch (error) {
    console.error('Error adding transaction:', error);
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
    
    const steps = await connection.getTransactionActivityId(JSON.stringify({trans_id: transid}))
    
    console.log(steps.sort((a, b) => b.id - a.id))

    if(transactions[0]) {
      res.render('pages/transactions/view', { 
        title: 'Transactions: Remarks',
        transactions: transactions[0],
        remarks: remarks.sort((a, b) => b.id - a.id),
        moment: moment,
        path: res.url,
        query: transid,
        steps: steps.sort((a, b) => b.id - a.id),
        
      }); // Pass the data to the template

      console.log('req.session.user', req.session.user)
    } else {
      res.render('pages/404', {
        title: '404 Transaction Not Found',
        referer: req.referer,
        component: 'Transaction',
        steps
      });
    }
  } catch (error) {
      console.error('Error displaying transaction:', error);
      // res.status(500).send('Internal Server Error');
      res.status(404).render('pages/404', {
        title: "404 Page not found",
        component: "Transaction"
      });
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
    const transId = req.params.id;

    const remarks = await connection.getRemarksByRefid(transId);
    const transactions = await connection.getTransactionById(transId);
    const steps = await connection.getTransactionActivity()

    console.log({remarks, transactions})

    if (!remarks || !transactions) {
      console.warn('Missing remarks or transactions data for transId:', transId);
    }

    // const renderedHtml = await ejs.renderFile(
    //   path.join(__dirname, 'views', 'partials', 'activity-feed.ejs'),
    //   {
    //     remarks,
    //     transactions,
    //     steps: steps.sort((a, b) => b.id - a.id),
    //   }
    // );

    // res.status(200).send(renderedHtml);
    res.render('views/partials/activity-feed.ejs', {
      remarks,
      transactions,
      steps: steps.sort((a, b) => b.id - a.id),
    })
    // res.render(renderedHtml)
  } catch (error) {
    console.error('Error rendering EJS activity feed:', error);
    res.status(500).json({ error: 'Failed to render activity feed' });
  }

})

app.post('/remarks/new', restrict, async (req, res) => {
  try {
  const data = req.body;
  const { username } = res.locals.SESSION_USER;
  const updatedRemarks = { ...data, user: username };

  console.log('Updated Remarks:', updatedRemarks);

  const remarks = await connection.postRemarks(JSON.stringify(updatedRemarks));

  if (remarks?.affectedRows) {
    const { refid } = updatedRemarks;

    const handleNotification = async (id) => {
      const transactions = await connection.getTransactionById(id);
      if (!transactions?.length) {
        console.error('No transactions found for id:', id);
        return;
      }

      const { requisitioner } = transactions[0];
      console.log('transactions:', transactions);

      const notificationPayload = {
        message: `New remark is added under ${id}!`,
        link: id,
        component: 'remarks',
        concerning: requisitioner,
      };

      await connection.postNotifications(JSON.stringify(notificationPayload));
    };

    if (Array.isArray(refid)) {
      for (const id of refid) {
        await handleNotification(id);
      }
    } else {
      await handleNotification(refid);
    }

    res.status(200).json({ message: 'New remark added successfully!', response: remarks });
  } else {
    res.status(200).json({ message: 'Failed to post new remark!' });
  }
} catch (error) {
  console.error('Error adding new remark:', error);
  res.status(500).send('Error adding new remark');
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
  const employees = await connection.retrieveEmployee()
  const roles = await connection.retrieveEmployeeIdsWithRole()
  // console.log(employees)
  res.render('pages/employees/index', {
    title: 'Employees',
    employees: JSON.stringify(employees),
    roles,
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
      let roles = await connection.getRoles()
      res.render('pages/employees/register', {
        defaultData: _preDefaultData,
        title: 'Register Employee',
        path: res.url,
        moment,
        roles: JSON.stringify(roles),
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

app.get('/employees/register', restrict, async function(req, res){
  let roles = await connection.getRoles()

  res.render('pages/employees/register', {
    defaultData: _preDefaultData,
    title: 'Register Employee',
    path: res.url,
    roles: JSON.stringify(roles),
  })
})

app.get('/employees/:id/update', restrict, async function(req, res){
  const employeeid = req.params.id;
  const employee = await connection.getEmployeeById(employeeid)
  let roles = await connection.getRoles()

  res.render('pages/employees/register', {
    defaultData: _preDefaultData,
    employees: employee[0],
    roles: JSON.stringify(roles),
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

app.get('/qrscanner', restrict, async function(req, res){
  res.render('pages/scanner', {
    title: "Scan QR Code"
  })
})

// DOCUMENTS
app.get('/documents', restrict, async function(req, res){
  const results = await connection.getDocumentTrackerData()
  let analysisData = await connection.getDocumentTrackerAnalysis()
  let analysisDataReplies = await connection.getDocumentTrackerActivityReplies()
  // console.log(analysisData)
  analysisData = analysisData[0]
  analysisDataReplies = analysisDataReplies[0]

  res.render('pages/documents/index', {
    title: 'Documents',
    displayData: results,
    analysis: {analysisData, analysisDataReplies},
  })
})

app.get('/documents/template/newEmail', restrict, function(req, res) {
  res.render('pages/emails/new2', {
    title: 'Template on New Email'
  })
})

app.post('/documents/create', restrict, async function(req, res){
  try {
    const data = JSON.stringify(req.body)
    // console.log(data)
    const results = await connection.createDocumentTracker(data)
    res.status(200).json({ message: 'New Document is being on Track', response: results})
  } catch (error) {
    console.error('Error addding new notification on transaction:', error);
    res.status(400).send({ message: 'Error addding notification on transaction:', response: error});
  }
})

app.post('/documents/send', restrict, async function(req, res) {
  try {
    const { subject, to, html, id, timetocomply, created_by, attachments } = req.body;
    console.log(req.body);

    const files = JSON.parse(attachments)
    const mappedAttachments = files.map(filePath => {
      return {
        filename: filePath.split('/').pop(),
        path: filePath,
      };
    });

    let mailOptions = {
      from: `"DA RFO7" <${process.env.APP_EMAIL}>`,
      to,
      subject,
      html,
      mappedAttachments,
    };

    const updateDocumentStatus = {
      set: {
        status: 'outgoing',
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
      },
      where: {
        id
      }
    }
  
    const createActivity = {
      refid: id,
      message: html, 
      reciever: to,
      attachments: attachments,
      timetocomply: moment(timetocomply).format('YYYY-MM-DD HH:mm:ss'),
      created_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      created_by,
    }

    let emails = to.split(', ')
    let t_username = []
    emails.forEach(email=>{
      const admin = findAminByEmail(department, email)
      t_username.push(admin)
    })

    const notifications = {
      message: `New Email from ORED`,
      link: id,
      component: 'documents',
      concerning: JSON.stringify(t_username)
    }

    // Use async/await for email sending
    const info = await transporter.sendMail(mailOptions);
    const updateDocumentTrackerStatus = await connection.updateDocumentTrackerStatus(JSON.stringify(updateDocumentStatus))
    const updateDocumentTrackerActivity = await connection.createDocumentTrackerActivity(JSON.stringify(createActivity))
    const sendNotification = await connection.postNotifications(JSON.stringify(notifications))
    console.log('Email sent:', info.response);
    
    res.status(200).json({ message: 'Email sent successfully', response: info });

  } catch (error) {
    console.error(error);
    res.status(500).send('Failed to send email');
  }
});

app.get('/documents/:id', restrict, async function(req, res){
  try {
    const {id} = req.params
    const results = await connection.retrieveDocuments('documents', JSON.stringify(req.params))
    const activities = await connection.getDocumentTrackerActivity(JSON.stringify({refid:id}))
    const employees = await connection.retrieveEmployee()
    if (results.length > 0) {
      const { username } = res.locals.SESSION_USER
      var { priority, created_by } = results[0]
      if (priority === 'confidential' && created_by !== username) {
        res.render('pages/unauthorize', {
          title: "Unauthorized Access", 
        })
      } else { 
        res.render('pages/documents/id', {
          title: "Document", 
          displayData: results[0], 
          activities: activities.sort((a, b) => b.id - a.id),
          employeesData: employees,
        })
      }
    }
    
  } catch (error) {
    console.error('Error on displaying the document:', error);
    res.status(404).render('pages/404', {
      title: "Document", 
      component: "Document"
    });
  }
})

// app.put('/document/:id', restrict, async function(req, res) {
//   try {
//     const updateDocumentData = {
//       set: {
//         attachments,
//         updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss')
//       },
//       where: {
//         id
//       }
//     }
//     // const transactions = await connection.updateDocumentTrackerStatus( updateDocumentData );
//     res.status(200).json({ message: 'Document Successfully Updated!', response: transactions });
//   } catch (error) {
//     console.error('Failed to update the Document: ', error);
//     res.status(500).send('Failed to update the Document');
//   }
// })

app.post('/documents/:id/activity', restrict, async function(req, res){
  try { 
    const results = await connection.createDocumentTrackerActivity(JSON.stringify(req.body))
    res.status(200).json({ message: 'New remarks is added', response: results})
  } catch (error) {
    res.status(400).send('Error addding remarks:', error);
  }
})

// ENDOF DOCUMENTS

// To Be Feature
app.get('/calendar', restrict, async function(req, res){
  
  res.render('pages/documents/calendar', {
    title: 'Calendar',
  })
})

// Express route to approve a step
app.post("/approve", async (req, res) => {
  // const { trans_id: prId, steps_number:stepNumber, updated_by:approverName } = req.body;
  const { trans_id, steps_number, updated_by } = req.body;
  const steps = getStepsDetails(steps_number) 

  console.log('steps', steps?.steps_title)

  try {
    // console.log([trans_id, steps_number, updated_by]) 
    const data = {
      set: {
        status: 'approved',
        updated_by,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      },
      where: {
        trans_id,
        steps_number,
      }
    }
    await connection.updateTransactionActivity(JSON.stringify(data))
   
    // console.log([trans_id, steps_number + 1])
    await connection.postTransactionActivity(JSON.stringify({
      status: 'pending', 
      trans_id, 
      steps_number: (steps_number + 1)
    }))

    await connection.postNotifications(JSON.stringify({
      message: `PR has been updated to ${steps.steps_title}`,
      link: trans_id,
      component: 'transactions',
      // concerning: JSON.stringify(t_username)
    }))

    res.json({ success: true, message: "Approval step advanced." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to advance approval." });
  }
});

app.post("/disapprove", async (req, res) => {
  const { trans_id, steps_number, updated_by } = req.body;
  const steps = getStepsDetails(steps_number) 
  try {
    if( steps?.steps_title ) {
      // trap it here
    }
    res.status(500).json({ success: false, message: "Request has been disapproved." });
    // 
  } catch (error) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to disapproved the request." });
  }
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
    const transaction = await connection.getTransactionById(id);
    if (transaction) {
      return res.status(200).json({ response: transaction });
    }
    return res.status(404).json({ response: 'Transaction Not Found!' });
  });
app.route('/api/documents/:id')
  .all(restrict)
  .get(async (req, res) => {
    const { id } = req.params;
    // First check the id
    const results = await connection.getDocumentTrackerID(id)
    const { created_at } = JSON.parse(results)
    // Then, validate the creation date

    return res.status(400).json({ response: JSON.parse(results) }); 
  });

app.route('/api/qrcode/:id')
   .all(restrict)
   .get(async (req, res) => {
    const {id} = req.params

    let results = await connection.getTransactionById(id)
    
    if(results.length > 0) { 
      results = JSON.stringify(results[0])
      return res.status(200).json({ response: JSON.parse(results), component: 'transactions' });  
    } else {
      results = await connection.getDocumentTrackerID(id)
      if(results.length > 0) {
        return res.status(200).json({ response: JSON.parse(results), component: 'documents' });  
      }
    }

    return res.status(400).json({ response: 'No data related to the QR Code', component: false });  
   })


app.get('/settings', restrict, async function(req, res){
  const results = await connection.getSettings()
  let employees = await connection.retrieveEmployee()
  const { username } = res.locals.SESSION_USER
  employees.sort((a, b) => 
    a.lastname.toLowerCase() < b.lastname.toLowerCase() ? -1 : 
    (a.lastname.toLowerCase() > b.lastname.toLowerCase() ? 1 : 0)
  );
  if(username === 'justtest') { // user is admin
    res.render('pages/settings', {
      title: "Settings",
      settings: JSON.parse(JSON.stringify(results)),
      employees: JSON.parse(JSON.stringify(employees))
    })
  }
  res.status(404).render('pages/unauthorize', {
    title: 'Page Not Found',
    component: 'Page'
  });
})

app.post('/settings', restrict, async function(req, res){
  try {
    const settings = {
      settings: JSON.stringify(req.body)
    }
    const results = await connection.postSettings('settings', JSON.stringify(settings))
    res.status(200).json({ message: 'Settings updated!', response: results})
  } catch (error) {
    res.status(400).json({ message: `Error saving settings: ${error}`, response: {} });
  } 
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


app.get('/media', (req, res) => {
  const mediaDir = path.join(__dirname, 'uploads');

  fs.readdir(mediaDir, (err, files) => {
    if (err) return res.status(500).send('Error reading media folder');

    const fileData = files.map(file => {
      const filePath = path.join(mediaDir, file);
      const stats = fs.statSync(filePath);
      const ext = path.extname(file).slice(1);
      return {
        name: file,
        size: (stats.size / 1024).toFixed(2) + ' KB', // or use MB if preferred
        type: ext || 'unknown'
      };
    });

    res.render('pages/media', {
      title: 'Media Gallery',
      files: fileData,
      basePath: '/uploads'
    });
  });
});



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