const responsiblePersonAtStages = {
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

module.exports = { responsiblePersonAtStages };