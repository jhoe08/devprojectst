
const stagesMessages = {
    // Preparation
    prepared_by: {
        initial: {
            title: "Submit Purchase Request",
            text: "Click 'Confirm' to submit the Purchase Request for processing."
        },
        confirmed: {
            title: "Request Submitted",
            text: "The Purchase Request has been successfully submitted."
        },
        denied: {
            title: "Submission Denied",
            text: "The Purchase Request was not submitted."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial has been successfully recorded."
        }
    },

    pr_preparation: {
        initial: {
            title: "Prepare Purchase Request",
            text: "Click 'Confirm' to prepare the Purchase Request."
        },
        confirmed: {
            title: "Request Prepared",
            text: "The Purchase Request has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "The Purchase Request was not prepared."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of PR preparation has been recorded."
        }
    },

    // Reviews / approvals
    division_head_approval: {
        initial: {
            title: "Approve Purchase Request",
            text: "Click 'Confirm' to approve the Purchase Request."
        },
        confirmed: {
            title: "PR Approved",
            text: "The Purchase Request has been approved."
        },
        denied: {
            title: "Approval Denied",
            text: "The Purchase Request was not approved."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of approval has been recorded."
        }
    },

    executive_review: {
        initial: {
            title: "Executive Review",
            text: "Click 'Confirm' to send the request for executive review."
        },
        confirmed: {
            title: "Review Completed",
            text: "Executive review has been completed."
        },
        denied: {
            title: "Review Denied",
            text: "The request did not pass executive review."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial from executive review has been recorded."
        }
    },

    approval_pr: {
        initial: {
            title: "Approve PR",
            text: "Click 'Confirm' to approve the Purchase Request."
        },
        confirmed: {
            title: "PR Approved",
            text: "The Purchase Request has been approved."
        },
        denied: {
            title: "Approval Denied",
            text: "The Purchase Request was not approved."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of PR approval has been recorded."
        }
    },

    // Numbering / allocation
    pr_numbering: {
        initial: {
            title: "Assign PR Number",
            text: "Click 'Confirm' to assign a PR number."
        },
        confirmed: {
            title: "PR Number Assigned",
            text: "A PR number has been assigned."
        },
        denied: {
            title: "Numbering Denied",
            text: "PR numbering was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of PR numbering has been recorded."
        }
    },

    fund_allocation: {
        initial: {
            title: "Allocate Funds",
            text: "Click 'Confirm' to allocate funds for the Purchase Request."
        },
        confirmed: {
            title: "Funds Allocated",
            text: "Funds have been successfully allocated."
        },
        denied: {
            title: "Allocation Denied",
            text: "Funds were not allocated."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of fund allocation has been recorded."
        }
    },

    funding_allocation: { // alias for svp naming
        initial: {
            title: "Allocate Funds",
            text: "Click 'Confirm' to allocate funds for the Purchase Request."
        },
        confirmed: {
            title: "Funds Allocated",
            text: "Funds have been successfully allocated."
        },
        denied: {
            title: "Allocation Denied",
            text: "Funds were not allocated."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of fund allocation has been recorded."
        }
    },

    // Bidding / canvass
    bidding_preparation: {
        initial: {
            title: "Prepare Bidding",
            text: "Click 'Confirm' to prepare bidding documents."
        },
        confirmed: {
            title: "Bidding Prepared",
            text: "Bidding documents have been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "Bidding preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of bidding preparation has been recorded."
        }
    },

    canvass_preparation: {
        initial: {
            title: "Prepare Canvass",
            text: "Click 'Confirm' to prepare the canvass."
        },
        confirmed: {
            title: "Canvass Prepared",
            text: "The canvass has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "Canvass preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of canvass preparation has been recorded."
        }
    },

    canvass_signing: {
        initial: {
            title: "Sign Canvass",
            text: "Click 'Confirm' to sign the canvass."
        },
        confirmed: {
            title: "Canvass Signed",
            text: "The canvass has been signed."
        },
        denied: {
            title: "Signing Denied",
            text: "Canvass signing was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of canvass signing has been recorded."
        }
    },

    review_and_posting: {
        initial: {
            title: "Review and Post",
            text: "Click 'Confirm' to review and post to PhilGEPS."
        },
        confirmed: {
            title: "Posted",
            text: "The item has been reviewed and posted."
        },
        denied: {
            title: "Posting Denied",
            text: "Review or posting was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of review/posting has been recorded."
        }
    },

    distribution_of_canvass: {
        initial: {
            title: "Distribute Canvass",
            text: "Click 'Confirm' to distribute the canvass to suppliers."
        },
        confirmed: {
            title: "Canvass Distributed",
            text: "The canvass has been distributed."
        },
        denied: {
            title: "Distribution Denied",
            text: "Canvass distribution was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of canvass distribution has been recorded."
        }
    },

    supplier_serving: {
        initial: {
            title: "Serve Suppliers",
            text: "Click 'Confirm' to serve suppliers with the canvass."
        },
        confirmed: {
            title: "Suppliers Served",
            text: "Suppliers have been served."
        },
        denied: {
            title: "Serving Denied",
            text: "Supplier serving was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of supplier serving has been recorded."
        }
    },

    bid_submission: {
        initial: {
            title: "Submit Bids",
            text: "Click 'Confirm' to accept bid submissions."
        },
        confirmed: {
            title: "Bids Submitted",
            text: "Bid submissions have been received."
        },
        denied: {
            title: "Submission Denied",
            text: "Bid submission was not accepted."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of bid submission has been recorded."
        }
    },

    bid_opening: {
        initial: {
            title: "Open Bids",
            text: "Click 'Confirm' to open submitted bids."
        },
        confirmed: {
            title: "Bids Opened",
            text: "Bids have been opened."
        },
        denied: {
            title: "Opening Denied",
            text: "Bid opening was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of bid opening has been recorded."
        }
    },

    abstract_and_resolution: {
        initial: {
            title: "Prepare Abstract and Resolution",
            text: "Click 'Confirm' to prepare the abstract and resolution."
        },
        confirmed: {
            title: "Abstract Prepared",
            text: "The abstract and resolution have been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "Abstract and resolution preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of abstract preparation has been recorded."
        }
    },

    bac_signing_and_twg_eval: {
        initial: {
            title: "BAC Signing and TWG Evaluation",
            text: "Click 'Confirm' to proceed with BAC signing and TWG evaluation."
        },
        confirmed: {
            title: "Signed and Evaluated",
            text: "BAC signing and TWG evaluation completed."
        },
        denied: {
            title: "Action Denied",
            text: "BAC signing or TWG evaluation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of BAC/TWG action has been recorded."
        }
    },

    award_segregation: {
        initial: {
            title: "Segregate Awards",
            text: "Click 'Confirm' to segregate awards."
        },
        confirmed: {
            title: "Awards Segregated",
            text: "Award segregation has been completed."
        },
        denied: {
            title: "Segregation Denied",
            text: "Award segregation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of award segregation has been recorded."
        }
    },

    noa_preparation: {
        initial: {
            title: "Prepare NOA",
            text: "Click 'Confirm' to prepare the Notice of Award."
        },
        confirmed: {
            title: "NOA Prepared",
            text: "The Notice of Award has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "NOA preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of NOA preparation has been recorded."
        }
    },

    noa_and_resolution_approval: {
        initial: {
            title: "Approve NOA and Resolution",
            text: "Click 'Confirm' to approve the NOA and resolution."
        },
        confirmed: {
            title: "NOA Approved",
            text: "NOA and resolution have been approved."
        },
        denied: {
            title: "Approval Denied",
            text: "NOA approval was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of NOA approval has been recorded."
        }
    },

    noa_confirmation_and_po_joc: {
        initial: {
            title: "Confirm NOA and Prepare PO/JOC",
            text: "Click 'Confirm' to confirm NOA and prepare PO/JOC."
        },
        confirmed: {
            title: "Confirmed and Prepared",
            text: "NOA confirmed and PO/JOC prepared."
        },
        denied: {
            title: "Action Denied",
            text: "NOA confirmation or PO/JOC preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of NOA confirmation/PO preparation has been recorded."
        }
    },

    posting_of_award: {
        initial: {
            title: "Post Award",
            text: "Click 'Confirm' to post the award."
        },
        confirmed: {
            title: "Award Posted",
            text: "The award has been posted."
        },
        denied: {
            title: "Posting Denied",
            text: "Award posting was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of award posting has been recorded."
        }
    },

    posting_update: {
        initial: {
            title: "Update Posting",
            text: "Click 'Confirm' to update the posting."
        },
        confirmed: {
            title: "Posting Updated",
            text: "The posting has been updated."
        },
        denied: {
            title: "Update Denied",
            text: "Posting update was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of posting update has been recorded."
        }
    },

    // Purchase Order / Contract
    po_contract_preparation: {
        initial: {
            title: "Prepare PO/Contract",
            text: "Click 'Confirm' to prepare the Purchase Order or contract."
        },
        confirmed: {
            title: "PO/Contract Prepared",
            text: "The Purchase Order or contract has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "PO/Contract preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of PO/Contract preparation has been recorded."
        }
    },

    ors_preparation: {
        initial: {
            title: "Prepare ORS",
            text: "Click 'Confirm' to prepare the ORS."
        },
        confirmed: {
            title: "ORS Prepared",
            text: "The ORS has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "ORS preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of ORS preparation has been recorded."
        }
    },

    ors_burs_signing: {
        initial: {
            title: "Sign ORS/BURS",
            text: "Click 'Confirm' to sign the ORS/BURS."
        },
        confirmed: {
            title: "Signed",
            text: "ORS/BURS have been signed."
        },
        denied: {
            title: "Signing Denied",
            text: "ORS/BURS signing was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of ORS/BURS signing has been recorded."
        }
    },

    ors_burs_charging: {
        initial: {
            title: "Charge ORS/BURS",
            text: "Click 'Confirm' to charge the ORS/BURS."
        },
        confirmed: {
            title: "Charged",
            text: "ORS/BURS have been charged."
        },
        denied: {
            title: "Charging Denied",
            text: "ORS/BURS charging was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of ORS/BURS charging has been recorded."
        }
    },

    obligation_numbering: {
        initial: {
            title: "Assign Obligation Number",
            text: "Click 'Confirm' to assign an obligation number."
        },
        confirmed: {
            title: "Number Assigned",
            text: "An obligation number has been assigned."
        },
        denied: {
            title: "Numbering Denied",
            text: "Obligation numbering was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of obligation numbering has been recorded."
        }
    },

    po_joc_processing: {
        initial: {
            title: "Process PO/JOC",
            text: "Click 'Confirm' to process the PO/JOC."
        },
        confirmed: {
            title: "Processed",
            text: "PO/JOC processing completed."
        },
        denied: {
            title: "Processing Denied",
            text: "PO/JOC processing was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of PO/JOC processing has been recorded."
        }
    },

    po_joc_approval: {
        initial: {
            title: "Approve PO/JOC",
            text: "Click 'Confirm' to approve the PO/JOC."
        },
        confirmed: {
            title: "Approved",
            text: "PO/JOC has been approved."
        },
        denied: {
            title: "Approval Denied",
            text: "PO/JOC approval was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of PO/JOC approval has been recorded."
        }
    },

    serving_po_joc: {
        initial: {
            title: "Serve PO/JOC",
            text: "Click 'Confirm' to serve the PO/JOC to the supplier."
        },
        confirmed: {
            title: "Served",
            text: "PO/JOC has been served."
        },
        denied: {
            title: "Serving Denied",
            text: "Serving PO/JOC was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of serving PO/JOC has been recorded."
        }
    },

    supplier_confirmation: {
        initial: {
            title: "Confirm Supplier",
            text: "Click 'Confirm' to confirm supplier acceptance."
        },
        confirmed: {
            title: "Supplier Confirmed",
            text: "Supplier confirmation received."
        },
        denied: {
            title: "Confirmation Denied",
            text: "Supplier confirmation was not received."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of supplier confirmation has been recorded."
        }
    },

    ntp_approval: {
        initial: {
            title: "Approve NTP",
            text: "Click 'Confirm' to approve the Notice to Proceed."
        },
        confirmed: {
            title: "NTP Approved",
            text: "The Notice to Proceed has been approved."
        },
        denied: {
            title: "Approval Denied",
            text: "NTP approval was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of NTP approval has been recorded."
        }
    },

    ntp_confirmation: {
        initial: {
            title: "Confirm NTP",
            text: "Click 'Confirm' to confirm NTP issuance."
        },
        confirmed: {
            title: "NTP Confirmed",
            text: "NTP confirmation completed."
        },
        denied: {
            title: "Confirmation Denied",
            text: "NTP confirmation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of NTP confirmation has been recorded."
        }
    },

    // Implementation & inspection
    project_implementation: {
        initial: {
            title: "Start Project Implementation",
            text: "Click 'Confirm' to begin project implementation."
        },
        confirmed: {
            title: "Implementation Started",
            text: "Project implementation is underway."
        },
        denied: {
            title: "Implementation Denied",
            text: "Project implementation was not started."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of project implementation has been recorded."
        }
    },

    inspection: {
        initial: {
            title: "Conduct Inspection",
            text: "Click 'Confirm' to perform the inspection."
        },
        confirmed: {
            title: "Inspection Completed",
            text: "The inspection has been successfully completed."
        },
        denied: {
            title: "Inspection Denied",
            text: "The inspection was not conducted."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of inspection has been recorded."
        }
    },

    turnover_docs: {
        initial: {
            title: "Turn Over Documents",
            text: "Click 'Confirm' to turn over project documents."
        },
        confirmed: {
            title: "Turnover Completed",
            text: "Project documents have been turned over."
        },
        denied: {
            title: "Turnover Denied",
            text: "Document turnover was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of document turnover has been recorded."
        }
    },

    // Disbursement / vouchers
    voucher_preparation: {
        initial: {
            title: "Prepare Voucher",
            text: "Click 'Confirm' to prepare the Disbursement Voucher."
        },
        confirmed: {
            title: "Voucher Prepared",
            text: "The Disbursement Voucher has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "Voucher preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of voucher preparation has been recorded."
        }
    },

    voucher_signing: {
        initial: {
            title: "Sign Voucher",
            text: "Click 'Confirm' to sign the Disbursement Voucher."
        },
        confirmed: {
            title: "Voucher Signed",
            text: "The Disbursement Voucher has been signed."
        },
        denied: {
            title: "Signing Denied",
            text: "Voucher signing was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of voucher signing has been recorded."
        }
    },

    voucher_compilation: {
        initial: {
            title: "Compile Voucher",
            text: "Click 'Confirm' to compile voucher documents."
        },
        confirmed: {
            title: "Compiled",
            text: "Voucher compilation completed."
        },
        denied: {
            title: "Compilation Denied",
            text: "Voucher compilation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of voucher compilation has been recorded."
        }
    },

    voucher_processing: {
        initial: {
            title: "Process Voucher",
            text: "Click 'Confirm' to process the voucher."
        },
        confirmed: {
            title: "Voucher Processed",
            text: "The voucher has been processed."
        },
        denied: {
            title: "Processing Denied",
            text: "Voucher processing was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of voucher processing has been recorded."
        }
    },

    voucher_approval: {
        initial: {
            title: "Approve Voucher",
            text: "Click 'Confirm' to approve the voucher."
        },
        confirmed: {
            title: "Voucher Approved",
            text: "The voucher has been approved."
        },
        denied: {
            title: "Approval Denied",
            text: "Voucher approval was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of voucher approval has been recorded."
        }
    },

    // Payments
    check_preparation: {
        initial: {
            title: "Prepare Check",
            text: "Click 'Confirm' to prepare the check."
        },
        confirmed: {
            title: "Check Prepared",
            text: "The check has been prepared."
        },
        denied: {
            title: "Preparation Denied",
            text: "Check preparation was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of check preparation has been recorded."
        }
    },

    ada_review: {
        initial: {
            title: "ADA Review",
            text: "Click 'Confirm' to perform ADA review."
        },
        confirmed: {
            title: "Review Completed",
            text: "ADA review has been completed."
        },
        denied: {
            title: "Review Denied",
            text: "ADA review was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of ADA review has been recorded."
        }
    },

    check_signing: {
        initial: {
            title: "Sign Check",
            text: "Click 'Confirm' to sign the check."
        },
        confirmed: {
            title: "Check Signed",
            text: "The check has been signed."
        },
        denied: {
            title: "Signing Denied",
            text: "Check signing was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of check signing has been recorded."
        }
    },

    release_payment: {
        initial: {
            title: "Release Payment",
            text: "Click 'Confirm' to release the payment."
        },
        confirmed: {
            title: "Payment Released",
            text: "The payment has been released."
        },
        denied: {
            title: "Release Denied",
            text: "Payment release was not completed."
        },
        confirmedDenied: {
            title: "Denial Recorded",
            text: "The denial of payment release has been recorded."
        }
    }
};

module.exports = stagesMessages;