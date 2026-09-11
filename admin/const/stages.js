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

const newResponsiblePersonAtStages = {
  "End-User": [
    "prepared_by",
    "pr_preparation",
    "final_review",
    "acceptance",
    "final_acceptance",
    "inspection_scheduling",
    "documentation",
    "turnover_docs",
    "voucher_signing",
    "ors_burs_signing",
    "project_implementation"
  ],

  "Program Coordinator": [
    "pr_preparation",
    "final_review",
    "ors_burs_signing"
  ],

  "Division Chief": [
    "division_head_approval",
    "final_review",
    "approval_pr",
    "ors_burs_signing",
    "voucher_approval"
  ],

  "Budget Section": [
    "budget_earmarking",
    "fund_allocation",
    "funding_allocation",
    "obligation_numbering",
    "budget_endorsement"
  ],

  "Procurement Section": [
    "pr_numbering",
    "quotation_form_preparation",
    "procurement_finalization",
    "award_preparation",
    "po_preparation",
    "po_contract_preparation"
  ],

  "Procurement Unit (PU)": [
    "canvass_preparation",
    "distribution_of_canvass",
    "abstract_and_resolution",
    "noa_confirmation_and_po_joc"
  ],

  "BAC Secretariat": [
    "bac_review",
    "bac_evaluation",
    "delivery_confirmation",
    "review_and_posting",
    "bid_opening",
    "award_segregation",
    "posting_of_award",
    "posting_po_joc_ntp",
    "bac_resolution",
    "posting_update",
    "award_preparation"
  ],

  "BAC Members": [
    "bac_evaluation"
  ],

  "BAC 1 & 2": [
    "bac_signing_and_twg_eval"
  ],

  "BAC/BAC Secretariat": [
    "bidding_process",
    "bidding_preparation"
  ],

  "Canvassers": [
    "canvassing",
    "supplier_serving"
  ],

  "Supplier/Contractors": [
    "supplier_engagement"
  ],

  "Suppliers/Contractors": [
    "bid_submission"
  ],

  "RED/RTD": [
    "executive_review",
    "executive_approval",
    "executive_signoff",
    "delivery_approval",
    "voucher_approval",
    "final_signoff",
    "noa_and_resolution_approval",
    "po_joc_approval",
    "ntp_approval",
    "approval_pr",
    "po_contract_approval",
    "check_signing"
  ],

  "RTD": [
    "executive_review",
    "noa_and_resolution_approval",
    "po_joc_approval",
    "ntp_approval"
  ],

  "Admin Chief": [
    "final_signoff",
    "check_signing"
  ],

  "Accounting Section": [
    "obligation_request",
    "voucher_preparation",
    "liquidation",
    "po_joc_processing",
    "voucher_processing",
    "funds_availability",
    "ada_review"
  ],

  "General Services Section": [
    "delivery_preparation",
    "supplier_confirmation",
    "ntp_confirmation",
    "project_implementation",
    "voucher_preparation"
  ],

  "GSS": [
    "canvass_signing",
    "serving_po_joc",
    "project_implementation"
  ],

  "GS": [
    "inspection_scheduling",
    "documentation"
  ],

  "RAED": [
    "inspection_scheduling",
    "project_implementation",
    "inspection"
  ],

  "Inspectors": [
    "inspection"
  ],

  "TWG Concerned": [
    "evaluation"
  ],

  "Cashiering Unit": [
    "payment_processing",
    "fund_release",
    "check_preparation",
    "release_payment"
  ]

};

module.exports = { responsiblePersonAtStages, newResponsiblePersonAtStages };