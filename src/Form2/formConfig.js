export const FORM_STEPS = [

    {
        id: "overview",
        title: "RFE Overview",
        type: "fields",

        db: {
            table: 'RFE Versions'
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
        id: 'test',
        title: 'TEST',
        type: 'fields',

        fields: [
            {
                label: "Class of Mail",
                name: "class_of_mail",
                type: "text"
            },
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