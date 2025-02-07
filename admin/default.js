const positions = [
    {
      category: "Executive Level",
      positions: [
        "Secretary of Agriculture",
        "Undersecretary",
        "Assistant Secretary"
      ]
    },
    {
      category: "Regional and Provincial Offices",
      positions: [
        "Regional Director",
        "Provincial Director"
      ]
    },
    {
      category: "Technical and Sectoral Positions",
      positions: [
        "Agriculture Program Officer",
        "Agricultural Technologist",
        "Agronomist",
        "Veterinarian",
        "Fisheries Officer",
        "Irrigation Specialist",
        "Soil Scientist",
        "Rural Development Officer",
        "Extension Officer"
      ]
    },
    {
      category: "Support and Administrative Positions",
      positions: [
        "Administrative Officer",
        "Finance Officer",
        "Legal Officer",
        "Human Resource Officer"
      ]
    },
    {
      category: "Specialized Units and Agencies",
      subcategories: [
        {
          agency: "National Irrigation Administration (NIA)",
          positions: [
            "Irrigation Engineer",
            "Project Manager",
            "Technical Assistant"
          ]
        },
        {
          agency: "Philippine Coconut Authority (PCA)",
          positions: [
            "Coconut Specialist",
            "Technical Advisor",
            "Research Assistant"
          ]
        },
        {
          agency: "Bureau of Fisheries and Aquatic Resources (BFAR)",
          positions: [
            "Fisheries Technologist",
            "Aquaculture Specialist",
            "Marine Biologist"
          ]
        },
        {
          agency: "Bureau of Animal Industry (BAI)",
          positions: [
            "Veterinarian",
            "Animal Health Officer",
            "Livestock Specialist"
          ]
        },
        {
          agency: "National Food Authority (NFA)",
          positions: [
            "Grain Inspector",
            "Warehouse Supervisor",
            "Supply Chain Manager"
          ]
        },
        {
          agency: "Agricultural Credit Policy Council (ACPC)",
          positions: [
            "Loan Officer",
            "Credit Specialist",
            "Financial Analyst"
          ]
        },
        {
          agency: "National Agricultural and Fishery Council (NAFC)",
          positions: [
            "Consultant",
            "Policy Advisor"
          ]
        }
      ]
    },
    {
      category: "Research and Development",
      positions: [
        "Researcher",
        "Plant Pathologist",
        "Entomologist"
      ]
    },
    {
      category: "Other Positions",
      positions: [
        "Community Organizer",
        "Project Manager",
        "Monitoring and Evaluation Officer"
      ]
    }
];
const roles = [
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
const divisions = {
    "ORED": {
      stands: "Office of Regional Executive Director",
      email: "",
      admin: "",
    }, 
    "ADMIN": {
      stands: "Administrative and Finance Division",
      email: "",
      admin: "",
    },
    "AMAD": {
      stands: "Agribusiness and Marketing Assistance Division",
      email: "",
      admin: "",
    },
    "FOD": {
      stands: "Field Operations Division",
      email: "",
      admin: "",
    },
    "ILD": {
      stands: "Integrated Laboratory Division",
      email: "",
      admin: "",
    },
    "ICT": {
      stands: "Information and Communications Technology",
      "email": "wagwag.joegie@gmail.com",
      "admin": "",
    },
    "PMED": {
      stands: "Planning, Monitoring and Evaluation Division",
      "email": "game.mrjhon8@gmail.com",
      "admin": "",
    },
    "RAED": {
      stands: "Regional Agricultural Engineering Division",
      "email": "",
      "admin": "",
    },
    "REGULATORY": {
      stands: "Regulartory Division",
      "email": "",
      "admin": "",
    },
    "RESEARCH": {
      stands: "Research Division",
      "email": "",
      "admin": "",
    }
}
const department = {
    positions,
    divisions,
    roles,
}
  
  console.log(department);
  