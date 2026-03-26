const miscellaneous = {
    modesOfProcurement: ["Small Value Procurement", "Competitive Bidding", "Limited Source Bidding", "Direct Contracting", "Repeat Order", "Shopping", "Negotiated Procurement", "Emergency Procurement", "Direct Procurement from Government Entities", "Community Participation",  "Public-Private Partnership (PPP) Procurement", "Other Fit-for-Purpose Modalities"],
    classification: ['Catering Services', 'Consumables', 'Food & Accommodation', 'Freight & Handling', 'Goods', 'Infrastructure', 'Machineries & Equipment', 'Motor Vehicle', 'Repair & Maintenance', 'Services(JO/COS)', 'Training', 'Training & Representation', 'Others'],
    banner_program: ['', 'Corn', 'GASS', 'HVCDP', 'Livestock', 'NUPAP', 'Organic', 'Rice', 'SAAD', 'STO', 'Others'],
    bac_unit: ['BAC 1', 'BAC 2', 'Others'],
    divisions: ['', "ADMIN", "AMAD", "FOD", "ILD", "ICT", "PMED", "RAED", "REGULATORY", "RESEARCH", "Others"],
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

module.exports = {miscellaneous, purchaseRequestRoles};