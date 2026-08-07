const steps = {
    svp: [
        // Purchase Request (PR) Preparation
        { id: 1, steps_title: "End-User", stage: "prepared_by" },
        { id: 2, steps_title: "Division Chief", stage: "division_head_approval" },
        { id: 3, steps_title: "Procurement Section", stage: "pr_numbering" }, // to_be removed
        { id: 4, steps_title: "Budget Section", stage: "budget_earmarking" },
        { id: 5, steps_title: "BAC Secretariat", stage: "bac_review" },
        // Canvassing
        { id: 6, steps_title: "Procurement Section", stage: "quotation_form_preparation" },
        { id: 7, steps_title: "Canvassers", stage: "canvassing" },
        { id: 8, steps_title: "Supplier/Contractors", stage: "supplier_engagement" },
        { id: 9, steps_title: "BAC & BAC Secretariat", stage: "bac_evaluation" },
        { id: 10, steps_title: "Procurement Section", stage: "procurement_finalization" },
        { id: 11, steps_title: "RED/RTD", stage: "executive_approval" },
        // Awarding
        { id: 12, steps_title: "BAC Secretariat & Procurement Section", stage: "award_preparation" },
        // Purchase Order (PO)
        { id: 13, steps_title: "Procurement Section", stage: "po_preparation" },
        { id: 14, steps_title: "End-User / Program Coordinator / Division Chief", stage: "final_review" },
        { id: 15, steps_title: "Budget Section", stage: "fund_allocation" },
        { id: 16, steps_title: "Accounting Section", stage: "obligation_request" },
        { id: 17, steps_title: "RED/RTD", stage: "executive_signoff" },
        // Delivery & Inspection
        { id: 18, steps_title: "General Services Section", stage: "delivery_preparation" },
        { id: 19, steps_title: "RED/RTD", stage: "delivery_approval" },
        { id: 20, steps_title: "BAC Secretariat", stage: "delivery_confirmation" },
        { id: 21, steps_title: "GS / RAED / End-User", stage: "inspection_scheduling" },
        { id: 22, steps_title: "Inspectors", stage: "inspection" },
        { id: 23, steps_title: "End-User", stage: "acceptance" },
        { id: 24, steps_title: "GS / End-User", stage: "documentation" },
        { id: 25, steps_title: "End-User", stage: "final_acceptance" },
        // Disbursement Voucher (DV)
        { id: 26, steps_title: "Accounting Section", stage: "voucher_preparation" },
        { id: 27, steps_title: "RED/RTD", stage: "voucher_approval" },
        // Payments
        { id: 28, steps_title: "Cashiering Unit", stage: "payment_processing" },
        { id: 29, steps_title: "Accounting Section", stage: "liquidation" },
        { id: 30, steps_title: "RED / RTD / Admin Chief", stage: "final_signoff" },
        { id: 31, steps_title: "Cashiering Unit", stage: "fund_release" }
    ],
    svp2: [
        // Purchase Request (PR) Preparation
        { id: 1, steps_title: "End-User/Program Focal", stage: "prepared_by", period: null },
        { id: 2, steps_title: "RTD", stage: "executive_review", period: null },
        { id: 3, steps_title: "Budget Section", stage: "funding_allocation", period: 1 },
        // Canvassing
        { id: 4, steps_title: "Procurement Unit (PU)", stage: "canvass_preparation", period: 2 },
        { id: 5, steps_title: "GSS", stage: "canvass_signing", period: 1 },
        { id: 6, steps_title: "BAC Secretariat", stage: "review_and_posting", period: 4 },
        { id: 7, steps_title: "Procurement Unit (PU)", stage: "distribution_of_canvass", period: 1 },
        { id: 8, steps_title: "Canvassers", stage: "supplier_serving", period: 5 },
        { id: 9, steps_title: "Suppliers/Contractors", stage: "bid_submission", period: 5 },
        { id: 10, steps_title: "BAC Secretariat", stage: "bid_opening", period: 1 },
        { id: 11, steps_title: "Procurement Unit (PU)", stage: "abstract_and_resolution", period: 7 },
        { id: 12, steps_title: "BAC 1 & 2", stage: "bac_signing_and_twg_eval", period: 3 },
        // Awarding
        { id: 13, steps_title: "BAC Secretariat", stage: "award_segregation", period: 1 },
        { id: 14, steps_title: "RTD", stage: "noa_and_resolution_approval", period: 1 },
        { id: 15, steps_title: "Procurement Unit (PU)", stage: "noa_confirmation_and_po_joc", period: 2 },
        { id: 16, steps_title: "BAC Secretariat", stage: "posting_of_award", period: 1 },
        // Purchase Order (PO)
        { id: 17, steps_title: "End-User/Division Chief", stage: "ors_burs_charging", period: 1 },
        { id: 18, steps_title: "Budget Section", stage: "obligation_numbering", period: 1 },
        { id: 19, steps_title: "Accounting Section", stage: "po_joc_processing", period: 1 },
        { id: 20, steps_title: "RTD", stage: "po_joc_approval", period: 1 },
        { id: 21, steps_title: "GSS", stage: "serving_po_joc", period: 4 },
        { id: 22, steps_title: "RTD", stage: "ntp_approval", period: 1 },
        // Project Implementation & Inspection
        { id: 23, steps_title: "BAC Secretariat", stage: "posting_po_joc_ntp", period: 2 },
        { id: 24, steps_title: "GS/RAED/End-User", stage: "project_implementation", period: "contract_based" },
        { id: 25, steps_title: "Inspectors", stage: "inspection", period: 3 },
        // Disbursement Voucher (DV)
        { id: 26, steps_title: "End-Users", stage: "turnover_docs", period: 5 },
        { id: 27, steps_title: "GS/End-Users", stage: "voucher_preparation", period: 2 },
        { id: 28, steps_title: "End-Users", stage: "voucher_signing", period: 1 },
        { id: 29, steps_title: "Accounting Section", stage: "voucher_processing", period: 1 },
        { id: 30, steps_title: "Division Chief", stage: "voucher_approval", period: 1 },
        // Payments
        { id: 31, steps_title: "Cashiering Unit", stage: "check_preparation", period: 2 },
        { id: 32, steps_title: "Accounting Section", stage: "ada_review", period: 1 },
        { id: 33, steps_title: "RED/RTD/Admin Chief", stage: "check_signing", period: 1 },
        { id: 34, steps_title: "Cashiering Unit", stage: "release_payment", period: 1 }
    ],
    publicBidding: [
         // Purchase Request (PR) Preparation
        { id: 1, steps_title: "Regional Agricultural Engineering Division/End-User", stage: "prepared_by" },
        { id: 2, steps_title: "Program Coordinator End-User/Program Coordinator", stage: "pr_preparation" },
        { id: 3, steps_title: "Division Chief", stage: "division_head_approval" },
        { id: 4, steps_title: "Procurement Section", stage: "pr_numbering" },
        { id: 5, steps_title: "Budget Section", stage: "fund_allocation" },
        { id: 6, steps_title: "RED/RTD/Division Chief", stage: "approval_pr" },
        // Bidding / Evaluation
        { id: 7, steps_title: "BAC/BAC Secretariat", stage: "bidding_process" },
        { id: 8, steps_title: "TWG Concerned", stage: "evaluation" },
        { id: 9, steps_title: "BAC Secretariat", stage: "bac_resolution" },
        // Purchase Order (PO) / Contract
        { id: 10, steps_title: "Procurement Section", stage: "po_contract_preparation" },
        { id: 11, steps_title: "End-User/Program Coordinator/Div. Chief", stage: "ors_burs_signing" },
        { id: 12, steps_title: "Budget Section", stage: "budget_endorsement" },
        { id: 13, steps_title: "Accounting Section", stage: "funds_availability" },
        { id: 14, steps_title: "RED/RTD", stage: "po_contract_approval" },
        { id: 15, steps_title: "General Services Section", stage: "supplier_confirmation" },
        { id: 16, steps_title: "RED/RTD", stage: "ntp_approval" },
        { id: 17, steps_title: "General Services Section", stage: "ntp_confirmation" },
        { id: 18, steps_title: "BAC Secretariat", stage: "posting_update" },
        // Project Implementation & Inspection
        { id: 19, steps_title: "General Services Section/End-Users/Regional Agricultural Engineering Division", stage: "project_implementation" },
        { id: 20, steps_title: "Regional Agricultural Engineering Division/Inspectors", stage: "inspection" },
        { id: 21, steps_title: "End-User", stage: "turnover_docs" },
        // Disbursement Voucher (DV)
        { id: 22, steps_title: "General Services Section/End-User", stage: "voucher_preparation" },
        { id: 23, steps_title: "End-User", stage: "voucher_signing" },
        { id: 24, steps_title: "Division Chief", stage: "voucher_approval" },
        { id: 25, steps_title: "Accounting Section", stage: "voucher_processing" },
        // Payments
        { id: 26, steps_title: "Cashiering Unit", stage: "check_preparation" },
        { id: 27, steps_title: "Accounting Section", stage: "ada_review" },
        { id: 28, steps_title: "RED/RTD/Admin. Chief", stage: "check_signing" },
        { id: 29, steps_title: "Cashiering Unit", stage: "release_payment" }
    ],
    publicBidding2: [
        // Purchase Request (PR) Preparation
        { id: 1, steps_title: "Regional Agricultural Engineering Division/End-User", stage: "prepared_by" },
        { id: 2, steps_title: "Program Coordinator End-User/Program Coordinator", stage: "pr_preparation" },
        { id: 3, steps_title: "Division Chief", stage: "division_head_approval" },
        { id: 4, steps_title: "Procurement Section", stage: "pr_numbering" }, 
        { id: 5, steps_title: "Budget Section", stage: "fund_allocation" },
        { id: 6, steps_title: "RED/RTD/Division Chief", stage: "approval_pr" }, 
        { id: 7, steps_title: "BAC/BAC Secretariat", stage: "bidding_preparation" }, 
        { id: 8, steps_title: "TWG Concerned", stage: "evaluation" }, 
        { id: 9, steps_title: "BAC Secretariat", stage: "bac_resolution" }, 
        // Purchase Order (PO) / Contract
        { id: 10, steps_title: "Procurement Section", stage: "po_contract_preparation" },
        { id: 11, steps_title: "End-User/Program Coordinator/Div. Chief", stage: "ors_burs_signing" },
        { id: 12, steps_title: "Budget Section", stage: "budget_endorsement" },
        { id: 13, steps_title: "Accounting Section", stage: "funds_availability" },
        { id: 14, steps_title: "RED/RTD", stage: "po_contract_approval" },
        { id: 15, steps_title: "General Services Section", stage: "supplier_confirmation" },
        { id: 16, steps_title: "RED/RTD", stage: "ntp_approval" },
        { id: 17, steps_title: "General Services Section", stage: "ntp_confirmation" },
        { id: 18, steps_title: "BAC Secretariat", stage: "posting_update" },
        // Project Implementation & Inspection
        { id: 19, steps_title: "General Services Section/End-Users/Regional Agricultural Engineering Division", stage: "project_implementation" },
        { id: 20, steps_title: "Regional Agricultural Engineering Division/Inspectors", stage: "inspection" },
        { id: 21, steps_title: "End-User", stage: "turnover_docs" },
        // Disbursement Voucher (DV)
        { id: 22, steps_title: "General Services Section/End-User", stage: "voucher_preparation" },
        { id: 23, steps_title: "End-User", stage: "voucher_signing" },
        { id: 24, steps_title: "Division Chief", stage: "voucher_approval" },
        { id: 25, steps_title: "Accounting Section", stage: "voucher_processing" },
        // Payments
        { id: 26, steps_title: "Cashiering Unit", stage: "check_preparation" },
        { id: 27, steps_title: "Accounting Section", stage: "ada_review" },
        { id: 28, steps_title: "RED/RTD/Admin. Chief", stage: "check_signing" },
        { id: 29, steps_title: "Cashiering Unit", stage: "release_payment" }
    ],
    // Awarding BAC 2 - Lydon
    // Omnibus, Sworn Statement - kung PO above 200,000
    // ENDOF publicBidding2
    procurementProcess: [
        
    ]
}

module.exports = steps;