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
                label: "RFE Name",
                name: "rfe_name",
                type: "text",
                required: true,
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
                required: true,
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
                required: true,
                error: "Sales Rep is required."
            },

            {
                label: "Job Type",
                name: "job_type",
                type: "select",
                required: true,
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
        id: "test",
        title: "TEST",
        type: "fields",

        // No `db` block -> this step is shown but not saved.
        fields: [
            {
                label: "Class of Mail",
                name: "class_of_mail",
                type: "text"
            }
        ]
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
        id: "mailing",
        title: "Mailing",
        type: "fields",

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

    steps: FORM_STEPS
}
