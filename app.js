require('dotenv').config();

const http = require('http');
const express = require('express');
// const socketio = require('socket.io');
const { createServer, get } = require("node:http")
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
const MySQLStore = require('express-mysql-session')(session);
const { v4: uuidv4 } = require('uuid');

const logger = require('./utils/logger');



const sessionStore = new MySQLStore({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE
});


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
const { permission, title } = require('node:process');
const { trace } = require('node:console');
const { stringify } = require('node:querystring');
const { hash } = require('node:crypto');
 

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

const purchaseRequestRoles = {
  "End-User": [
    "preparation",
    "final_review",
    "acceptance",
    "final_acceptance",
    "inspection_scheduling",
    "documentation"
  ],
  "Program Coordinator": ["final_review"],
  "Division Chief": [
    "division_head_approval",
    "final_review",
    "voucher_approval"
  ],
  "Budget Section": ["earmarking", "fund_allocation"],
  "Procurement Section (PS)": [
    "philgesp_posting",
    "preparation_quotation_form",
    "procurement_finalization",
    "po_preparation",
    "award_preparation"
  ],
  "BAC Secretariat": [
    "bac_review",
    "delivery_confirmation",
    "bac_evaluation"
  ],
  "BAC Members": ["bac_evaluation"],
  "Canvassers": ["canvassing"],
  "Supplier/Contractors": ["supplier_engaged"],
  "RED/RTD": [
    "executive_approval",
    "executive_signoff",
    "delivery_approval",
    "final_signoff"
  ],
  "Admin Chief": ["final_signoff"],
  "Accounting Section": [
    "obligation_request",
    "voucher_preparation",
    "liquidation"
  ],
  "General Services Section": ["delivery_preparation", "inspection_scheduling", "documentation"],
  "RAED": ["inspection_scheduling"],
  "Inspectors": ["inspection"],
  "Cashering Unit": ["payment_processing", "release_funds"]
};

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
    "ACEDD": {
      stands: "Agricultural Competitiveness and Extension Division",
      email: "",
      admin: "",
      responsible: { employeeid: "116", name: "Basta Taga Aced" },
      acting: "",
      sections: {
        SPPS: {
          stands: "Sectoral Planning and Policy Section",
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
          responsible: { employeeid: "984", name: "Wrongrammer" },
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
      responsible: { employeeid: "70005", name: "Elvin J. Milleza" },
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
      responsible: {employeeid: "180", name: "Mayolyn T. Majaducon"},
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
      responsible: {employeeid: "180", name: "Fabio G. Enriquez"},
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
      responsible: {employeeid: "180", name: "Norma B. Repol"},
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
          responsible: {employeeid: "180", name: "Ethan Turner"},
        }
      }
    },
    "AMAD": {
      stands: "Agribusiness and Marketing Assistance Division",
      email: "report@amad7.gov.ph",
      admin: "",
      responsible: { employeeid: "70010", name: "Lorelei B. Acha" },
      sections: {
        AGRIBUSINESS: {
          stands: "AgriBusiness Promotion Section",
          email: "agribusiness@amad7.gov.ph",
          admin: "",
          responsible: { employeeid: "70011", name: "Ligaya A. Ebarita" },
        },
        MARKET: {
          stands: "Market Development Section",
          email: "",
          admin: "",
          responsible: {employeeid: "180", name: "Jenie F. Evardo"},
        },
        SUPPORT: {
          stands: "AgriBusiness Industry Support Section",
          email: "",
          admin: "",
          responsible: {employeeid: "180", name: "Ana Delza S. Barimbao"},
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
          responsible: {employeeid: "180", name: "Epifanio P. Qaudicos"},
          admin: "",
        },
        LIVESTOCK: {
          stands: "Livestock Program",
          email: "",
          responsible: {employeeid: "180", name: "Zeam Voltaire E. Ampere"},
          admin: "",
        },
        CORN: {
          stands: "Corn Program",
          email: "",
          responsible: {employeeid: "180", name: "Luvinia A. Corpus"},
          admin: "",
        },
        HVCDP: {
          stands: "High Value-Crops Development Program",
          email: "",
          responsible: {employeeid: "180", name: "John Dennes R. Manunulo"},
          admin: "",
        },
        OAP: {
          stands: "Organic Agriculture Program",
          email: "",
          responsible: {employeeid: "180", name: "Mae E. Montecillo"},
          admin: "",
        },
        NUPAP: {
          stands: "National Urban and Peri-Urban Agriculture Program",
          email: "",
          responsible: {employeeid: "180", name: "Prescilla D. Soriano"},
          admin: "",
        },
        PATCOCEBU: {
          stands: "Patco-Cebu",
          email: "",
          responsible: "",
          responsible: {employeeid: "180", name: "Marina C. Viniegas"},
          admin: "",
        },
        PATCOBOHOL: {
          stands: "Patco-BOHOL",
          email: "",
          responsible: {employeeid: "180", name: "Roman M. Dabalos"},
          admin: "",
        },
        PATCONEGROSOR: {
          stands: "Patco-Negros Oriental",
          email: "",
          responsible: {employeeid: "180", name: "Alejandro Rafal"},
          admin: "",
        },
        PATCOSIQUIJOR: {
          stands: "Patco-Siquijor",
          email: "",
          responsible: {employeeid: "180", name: "Agnes M. Cafe"},
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
          responsible: {employeeid: "180", name: "Leonela G. Gocho"},
        },
      }
    },
    "RAED": {
      stands: "Regional Agricultural Engineering Division",
      "email": "",
      "admin": "",
      responsible: {employeeid: "180", name: "Edna N. Yu"},
      admin: "",
      sections: {
        EPDSS: {
          stands: "Engineering Plans, Design and Specifications Section",
          email: "",
          responsible: {employeeid: "180", name: "Kenneth Jaysone C. Sanchez"},
          admin: "",
        },
        PPMS: {
          stands: "Program and Project Management Section",
          email: "",
          responsible: {employeeid: "180", name: "Noel T. Cahiles"},
          admin: "",
        },
        SRES: {
          stands: "Standard Regulation and Enforcement Section",
          email: "",
          responsible: {employeeid: "180", name: "Rodrigo R. Pechon"},
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
  { id: 1, steps_title: "End-User", stage: "prepared_by" },
  { id: 2, steps_title: "Division Chief", stage: "division_head_approval" },
  { id: 3, steps_title: "Budget Section", stage: "budget_earmarking" },
  { id: 4, steps_title: "Procurement Section", stage: "philgeps_posting" },
  { id: 5, steps_title: "BAC Secretariat", stage: "bac_review" },
  { id: 6, steps_title: "Procurement Section", stage: "quotation_form_preparation" },
  { id: 7, steps_title: "Canvassers", stage: "canvassing" },
  { id: 8, steps_title: "Supplier/Contractors", stage: "supplier_engagement" },
  { id: 9, steps_title: "BAC & BAC Secretariat", stage: "bac_evaluation" },
  { id: 10, steps_title: "Procurement Section", stage: "procurement_finalization" },
  { id: 11, steps_title: "RED/RTD", stage: "executive_approval" },
  { id: 12, steps_title: "BAC Secretariat & Procurement Section", stage: "award_preparation" },
  { id: 13, steps_title: "Procurement Section", stage: "po_preparation" },
  { id: 14, steps_title: "End-User / Program Coordinator / Division Chief", stage: "final_review" },
  { id: 15, steps_title: "Budget Section", stage: "fund_allocation" },
  { id: 16, steps_title: "Accounting Section", stage: "obligation_request" },
  { id: 17, steps_title: "RED/RTD", stage: "executive_signoff" },
  { id: 18, steps_title: "General Services Section", stage: "delivery_preparation" },
  { id: 19, steps_title: "RED/RTD", stage: "delivery_approval" },
  { id: 20, steps_title: "BAC Secretariat", stage: "delivery_confirmation" },
  { id: 21, steps_title: "GS / RAED / End-User", stage: "inspection_scheduling" },
  { id: 22, steps_title: "Inspectors", stage: "inspection" },
  { id: 23, steps_title: "End-User", stage: "acceptance" },
  { id: 24, steps_title: "GS / End-User", stage: "documentation" },
  { id: 25, steps_title: "End-User", stage: "final_acceptance" },
  { id: 26, steps_title: "Accounting Section", stage: "voucher_preparation" },
  { id: 27, steps_title: "Division Chief", stage: "voucher_approval" },
  { id: 28, steps_title: "Cashiering Unit", stage: "payment_processing" },
  { id: 29, steps_title: "Accounting Section", stage: "liquidation" },
  { id: 30, steps_title: "RED / RTD / Admin Chief", stage: "final_signoff" },
  { id: 31, steps_title: "Cashiering Unit", stage: "fund_release" }
];

const approvalStepsPublicBidding = [
  { id: 1, steps_title: "End-User", stage: "prepared_by" },
  { id: 2, steps_title: "Division Chief", stage: "division_head_approval" },
  { id: 3, steps_title: "Budget Section", stage: "budget_earmarking" },
  { id: 4, steps_title: "BAC Secretariat", stage: "pre_bid_documents_preparation" },
  { id: 5, steps_title: "BAC", stage: "pre_bid_conference" },
  { id: 6, steps_title: "Procurement Section", stage: "philgeps_posting" },
  { id: 7, steps_title: "Suppliers", stage: "bid_submission" },
  { id: 8, steps_title: "BAC", stage: "bid_opening" },
  { id: 9, steps_title: "Technical Working Group", stage: "bid_evaluation" },
  { id: 10, steps_title: "BAC", stage: "post_qualification" },
  { id: 11, steps_title: "BAC", stage: "recommendation_for_award" },
  { id: 12, steps_title: "HOPE (RED/RTD)", stage: "approval_of_award" },
  { id: 13, steps_title: "BAC Secretariat", stage: "notice_of_award" },
  { id: 14, steps_title: "Supplier", stage: "contract_signing" },
  { id: 15, steps_title: "Procurement Section", stage: "po_preparation" },
  { id: 16, steps_title: "Budget Section", stage: "fund_allocation" },
  { id: 17, steps_title: "Accounting Section", stage: "obligation_request" },
  { id: 18, steps_title: "General Services Section", stage: "delivery_preparation" },
  { id: 19, steps_title: "Inspection Team", stage: "inspection" },
  { id: 20, steps_title: "End-User", stage: "acceptance" },
  { id: 21, steps_title: "Accounting Section", stage: "voucher_preparation" },
  { id: 22, steps_title: "Division Chief", stage: "voucher_approval" },
  { id: 23, steps_title: "Cashiering Unit", stage: "payment_processing" },
  { id: 24, steps_title: "Accounting Section", stage: "liquidation" },
  { id: 25, steps_title: "RED / RTD / Admin Chief", stage: "final_signoff" },
  { id: 26, steps_title: "Cashiering Unit", stage: "fund_release" }
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
function createSessionForGuest(guest) {
  return jwt.sign(
    { id: guest.id, role: 'guest' },
    process.env.JWT_SECRET,
    { expiresIn: '1h' }
  );
}


let transid = []

const app = express();
const router = express.Router();

const clientPath = `${__dirname}/client/`;
const modulesPath = `${__dirname}/node_modules/`;
const csvPath = `${__dirname}/`;
const adminPath = `${__dirname}/demo/`;
const viewsAssets = `${__dirname}/assets/`;

// const transPath = `${__dirname}/transactions.ejs`;

const SERVER_PORT = 4000;

// router.get('/', function(req, res, next) {
//   res.end()
// })

const serverIO = require('socket.io')(http)

app.set("view engine", "ejs")
app.set("views", [
  path.join(__dirname, "pages"),
  path.join(__dirname, "views")
]);
app.set('io', serverIO)


app.use('/', require('./routes/root'))
app.use(bodyParser.json());


const sheetsRouter = require('./routes/sheets');
app.use('/api', sheetsRouter);
app.use(express.json());

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
  key: 'session_cookie_name',
  secret: 'your_secret_key',
  store: sessionStore,
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

const { expressConnect, expressActivityLog } = _express(io, moment)

expressConnect()
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

app.use(async (req, res, next) =>{

  var components = ['Transactions', 'Employees', 'Documents']

  const [notifications, transactions, summaryTransaction, summaryEmployee, activities] = await Promise.all([
    connection.retrieveNotifications(),
    connection.getTransactions(),
    connection.getTransactionSummary(),
    connection.getEmployeeSummary(),
    connection.getTransactionActivity(),
  ]);

  // Sort using Descending
  notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  let role = '';
  let userDivision = '';
  let userSection = '';
  let userPosition = '';
  let availComponents = [];
  let totalTransactions = 0;

  const sessionUser = req.session?.user;

  if (sessionUser) {
    const {
      employeeid,
      components,
      role: userRole,
      experience: userExperience
    } = sessionUser;

    availComponents = components;

    const filteredActivity = activities.filter(activity =>
      activity.assigned_to === employeeid
    );

    const productIds = filteredActivity.map(activity => activity.product_id);
    const numericUserId = parseInt(employeeid, 10);
     // Filter transactions: created by or assigned to current user
    const parsedTransactions = transactions.map(txn => ({
      ...txn,
      prepared_by: typeof txn.prepared_by === 'string'
        ? JSON.parse(txn.prepared_by)
        : txn.prepared_by
    }));
    let filteredTransactions;

    filteredTransactions = parsedTransactions.filter(txn =>
      txn.prepared_by?.employeeid === numericUserId || productIds.includes(txn.product_id)
    );
    
    if(sessionUser && sessionUser?.roles) {
      sessionUser?.roles.includes('Guest') || sessionUser?.roles.includes('SuperAdmin') 
        ? filteredTransactions = transactions 
        : filteredTransactions = filteredTransactions;
    }

    totalTransactions = filteredTransactions.length;

    try {
      const { lists: userSession } = JSON.parse(userExperience);
      const { division, section, position } = userSession?.[0] || {};

      userDivision = division?.toUpperCase() || '';
      userSection = section?.toUpperCase() || '';
      userPosition = position?.toUpperCase() || '';

      // Optional: Restore role from DB if needed
      // const roleData = await connection.getCurrentUserRole(employeeid);
      // role = roleData?.[0]?.role_name || 'user';

    } catch (error) {
      console.error('Invalid userExperience format:', error);
    }
  }


  // console.log('SESSION', req.session?.user || JSON.parse(JSON.stringify(defaultNullUser)))
  const fullUrl = req.protocol + '://' + req.get('host');

  const { divisions } = department

  res.locals = {
    HOST: fullUrl,
    ENVIRONMENT: process.env.NODE_ENV,
    TEST_MODE: process.env.TEST_MODE,
    TEST_UNIT: process.env.TEST_UNIT,
    SESSION_USER: req.session?.user,
    SESSION_USER_LOG: {
      designation: {
        division: sessionUser ? findDivisionBySection(divisions, userDivision) : null,
        section: sessionUser ? userSection : null,
        position: sessionUser ? userPosition : null,
      },
      components: sessionUser ? availComponents : null,
    },
    ROUTEINFO : {
      path: req.path,
    },
    DEPARTMENT: JSON.stringify(department),
    // NOTIFICATIONS: countNotif,
    // NOTIFICATIONS: (req.url === '/login') ? countNotif:JSON.stringify(notifications), // *** DO NOT REMOVE
    NOTIFICATIONS: JSON.stringify(notifications),
    logonUser: JSON.stringify(req.session.user),
    perClassification: {},
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

      const results = (() => {
        if (!divisionData) return null;

        // If section equals division → only return division responsible
        if (division === section) {
          return { division: divisionData.responsible };
        }

        // If section head is equal to sessions users → return division responsible only
        if (divisionData.sections[section].responsible.employeeid == res.locals.SESSION_USER.employeeid) {
          return { division: divisionData.responsible };
        }

        // If section exists inside division → return both
        if (divisionData.sections?.[section]) {
          return {
            division: divisionData.responsible,
            section: divisionData.sections[section].responsible
          };
        } 
        
        // Fallback → return only division responsible
        return { division: divisionData.responsible };
      })();

      // console.log('Responsible fetched:', { division, section, results });
      return results;

    },
    SUMMARY: {
      transactions: JSON.stringify(summaryTransaction[0]),
      totalTransactions,
      employees: JSON.stringify(summaryEmployee[0])
    },
    STEPS: {
      lists: approvalStepsSVP,
      getCurrentStep: (steps, product_id) => {
        const step = steps.find(step => step.product_id === product_id);
        return step ? step : null;
      },
      getDetails: (id) => {
        const { STEPS } = res.locals
        return STEPS?.lists.find(step => step.id === id);
      },
      getTitle: (step_id) => {
        const { STEPS } = res.locals
        const step = STEPS?.lists.find(step => step.id === step_id);
        return step ? step.steps_title : `Unknown Step (step_id: ${step_id})`;
      },
    },
    UTILS: {
      hashPasswordUtils,
      authenticateUserUtils,
      peso,
      isValidJSON,
      statusText,
      addLeadingZeros,
      findDivisionBySection,
      toCapitalize,
      isActive,
      getDivisionAndPosition,
      getEmployeeById: async (id) => {
        const result = await connection.getEmployeeById(id);
        // console.log('Fetching employee by ID:', result);
        return JSON.stringify(result[0]);
      }
    },
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
    isGuest: () => {
      return SESSION_USER?.roles.includes('Guest');
    },
    isSuperAdmin: () => {
      return SESSION_USER?.roles.includes('SuperAdmin')
    },
    trimName(fullName) {
      const parts = fullName.trim().split(' ');
      if (parts.length === 0) return '';

      const firstInitial = parts[0].charAt(0).toUpperCase();
      const lastName = parts[parts.length - 1];

      return `${firstInitial}. ${lastName}`;
    },
    hasAllowedRole(allowedRoles, userRoles = SESSION_USER?.roles) {
      // Coerce allowedRoles to array if it's a string
      if (typeof allowedRoles === 'string') {
        allowedRoles = [allowedRoles];
      }

      // Parse userRoles if it's a stringified array
      if (typeof userRoles === 'string') {
        try {
          userRoles = JSON.parse(userRoles);
        } catch (e) {
          console.warn('Failed to parse userRoles string:', userRoles);
          return false;
        }
      }

      if (!Array.isArray(userRoles)) {
        // console.warn('userRoles is not an array:', userRoles);
        return false;
      }

      const normalizedUserRoles = userRoles.map(r => r.trim().toLowerCase());
      return allowedRoles.some(role => normalizedUserRoles.includes(role.trim().toLowerCase()));
    },
    isCreatorOfTransaction(transaction) {
      const SESSION_USER = res?.locals?.SESSION_USER;
      const employeeId = SESSION_USER?.employeeid;

      let preparedBy = transaction?.prepared_by;

      // Check if preparedBy is a string and needs parsing
      if (typeof preparedBy === 'string') {
        try {
          preparedBy = JSON.parse(preparedBy);
        } catch (error) {
          if (process.env.NODE_ENV !== 'production') {
            console.error('Failed to parse prepared_by:', error);
          }
          return false; // Invalid JSON, cannot verify ownership
        }
      }

      const preparedById = preparedBy?.employeeid;
      const isOwner = employeeId === preparedById;

      if (process.env.NODE_ENV !== 'production') {
        console.log('Ownership Check:', { employeeId, preparedById, isOwner });
      }

      return isOwner;
    },
    canUpdateTransaction(employee, transaction_activity) {
      // console.log({ canUpdateTransaction: { employee, transaction_activity } });

      if (!transaction_activity || !transaction_activity.assigned_to) {
        return false;
      }

      return employee.employeeid === transaction_activity.assigned_to;
    },
    async getEmployeesUnderDivision(id) {
      try {
        console.log('Fetching employees under division ID:', id);
        const employees = await connection.getEmployeesUnderSameDivision(id);

        if (!Array.isArray(employees)) {
          console.warn('Expected an array but got:', typeof employees);
          return [];
        }
        console.log(`Found ${employees.length} employees under division ID ${id}`, employees);
        return JSON.stringify(employees);
      } catch (error) {
        console.error('Error fetching employees under division:', error);
        return [];
      }
    },
    getEmployeesInSameDivision(targetId) {
      // Helper to safely extract division from experience JSON
      const extractDivision = (employee) => {
        try {
          const exp = JSON.parse(employee.experience);
          return exp.lists?.[0]?.division || null;
        } catch (e) {
          return null;
        }
      };

      const targetEmployee = req.employees.find(emp => emp.employeeid === targetId);
      if (!targetEmployee) return [];

      const targetDivision = extractDivision(targetEmployee);
      if (!targetDivision) return [];
      const filteredEmployees = req.employees.filter(emp => extractDivision(emp) === targetDivision);
      return JSON.stringify(filteredEmployees) || null;
    },
    getEmployeedDetailsById(id) {
      if (!req.employees || !Array.isArray(req.employees)) {
        return null;
      }
      console.log('Getting employee details for ID:', id);

      const employee = req.employees.find(emp => emp.employeeid === id);
      // const { password, ...rest } = employee
      return JSON.stringify(employee) || {};
    },
    getCurrentHolderOfTransaction(transaction_id) {
      const activity = activities
        .filter(act => act.product_id === transaction_id && act.status === 'pending' && act.assigned_to);
      return (activity.length > 0) ? activity[0].assigned_to : false;
    },

  };

  const { SESSION_USER, SESSION_USER_LOG, SUMMARY } = res.locals
  // console.log('Session User:', { SUMMARY });

  next();
});

const loadAllTransactions = async (req, res, next) => {
  try {
    res.locals.transactions = await connection.getTransactions();
    next();
  } catch (error) {
    console.error("Error loading transactions:", error);
    res.status(500).send("Internal Server Error: Middleware Load Transactions");
  }
}
const loadAllEmployees = async (req, res, next) => {
  try {
    const employees = await connection.getEmployees();
    req.employees = employees;
    res.locals.employees = employees;
    next();
  } catch (error) {
    console.error("Error loading employees:", error);
    res.status(500).send("Internal Server Error: Middleware Load Employees");
  }
}
const loadAllActivities = async (req, res, next) => {
  try {
    res.locals.activities = await connection.getActivities();
    next();
  } catch (error) {
    console.error("Error loading activities:", error);
    res.status(500).send("Internal Server Error: Middleware Load Activities");
  }
}
const loadAllSuppliers = async (req, res, next) => {
  try {
    res.locals.SUPPLIERS = await connection.getSuppliers();
    next();
  } catch (error) {
    console.error("Error loading suppliers:", error);
    res.status(500).send("Internal Server Error: Middleware Load Suppliers");
  }
}

function restrict(req, res, next) {
  // If user is authenticated, proceed
  if (req.session && req.session.isAuthenticated) {
    return next();
  }
  // If not authenticated, redirect to login (always redirect, regardless of environment)
  return res.redirect('/login');
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

app.get('/', restrict, loadAllTransactions, loadAllActivities, async function(req, res){
   const [
    totalApprovedBudget,
    countPerPRClassification,
    cardsData,
    dataFromLast7Days
  ] = await Promise.all([
    connection.getTotalApprovedBudget(),
    connection.countPerPRClassification(),
    connection.cardsData(),
    connection.getDataFromLast7Days('remarks', 'date')
  ]);
 
  var charts = cardsData.reduce((acc, { table_name, row_count, total_sum }) => {
    acc[table_name] = { row_count, total_sum };
    return acc;
  }, {});

  const safeCardsData = charts || { employees: { row_count:0, total_sum:0 }, transactions: { row_count:0, total_sum:0 }, notifications: { row_count:0, total_sum:0 } };

  console.log({charts})

  const perPRClassification = countPerPRClassification.reduce((acc, { pr_classification, item_count }) => {
    acc[pr_classification] = item_count;
    return acc;
  }, {});

  console.log('charts', perPRClassification)
  
  res.render('index', {
    title: "Dashboard",
    header: "Some users", 
    totalApprovedBudget: JSON.stringify(totalApprovedBudget[0]),
    perClassification: JSON.stringify(perPRClassification),
    tableDashboard: JSON.stringify(dataFromLast7Days),
    cardsData: safeCardsData,
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
    innerContent: '../employees/index2',
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
  res.status(404).render('404', {
    title: 'Page Not Found',
    component: 'Page'
  });
});

app.get('/unauthorized', (req, res) => {
  res.status(404).render('unauthorized', {
    title: 'Page Not Found',
    component: 'Page'
  });
});

app.get('/login', async (req, res) => {
  try {
    const guestToken = req.query.guest_token;

    // 🔐 Guest Token Login via GET
    if (guestToken) {
      const guest = await connection.findGuestToken(guestToken);

      if (!guest || guest.status !== 'active') {
        req.session.error = 401;
        return res.status(404)
      }

      const token = jwt.sign({ guestId: guest.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

      req.session.user = guest;
      req.session.isAuthenticated = true;
      req.session.token = token;
      req.session.isGuest = true;

      return res.redirect('/guest-dashboard');
    }
    if(req.session.user && req.session.isAuthenticated) {
      return res.redirect('/')
    }
    // 🧭 No token? Show login page
    res.render('login', { error: req.session.error || null, title: "Login", guestToken: uuidv4() });
  } catch (error) {
    console.error('Guest login error:', error);
    res.status(500).send('Internal Server Error');
  }
}); 

app.post('/login', async (req, res) => {
  try {
    const guestToken = req.query.guest_token;

    // 🔐 Guest Token Login
    if (guestToken) {
      const guest = await connection.retrieveGuestByToken(guestToken);

      if (!guest || guest.status !== 'active') {
        req.session.error = 401;
        return res.redirect('/login');
      }

      const token = jwt.sign({ guestId: guest.id }, 'secret_key', { expiresIn: '1h' });

      req.session.user = guest;
      req.session.isAuthenticated = true;
      req.session.token = token;
      req.session.isGuest = true;

      return res.redirect('/');
    }

    // 👤 Standard Username/Password Login
    const { username, password, roles } = req.body;
    if (!username || !password) {
      return res.status(400).json({ message: 'Username and password are required.' });
    }

    if(roles && roles.includes('SuperAdmin')) {
      req.session.isSuperAdmin = true;
    }

    const userDetails = await connection.retrieveEmployeeByUsername(username);
    if (userDetails.length === 0) {
      req.session.error = 404;
      return res.redirect('/login');
    }

    const user = userDetails[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) {
      req.session.error = 401;
      return res.redirect('/login');
    }

    const token = jwt.sign({ username }, 'secret_key', { expiresIn: '1h' });

    req.session.user = user;
    req.session.isAuthenticated = true;
    req.session.token = token;
    req.session.isGuest = false;

    return res.redirect('/');
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred while processing your request.' });
  }
});

app.get('/token', async (req, res) => {
  const guestToken = req.query.guest_token;
  const guest = {
    token: guestToken,
    created_at: new moment().format('YYYY-MM-DD HH:mm:ss'),
    expires_at: new moment().add(1, 'hours').format('YYYY-MM-DD HH:mm:ss'),
    status: 'active',
    meta:{
      ip: req.ip,
      user_agent: req.headers['user-agent'],
      origin: 'guest_account_link',
      login_time: new moment().format('YYYY-MM-DD HH:mm:ss'),
      remarks: 'Auto-login via token'
    }
  }
  console.log('Storing guest token:', guest)
  const result = await connection.storeGuestToken(guest)
  if(result) {
    const guestUser = {
      employeeid: guestToken,
      username: 'Guest_User',
      email: 'guest@example.com',
      firstname: 'Guest',
      lastname: 'User', 
      middlename: '',
      extname: '',
      birthdate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
      experience: {
        lists: [{
          office: 'DA - RFO7',
          division: 'GUEST',
          section: 'User',
          salary: '123456',
          status: true,
          enddate: 'present',
          position: 'Data Controller X',
          startdate: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
          employment: 'Permanent',
          arrangements: 'On-site', 
        }],
      },
      contacts: JSON.stringify({
        email: 'justtest@gmail.com',
        mobile: '09913983598',
      }),
      others: JSON.stringify({
        civilstatus: 'Married',
        gender: 'Male'
      }),
      components: ['Transactions'],
      roles: JSON.stringify(['Guest'])
    }

    let { experience } = guestUser
    experience = JSON.stringify(experience)

    guestUser.experience = experience

    req.session.user = res.locals.SESSION_USER = guestUser;
    req.session.isAuthenticated = true;
    req.session.isGuest = true;

  }

  return res.redirect('/')
})

// app.get('/logout', function(req, res){
//   // destroy the user's session to log them out
//   // will be re-created next request
//   req.session.destroy(function(){
//     res.redirect('/login');
//   });
// });

app.get('/logout', async (req, res) => {
  const isGuest = req.session.isGuest;
  const guestToken = req.session.user?.employeeid;

  if (isGuest && guestToken) {
    const logoutMeta = {
      ip: req.ip,
      user_agent: req.headers['user-agent'],
      logout_time: new moment().format('YYYY-MM-DD HH:mm:ss'),
      remarks: 'Guest manually logged out'
    };

    await connection.markGuestTokenUsed({
      token: guestToken,
      status: 'used',
      expires_at: new moment().format('YYYY-MM-DD HH:mm:ss'),
      meta: JSON.stringify(logoutMeta)
    });
  }

  req.session.destroy(() => {
    res.redirect('/login');
  });
});

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

  res.render('register', {
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
    console.log({hashedPassword: (set.password) });
    console.log({hashedPassword: bcrypt.hashSync('Admin123!', 8)});

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

app.get('/transactions', restrict, loadAllEmployees, async (req, res) => {
  try {
    const userId = req.session?.user?.employeeid;

    if (!userId) {
      return res.status(403).send('Unauthorized access');
    }

    const [transactions, activities] = await Promise.all([
      connection.retrieveTransactions(),
      connection.getTransactionActivity()
    ]);

    const filteredActivity = activities.filter(activity =>
      activity.assigned_to === userId
    );

    const productIds = filteredActivity.map(activity => activity.product_id);
    
    const numericUserId = Number(userId);

    const parsedTransactions = transactions.map(txn => ({
      ...txn,
      prepared_by: typeof txn.prepared_by === 'string'
        ? JSON.parse(txn.prepared_by)
        : txn.prepared_by
    }));

    const filteredTransactions = parsedTransactions.filter(txn =>
      txn.prepared_by?.employeeid === numericUserId || productIds.includes(txn.product_id)
    );

  
    res.render('transactions/index', {
      title: 'Transactions',
      transactions: res.locals.isGuest() || res.locals.isSuperAdmin()  ? transactions : filteredTransactions,
      moment,
      connection,
      predata: _preTransactionsData,
      path: req.url,
      steps: activities.sort((a, b) => b.id - a.id),
      peso
    });

  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/transactions/new', restrict, async (req, res) => {
  try {
      res.render('transactions/new', { 
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
      res.render('transactions/scan', { 
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
    const { assigned_to, ...transactionData } = req.body;
    const transactions = await connection.postTransactions( transactionData );

    if(transactions?.affectedRows){
      const { insertId } = transactions
      const data = {
        "message": "New transaction was created",
        "link": insertId, 
        "component": "transactions",
      }
      await connection.postTransactionActivity(JSON.stringify({
        steps_number: 2,
        product_id: insertId,
        status: "pending",
        assigned_to,
      }))
      await connection.postNotifications(JSON.stringify(data))      
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

app.post('/transactions/assign', async (req, res) => {
  const { transactions: rawTransactions } = req.body;
  const assigned_to = res?.locals?.SESSION_USER?.employeeid;

  try {
    const transactions = JSON.parse(rawTransactions); // Ensure it's an array

    const results = await Promise.all(
      transactions.map(txn => connection.getTransactionByQRCode(txn))
    );

    console.log('Assigning transactions:ASSDA ', { transactions, results });

    if (results.includes(null)) {
      return res.status(400).json({ status: 400, message: 'One or more transactions not found.' });
    }

    for (const result of results) {
      const txn = result?.[0]; // Safely access RowDataPacket

      if (!txn || !txn.product_id) {
        console.warn('Invalid transaction data:', result);
        continue; // Skip this iteration
      }

      const getAllSteps = await connection.getTransactionActivityId(
        JSON.stringify({ product_id: txn.product_id })
      );

      const getCurrentStep = Array.isArray(getAllSteps) && getAllSteps.length
      ? parseInt(getAllSteps[getAllSteps.length - 1].steps_number, 10) || 0
      : 1;

      const data = {
        set: { assigned_to, updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss') },
        where: { status: 'pending', product_id: txn.product_id, steps_number: getCurrentStep }
      };

      // console.log('Updating transaction activity with data:', { data  } );

      await connection.updateTransactionActivity(JSON.stringify(data));
    }

    res.status(200).json({ status: 200, message: 'Transactions assigned successfully.' });

  } catch (error) {
    console.error('Error assigning transaction:', error);
    res.status(500).json({ status: 500, message: 'Error assigning transaction.' });
  }
});


app.post('/transactions/assignedto', async (req, res) => {
  try {
    const { transactions } = req.body;
    const mappedTransactions = transactions.map(txn => ({ product_id: txn.product_id }));

    const results = await Promise.all(mappedTransactions.map(async (txn) => {
      const data = {
        set: {
          assigned_to: txn.assigned_to,
        },
        where: {
          product_id: txn.product_id,
          steps_number: txn.steps_number
        }
      }

      await connection.updateTransactionActivity(JSON.stringify(data))
    }))
    console.log({results})
    res.status(200).json({ message: 'Transaction assigned successfully.' })
  } catch (error) {
    console.error('Error assigning transaction:', error)
    res.status(500).json({ message: 'Error assigning transaction.' })
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
      res.render('transactions', { 
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
      res.render('transactions/new', { 
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

app.get('/transactions/:id/view', restrict, loadAllEmployees, loadAllActivities, loadAllSuppliers, async (req, res) => {
  try {
    const transid = req.params.id;

    const [transactions, remarks, steps, suppliers] = await Promise.all([
      connection.getTransactionById(transid),
      connection.getRemarksByRefid(transid),
      connection.getTransactionActivityId(JSON.stringify({ product_id: transid })),
      connection.getTransactionSuppliers({ transaction_id: transid })
    ])

    const filteredActivities = res.locals.activities
    .filter(activity => activity.product_id === Number(transid));

    console.log('filteredActivities', filteredActivities)
    console.log('remarks', remarks)

    // expressActivityLog(filteredActivities)

    if(transactions[0]) {
      res.render('transactions/view', { 
        title: 'Transactions: Remarks',
        transactions: transactions[0],
        remarks: remarks.sort((a, b) => b.id - a.id),
        moment: moment,
        path: res.url,
        query: transid,
        steps: steps.sort((a, b) => b.id - a.id),
        _suppliers: JSON.stringify(suppliers),
      }); // Pass the data to the template
      
    } else {
      res.render('404', {
        title: '404 Transaction Not Found',
        referer: req.referer,
        component: 'Transaction',
        steps
      });
    }
  } catch (error) {
      console.error('Error displaying transaction:', error);
      // res.status(500).send('Internal Server Error');
      res.status(404).render('404', {
        title: "404 Page not found",
        component: "Transaction"
      });
  }
})

app.get('/transactions/:id/print', restrict, async (req, res) => {
  try {
    const transid = req.params.id;
    
    const [transactions, remarks] = await Promise.all([
      connection.getTransactionById(transid),
      connection.getRemarksByRefid(transid)
    ])

    if (transactions[0]) {
      res.render('transactions/print', { 
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
    res.status(404).render('404');
  }
})

app.post('/transactions/:id/suppliers', restrict, async (req, res) => {
  try {
    const transid = req.params.id;
    console.log('req.body', req.body)
    const results = await connection.postTransactionSuppliers(JSON.stringify({
      refid: transid,
      suppliers: req.body.suppliers,  
    }))
    console.log({ results })
    if(results?.affectedRows){
      res.status(200).json({ status: 200, message: 'Suppliers successfully added to the transaction.' })
    } else {
      res.status(500).json({ status: 500, message: 'Failed to add suppliers to the transaction.' })
    } 
  } catch (error) {
    console.error('Error saving Transactions suppliers:', error);
    res.status(404).render('404', {
      title: "404 Page not found",
      component: "Transaction"
    });
  }
})
app.delete('/transactions/:id/status', restrict, async (req, res) => {
  try {
    const fullname = `${res.locals.SESSION_USER.firstname} ${res.locals.SESSION_USER.lastname}`;
    const employeeid = res.locals.SESSION_USER.employeeid
    
    const data = { 
      pr_id: req.params.id,
      previous_status: 'draft',
      new_status: 'deleted',
      // changed_by: JSON.stringify({ employeeid, name: fullname })
      changed_by: employeeid
    };

    const results = await connection.postTransactionsStatus( JSON.stringify(data) )

    return results ? 
    res.status(200).json({ status: 200, message: 'Transaction status successfully updated.' }) : 
    res.status(500).json({ status: 500, message: 'Failed to delete the transactions.'})

  } catch (error) {
    console.error('Error updating transaction status:', error);
    res.status(500).send('Internal Server Error');
  }
})
app.delete('/transactions/:id/testing', restrict, async (req, res) => {
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

    const [ remarks, transactions, steps ] = await Promise.all([
      connection.getRemarksByRefid(transId),
      connection.getTransactionById(transId),
      connection.getTransactionActivity()
    ]);

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
    res.render('partials/activity-feed', {
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
    const data = { ...req.body };
    const { employeeid, username } = res.locals.SESSION_USER;
    // 🚨 Trap if employeeid is missing or empty
    if (!employeeid) {
      return res.status(400).json({ message: 'Invalid or missing employee ID.' });
    }
    
    // Remove user from payload and attach session username
    // delete data.user;
    const updatedRemarks = { ...data};
    updatedRemarks.user = username
    updatedRemarks.date = moment().format('YYYY-MM-DD HH:mm:ss');
    
    // ✅ Normalize refid
    let flattenedRefIds = [];
    try {
      const parsed = JSON.parse(updatedRemarks.refid);
      flattenedRefIds = Array.isArray(parsed) ? parsed.map(String) : [Number(parsed)];
    } catch {
      flattenedRefIds = [Number(updatedRemarks.refid)];
    }
    
    // ✅ Attach normalized refid
    // updatedRemarks.refid = JSON.stringify(1);

    // ✅ Handle dueDate if it's a number (offset in days)
    if (typeof updatedRemarks.dueDate === 'number') {
      updatedRemarks.dueDate = moment().add(updatedRemarks.dueDate, 'days').format('YYYY-MM-DD');
    }
    if(updatedRemarks.assignedto === true) {
      updatedRemarks.assignedto = employeeid
    }

    // ✅ Post remarks
    const remarksResults = await Promise.all(
      flattenedRefIds.map(refid => {
        const remarkPayload = {
          ...updatedRemarks,
          refid,
        };
        return connection.postRemarks(JSON.stringify(remarkPayload))
          .then(result => ({ refid, result }))
          .catch(error => ({ refid, error }));
      })
    );


    // const remarks = await connection.postRemarks(JSON.stringify(updatedRemarks));

    // ✅ Get current step using first refid
    const getCurrentStep = await connection.getTransactionActivityId(
      JSON.stringify({ product_id: flattenedRefIds[0] })
    );

    const currentStepNumber = Array.isArray(getCurrentStep) && getCurrentStep.length
      ? parseInt(getCurrentStep[getCurrentStep.length - 1].steps_number, 10) || 0
      : 1;

    // ✅ Post transaction activity if assignedto is true
    if (updatedRemarks.assignedto === true) {

      const activityPayloads = flattenedRefIds.map(id => {
        const productId = parseInt(id, 10);
        if (!Number.isInteger(productId)) {
          console.warn(`Invalid product_id: ${id}`);
          return null;
        }

        return {
          status: 'pending',
          // steps_number: currentStepNumber + 1,
          steps_number: currentStepNumber,
          assigned_to: employeeid,
          product_id: productId,
          created_at: moment().format('YYYY-MM-DD HH:mm:ss'),
          created_by: username,
        };
      }).filter(Boolean); // Remove nulls

      await Promise.all(
        activityPayloads.map(payload => {
          console.log('payload', payload);
          return connection.postTransactionActivity(JSON.stringify(payload));
        })
      );
    }

    // ✅ Handle notifications if remarks were posted
    // if (remarks?.affectedRows) {
    if (remarksResults.length) {
      const handleNotification = async (id) => {
        const transactions = await connection.getTransactionById(id);
        if (!transactions?.length) {
          console.error('No transactions found for id:', id);
          return;
        }

        const { requisitioner } = transactions[0];
        // console.log('transactions:', transactions);

        const notificationPayload = {
          message: `New remark is added under ${id}!`,
          link: id,
          component: 'remarks',
          // concerning: requisitioner,
        };

        await connection.postNotifications(JSON.stringify(notificationPayload));
      };

      await Promise.all(flattenedRefIds.map(id => handleNotification(id)));

      res.status(200).json({
        message: 'New remark added successfully!',
        // response: remarks,
      });
    } else {
      res.status(200).json({ message: 'Failed to post new remark!' });
    }
  } catch (error) {
    console.error('Error adding new remark:', error);
    res.status(500).send('Error adding new remark');
  }
});

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
  // const roles = await connection.retrieveEmployeeIdsWithRole()
  // console.log(employees)
  res.render('employees/index', {
    title: 'Employees',
    employees: JSON.stringify(employees),
    // roles,
  })
})

app.get('/employees/new', restrict, function(req, res){
  res.render('employees/new', {
    defaultData: _preDefaultData,
    title: 'Add Employee', 
    path: res.url,
    moment
  })
})

app.get('/employees/:id/profile', restrict, loadAllTransactions, async function(req, res){
  try {
    const employee = await connection.getEmployeeById(req.params.id);
    console.log({employee})
    if(employee.length > 0) {
      res.render('employees/profile', {
        employee: employee[0],
        title: 'Profile', 
        employeeid: req.params.id,
      })
    } else {
      console.error('Employee not found!');
      res.render('404', {
        title: '404 Employee Not Found',
        referer: req.referer,
        component: 'Employee'
      });
    }
  } catch (error) {
    console.error('Error retrieving employee:', error);
    res.status(500).render('404');
  }
})

// Utility function to fetch roles and employees
async function getFormData(employeeId = null) {
  const employees = employeeId
    ? await connection.getEmployeeById(employeeId)
    : await connection.getEmployees();

  return {
    employees: employeeId ? employees[0] : employees,
  };
}

// Register Employee Route
app.get('/employees/register', restrict, async (req, res) => {
  try {
    const { roles, employees } = await getFormData();
    res.render('employees/register', {
      title: 'Register Employee',
      employees,
      mode: 'register',
    });
  } catch (error) {
    console.error('Error loading register form:', error);
    res.status(500).send('Internal Server Error');
  }
});

// Update Employee Route
app.get('/employees/:id/update', restrict, async (req, res) => {
  try {
    const employeeId = req.params.id;
    const { roles, employees } = await getFormData(employeeId);

    res.render('employees/register', {
      title: 'Update Employee',
      employees,
      mode: 'update',
    });
  } catch (error) {
    console.error('Error loading update form:', error);
    res.status(500).send('Internal Server Error');
  }
});

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
  res.render('inventory/', {
    title: "Inventory"
  })
})

app.get('/qrscanner', restrict, async function(req, res){
  res.render('scanner', {
    title: "Scan QR Code"
  })
})
app.get('/suppliers', restrict, loadAllSuppliers, async function(req, res){
  res.render('suppliers/index', {
    title: "Suppliers"
  })
})
app.get('/suppliers/:id/view', restrict, loadAllSuppliers, async function(req, res){
  try {
    const supplier = await connection.getSuppliersById(req.params.id);
    console.log({supplier})
    
    res.render('suppliers/profile', {
      title: "Suppliers",
      results: supplier[0],
    })
    
  } catch (error) {
    console.error('Error retrieving supplier:', error);
    res.status(500).render('404');
  }
  
})
app.get('/suppliers/new', restrict, async function(req, res){
  res.render('suppliers/new', {
    title: "Suppliers"
  })
})
app.post('/suppliers/add', restrict, async function (req, res) {
  try {
    const {
      supplier_code,
      supplier_name,
      contact_person,
      email,
      phone,
      address,
      status
    } = req.body;

    // Defensive: check if all fields are empty
    console.log('Received supplier data:', req.body);
    const allEmpty = [supplier_code, supplier_name, contact_person, email, phone, address, status]
      .every(field => !field || field.trim() === '');

    if (allEmpty) {
      return res.status(400).json({ error: 'All fields are empty. Please provide supplier details.' });
    }

    // Insert into DB (example using MySQL with async/await)
    const result = await connection.postSuppliers(JSON.stringify(req.body));
    console.log('Supplier added with ID:', result);
    res.status(200).json({ message: 'Supplier added successfully.' });
  } catch (error) {
    console.error('Error adding supplier:', error);
    res.status(500).json({ error: 'Internal server error.' });
  }
});
// DOCUMENTS
app.get('/documents', restrict, async function(req, res){
  const results = await connection.getDocumentTrackerData()
  let analysisData = await connection.getDocumentTrackerAnalysis()
  let analysisDataReplies = await connection.getDocumentTrackerActivityReplies()
  // console.log(analysisData)
  analysisData = analysisData[0]
  analysisDataReplies = analysisDataReplies[0]

  res.render('documents/index', {
    title: 'Documents',
    displayData: results,
    analysis: {analysisData, analysisDataReplies},
  })
})

app.get('/documents/template/newEmail', restrict, function(req, res) {
  res.render('emails/new2', {
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
        res.render('unauthorize', {
          title: "Unauthorized Access", 
        })
      } else { 
        res.render('documents/id', {
          title: "Document", 
          displayData: results[0], 
          activities: activities.sort((a, b) => b.id - a.id),
          employeesData: employees,
        })
      }
    }
    
  } catch (error) {
    console.error('Error on displaying the document:', error);
    res.status(404).render('404', {
      title: "Document", 
      component: "Document"
    });
  }
})

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
  
  res.render('documents/calendar', {
    title: 'Calendar',
  })
})


// Express route to approve a step
app.post("/approve", async (req, res) => {
  // const { trans_id: prId, steps_number:stepNumber, updated_by:approverName } = req.body;
  const { product_id, steps_number, updated_by, remarks } = req.body;
  const { username } = res.locals.SESSION_USER
  try {
    // console.log([trans_id, steps_number, updated_by]) 
    const data = {
      set: {
        status: 'approved',
        updated_by,
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        remarks
      },
      where: {
        product_id,
        steps_number,
      }
    }
    // console.log('data', {data, steps_number})
    await connection.updateTransactionActivity(JSON.stringify(data))
    io.emit('retrieveActitivities', product_id);
    // if(steps_number > 1) {
    //   await connection.postRemarks(JSON.stringify({
    //     comment: 'Out of Office', 
    //     user: username, 
    //     status: 'success', 
    //     refid: product_id,
    //     date: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
    //   }))
    // }
   
    // console.log([trans_id, steps_number + 1])
    await connection.postTransactionActivity(JSON.stringify({
      status: 'pending', 
      product_id, 
      created_at: moment(new Date()).add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
      steps_number: parseInt(steps_number, 10) + 1,
      updated_by, 
    }))

    await connection.postNotifications(JSON.stringify({
      message: remarks,
      link: product_id,
      component: 'transactions',
    }))

    res.json({ success: true, message: "Approval step advanced." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to advance approval." });
  }
});

app.post("/disapprove", async (req, res) => {
  const { product_id, steps_number, remarks, updated_by } = req.body;
  console.log('disapprove steps', {product_id, steps_number, remarks})
  try {
    const data = {
      set: {
        status: 'disapproved',
        updated_by, 
        updated_at: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
        remarks
      },
      where: {
        product_id,
        steps_number,
      }
    }
    const updateResult = await connection.updateTransactionActivity(JSON.stringify(data))

    // console.log([trans_id, steps_number + 1])
    // await connection.postTransactionActivity(JSON.stringify({
    //   status: 'pending', 
    //   product_id, 
    //   created_at: moment(new Date()).add(1, 'minute').format('YYYY-MM-DD HH:mm:ss'),
    //   steps_number: parseInt(steps_number, 10),
    //   updated_by, 
    // }))

    updateResult ? res.status(200).json({ success: true, message: "Request has been disapproved." }) : null;
    // 
  } catch (error) {
    console.error(error);
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
    if (transaction) return res.status(200).json({ response: transaction });
    return res.status(404).json({ response: 'Transaction Not Found!' });
  });
app.route('/api/employees/:id')
  .all(restrict)
  .get(async (req, res) => {
    const { id } = req.params;
    const employees = await connection.getEmployeeById(id);

    if (!employees || employees.length === 0) {
      return res.status(400).json({ response: 'No Record is Found!' });
    }

    // Decode and sanitize each employee record
    const sanitized = employees.map(emp => {
      const {
        password, // omit
        experience,
        contacts,
        others,
        components,
        roles,
        ...rest
      } = emp;

      return {
        ...rest,
        experience: JSON.parse(experience || '{}'),
        contacts: JSON.parse(contacts || '{}'),
        others: JSON.parse(others || '{}'),
        components: JSON.parse(components || '[]'),
        roles: JSON.parse(roles || '[]')
      };
    });

    return res.status(200).json({ response: sanitized });
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

    let results = await connection.getTransactionByQRCode(id)
    
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

// SETTINGS page
// Status: Super Admin only, restrict to access
app.get('/settings', restrict, async function(req, res){
  try {
    const results = await connection.getSettings() ?? {}
    let employees = await connection.retrieveEmployee()
    const { username } = res.locals.SESSION_USER
    employees.sort((a, b) => 
      a.lastname.toLowerCase() < b.lastname.toLowerCase() ? -1 : 
      (a.lastname.toLowerCase() > b.lastname.toLowerCase() ? 1 : 0)
    );

    if (res.locals.isSuperAdmin()) { // user is admin

      const results = await connection.getSettings();
      // Convert rows into { key_name: value } object for easy mapping to inputs
      const mapped = {};
      results.forEach(row => {
        mapped[row.key_name] = row.value;
      });

      // res.status(200).json({ settings: mapped });

      return res.render('settings', {
        title: "Settings",
        settings: JSON.parse(JSON.stringify(results)),
        employees: JSON.parse(JSON.stringify(employees)),
        settings: mapped,
      })
    }
    res.status(404).render('unauthorized', {
      title: 'Page Not Found',
      component: 'Page'
    });
  } catch (error) {
    res.status(404).render('404', {
      title: 'Page Not Found',
      component: 'Page'
    });
  }
})

app.post('/settings', restrict, async function(req, res){
  try {
    const settingsData = req.body
    const values = settingsData.map(item => [item.key_name, item.key_value, 'string', null, 1]);

    const results = await connection.postSettings(values)
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
  res.render('request',{
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

    res.render('media', {
      title: 'Media Gallery',
      files: fileData,
      basePath: '/uploads'
    });
  });
});



app.use(async function(req, res, next){
  res.status(404).render('404', {
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





// io.on('connection', (socket)=>{
//   console.log('a user connected', socket.id)
// })

// ENDOF ExpressJS
server.on('error', (err) => {
  console.error('Server error:', err);
});

server.listen(SERVER_PORT, '0.0.0.0', () => {
  logger.info(`Server running on port ${SERVER_PORT}`);
  console.log('Server started on', SERVER_PORT);
});
