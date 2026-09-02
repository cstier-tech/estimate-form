// =============================================================================
// FORM CONFIG
// =============================================================================
//
// Everything about the shape of the form lives here.
//
//   - Add / remove a plain field  -> edit a step's `fields` array
//   - Add / remove a whole step   -> add / remove an entry in FORM_STEPS
//   - Send a step to a new table  -> set `db: { table: "...", fk: "..." }`
//
// A `type: "fields"` step renders generically from its `fields` array and is
// persisted generically by src/Form2/submitForm.js:
//
//   db: { table: "RFE Versions", role: "version" }
//       -> this step's fields ARE the version row (one per submission)
//
//   db: { table: "Mailing", fk: "version_id" }
//       -> one child row in `table`, linked back with `fk` (defaults to
//          "version_id"). The DB column name must match the field `name`.
//
//   (no `db` block)
//       -> the step is shown but NOT saved anywhere.
//
// Field object:
//   { label, name, type, required?, error?, options?, showwhen?, defaultValue? }
//   type: "text" | "textarea" | "date" | "select"
//   showwhen: { field, value }  -> only shown when formData[field] === value
// =============================================================================

export const FORM_STEPS = [

    {
        id: "overview",
        title: "RFE Overview",
        type: "fields",

        // This step fills the RFE Versions row itself.
        db: {
            table: "RFE Versions",
            role: "version"
        },

        fields: [
            {
                name: "version_type",
                type: "hidden",
                defaultValue: "rfe"
            },
            {
                label: "RFE Name",
                name: "rfe_name",
                formText: 'Use a descriptive name, e.g. "TERSERA Zoladex Coding and Reimbursement Guide ZOL-P 1138 v5"',
                type: "text",
                required: false,
                error: "RFE name is required."
            },

            {
                label: "Description",
                name: "description",
                type: "textarea"
            },

            {
                label: "Customer",
                name: "customer_name",
                type: "text",
                required: false,
                error: "Customer is required."
            },

            {
                label: "Customer Number",
                name: "customer_number",
                type: "text"
            },

            {
                label: "Requested Due Date",
                name: "due_date",
                type: "date"
            },

            {
                label: "Sales Rep",
                name: "sales_rep",
                type: "text",
                required: false,
                error: "Sales Rep is required."
            },

            {
                label: "Job Type",
                name: "job_type",
                type: "select",
                required: false,
                error: "Job Type is required.",

                options: [
                    {
                        label: "Select One",
                        value: ""
                    },
                    {
                        label: "New Job",
                        value: "New Job"
                    },
                    {
                        label: "Reprint – No Changes",
                        value: "Reprint – No Changes"
                    },
                    {
                        label: "Reprint – With Changes",
                        value: "Reprint – With Changes"
                    },
                    {
                        label: "Quote Update",
                        value: "Quote Update"
                    }
                ]
            },

            {
                label: "Previous Job Number",
                name: "previous_job_number",
                type: "text",

                showwhen: {
                    field: "job_type",
                    value: "Reprint – No Changes"
                }
            },

            {
                label: "Additional Comments",
                name: "additional_comments",
                type: "textarea"
            }
        ],

        quantities: true
    },

    {
        id: "components",
        title: "Components",
        type: "components"
    },

    {
        id: "kitting",
        title: "Kitting",
        type: "kitting"
    },

    {
        id: "pack_distribution",
        title: "Packs",
        type: "pack_distribution"
    },

    {
        id: "mailing",
        title: "Mailing",
        type: "fields",

        showwhen: {
            field: 'version_type',
            value: 'job'
        },

        // One child row in "Mailing", linked with version_id.
        db: {
            table: "Mailing",
            fk: "version_id"
        },

        fields: [

            {
                label: "Class of Mail",
                name: "class_of_mail",
                type: "text"
            },

            {
                label: "Indicia",
                name: "indicia",
                type: "text"
            },

            {
                label: "Payment Method",
                name: "payment_method",
                type: "text"
            },

            {
                label: "Permit Type",
                name: "permit_type",
                type: "text"
            },

            {
                label: "Nonprofit Authorization",
                name: "nonprofit_auth",
                type: "text"
            },

            {
                label: "Mailing From",
                name: "mailing_from",
                type: "text"
            },

            {
                label: "Permit Owner",
                name: "permit_owner",
                type: "text"
            },

            {
                label: "Exact Company Name",
                name: "exact_company_name",
                type: "text"
            },

            {
                label: "Exact Company Address",
                name: "exact_company_address",
                type: "textarea"
            }
        ]
    },

    {
        id: "shipping",
        title: "Shipping",
        type: "fields",
        db: {
            table: "Shipments",
            fk: "version_id"
        },
        fields: [
            {
                label: "Number of Shipments",
                name: 'num_of_shipments',
                type: "number",
                required: false,
                error: "Number of shipments is required."
            },
            {
                label: "Ship Date",
                name: 'ship_date',
                type: 'date',
                required: false,
                showwhen: {
                    field: "version_type",
                    value: "job"
                },
            },
            // {
            //     label: 'Shipping Method',
            //     name: 'ship_method',
            //     type: 'select',
            //     required: false,
            //     error: 'Ship method is required.',
            //     options: [
            //         {
            //             label: 'Select One',
            //             value: ''
            //         },
            //         {
            //             label: 'Ground',
            //             value: 'Ground'
            //         },
            //         {
            //             label: '2 Day',
            //             value: '2 Day'
            //         },
            //         {
            //             label: 'Overnight',
            //             value: 'Overnight'
            //         },
            //         {
            //             label: 'LCP Truck',
            //             value: 'LCP Truck'
            //         },
            //     ]
            // },

            {
                label: 'Drop Ship or Bulk Ship?',
                name: 'drop_or_bulk',
                type: 'radio',
                required: true,
                error: 'Please select either Drop Ship or Bulk Ship.',
                options: [
                    {
                        label: 'Drop Ship',
                        value: 'Drop Ship'
                    },
                    {
                        label: 'Bulk Ship',
                        value: 'Bulk Ship'
                    },
                ]
            },
            
            {
                label: 'Advanced Shipping Notice (ASN) Required',
                name: 'asn_required',
                type: 'checkbox',
                defaultValue: false,
                required: false,
                // error: ,
            },
            {
                label: 'ASN Instructions',
                name: 'asn_instructions',
                type: 'textarea',
                required: false,
                error: 'ASN instructions are required.',
                showwhen: {
                    field: 'asn_required',
                    value: true
                }
            },
            {
                label: 'Is Approval Needed Prior to Ship?',
                name: 'approval_required',
                defaultValue: false,
                type: 'checkbox',
                required: false,
                // error: ,
            },
            {
                label: 'International Shipment?',
                name: 'ship_internationally',
                type: 'checkbox',
                defaultValue: false,
                required: false,
                // error: ,
            },
            {
                label: 'USNPC Code',
                name: 'usnpc_code',
                type: 'text',
                required: false,
                error: 'USNPC code is required.',
                showwhen: {
                    field: 'ship_internationally',
                    value: true
                }
            },
            {
                label: 'Customs Value',
                name: 'customs_value',
                type: 'text',
                required: false,
                error: 'Customs value is required.',
                showwhen: {
                    field: 'ship_internationally',
                    value: true
                }
            },
            {
                label: 'Customs Description',
                name: 'customs_description',
                type: 'textarea',
                required: false,
                error: 'Customs description is required.',
                showwhen: {
                    field: 'ship_internationally',
                    value: true
                }
            },
            //{
            //     label: ,
            //     name: ,
            //     type: ,
            //     required: ,
            //     error: ,
            // },
        ]
    },


    {
        id: "review",
        title: "Review",
        type: "review"
    }
]


// =============================================================================
// PERSISTENCE CONFIG
// =============================================================================
//
// Table / column names for the parts of the submission that are not plain
// "fields" steps (the RFE spine, quantities, components, ...). Change a name
// here and submitForm.js follows it.
// =============================================================================

export const FORM_CONFIG = {

    // Parent row. Created empty on a brand new RFE, reused when editing.
    parent: {
        table: "RFEs"
    },

    // The versioned row. One `fields` step must carry db.role === "version";
    // its fields are written here alongside these link columns.
    version: {
        table: "RFE Versions",
        fk: "rfe_id",
        numberColumn: "version_number"
    },

    // RFE-level quantities (the "quote levels").
    quantities: {
        table: "RFE Quantities",
        fk: "version_id",
        valueColumn: "quantity",
        sortColumn: "sort_order"
    },

    // Components. `fieldMap` is  dbColumn -> component state key.
    // Only list columns that exist on the table. To also persist the
    // Source / Job Number inputs, add a `source` / `job_number` column
    // and then:  source: "Source",  job_number: "JobNo".
    components: {
        table: "Components",
        fk: "version_id",
        fieldMap: {
            component_name: "Component",
            size: "Size",
            stock: "Stock",
            coating: "Coating",
            flat_size: "FlatSize",
            component_key: "id",
            saved: "saved"
        }
    },

    // Per-component quantity for each quote level.
    componentQuantities: {
        table: "Component Quantities",
        componentFk: "component_id",
        rfeQuantityFk: "rfe_quantity_id",
        valueColumn: "quantity"
    },

    // Per-component finishing operations.
    componentFinishing: {
        table: "Component Finishing",
        componentFk: "component_id",
        operationColumn: "operation",
        detailsColumn: "details"
    },

    // Kitting. One Kit Build per version; each kit item is a Kit Items row
    // (linked to the build), and its single "qty per kit" is one Kit
    // Quantities row. The kit count per quote level is the RFE quantities.
    kitBuilds: {
        table: "Kit Builds",
        fk: "version_id"
    },
    kitItems: {
        table: "Kit Items",
        buildFk: "kit_build",
        componentFk: "component_id",
        sourceColumn: "source",
        nameColumn: "item_name",
        overageColumn: "overage_action"
    },
    kitQuantities: {
        table: "Kit Quantities",
        kitFk: "kit_id",
        valueColumn: "quantity"
    },

    // Pack distribution. One row per pack type, each with a qtyPerPack and numberOfPacks, for each quote level.
    packDistribution: {
        table: "Packs",
        fk: "version_id",
        packTypeColumn: "pack_type",
        qtyPerPackColumn: "qty_per_pack",
        numberOfPacksColumn: "num_of_packs"
    },

    steps: FORM_STEPS
}
