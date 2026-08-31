
import { useEffect, useState } from 'react'
import { Wizard } from 'react-use-wizard'

import StepOne from './StepOne'
import StepTwo from './StepTwo'
import FinalStep from './FinalStep'

import { supabase } from '../lib/supabaseClient'
import Button from '../components/Button'


const INITIAL_COMPONENT = () => ({
    component_key: crypto.randomUUID(),
    Component: '',
    Source: '',
    JobNo: '',
    Size: '',
    FlatSize: '',
    Stock: '',
    Coating: '',
    quantities: [''],
    SameQty: false,
    saved: false,
    requiresFinishing: false,
    finishingOps: []
})


const INITIAL_FORM_DATA = {
    rfe_name: '',
    customer_name: '',
    description: '',
    customer_number: '',
    due_date: '',
    sales_rep: '',
    job_type: '',
    additional_comments: '',
    previous_job_number: '',
    quantities: [''],
    components: [INITIAL_COMPONENT()]
}


function Form() {

    // --------------------------------
    // RFE LIST
    // --------------------------------

    const [rfes, setRFEs] = useState([])
    const [selectedRFEId, setSelectedRFEId] = useState("")


    // --------------------------------
    // FORM DATA
    // --------------------------------

    const [formData, setFormData] = useState({
        ...INITIAL_FORM_DATA,
        components: [INITIAL_COMPONENT()]
    })


    // --------------------------------
    // LOAD RFE LIST
    // --------------------------------

    useEffect(() => {
        getRFEs()
    }, [])


    const getRFEs = async () => {

        const {
            data: rfeData,
            error: rfeError
        } = await supabase
            .from("RFEs")
            .select("id")

        if (rfeError) {
            console.log("error loading RFEs:", rfeError)
            return
        }


        const {
            data: versionData,
            error: versionError
        } = await supabase
            .from("RFE Versions")
            .select("rfe_id, version_number, rfe_name")
            .order("version_number", {
                ascending: false
            })

        if (versionError) {
            console.log("error loading RFE versions:", versionError)
            return
        }


        const latestVersions = rfeData.map(rfe => {

            const latestVersion = versionData.find(
                version => version.rfe_id === rfe.id
            )

            return {
                id: rfe.id,
                rfe_name: latestVersion?.rfe_name || "Unnamed RFE"
            }
        })


        setRFEs(latestVersions)
    }


    // --------------------------------
    // UPDATE FORM DATA
    // --------------------------------

    const updateFormData = (field, value) => {

        setFormData(prev => ({
            ...prev,
            [field]: value
        }))
    }


    // --------------------------------
    // COMPONENT FUNCTIONS
    // --------------------------------

    const updateComponent = (index, field, value) => {

        const components = [...formData.components]

        components[index] = {
            ...components[index],
            [field]: value
        }

        updateFormData("components", components)
    }


    const addComponent = () => {

        updateFormData("components", [
            ...formData.components,
            INITIAL_COMPONENT()
        ])
    }


    const removeComponent = (index) => {

        const components = formData.components.filter(
            (_, i) => i !== index
        )

        updateFormData(
            "components",
            components.length > 0
                ? components
                : [INITIAL_COMPONENT()]
        )
    }


    const updateComponentQtyVal = (
        componentIndex,
        qtyIndex,
        value
    ) => {

        const components = [...formData.components]

        const quantities = [
            ...components[componentIndex].quantities
        ]

        quantities[qtyIndex] = value

        components[componentIndex] = {
            ...components[componentIndex],
            quantities
        }

        updateFormData("components", components)
    }


    const removeComponentQty = (
        componentIndex,
        qtyIndex
    ) => {

        const components = [...formData.components]

        const quantities =
            components[componentIndex].quantities.filter(
                (_, i) => i !== qtyIndex
            )

        components[componentIndex] = {
            ...components[componentIndex],
            quantities:
                quantities.length > 0
                    ? quantities
                    : [""]
        }

        updateFormData("components", components)
    }


    // --------------------------------
    // SAME QUANTITY
    // --------------------------------

    const handleSameQty = (
        componentIndex,
        checked
    ) => {

        const components = [...formData.components]

        components[componentIndex] = {
            ...components[componentIndex],
            SameQty: checked,
            quantities: checked
                ? [...formData.quantities]
                : components[componentIndex].quantities
        }

        updateFormData("components", components)
    }


    // --------------------------------
    // COMPONENT FINISHING
    // --------------------------------

    const handleRequiresFinishing = (
        componentIndex,
        checked
    ) => {

        const components = [...formData.components]

        components[componentIndex] = {
            ...components[componentIndex],
            requiresFinishing: checked,
            finishingOps: checked
                ? components[componentIndex].finishingOps
                : []
        }

        updateFormData("components", components)
    }


    const handleFinishingOps = (
        componentIndex,
        e
    ) => {

        const {
            value,
            checked
        } = e.target

        const components = [...formData.components]

        const component = components[componentIndex]

        let finishingOps = [
            ...component.finishingOps
        ]


        if (checked) {

            const alreadyExists =
                finishingOps.some(
                    op => op.operation === value
                )

            if (!alreadyExists) {

                finishingOps.push({
                    operation: value,
                    details: {}
                })

            }

        } else {

            finishingOps =
                finishingOps.filter(
                    op => op.operation !== value
                )

        }


        components[componentIndex] = {
            ...component,
            finishingOps
        }

        updateFormData(
            "components",
            components
        )
    }


    const updateFinishingOpDetail = (
        componentIndex,
        operation,
        fieldName,
        value
    ) => {

        const components = [...formData.components]

        const component =
            components[componentIndex]


        const finishingOps =
            component.finishingOps.map(op => {

                if (op.operation !== operation) {
                    return op
                }

                return {
                    ...op,
                    details: {
                        ...op.details,
                        [fieldName]: value
                    }
                }

            })


        components[componentIndex] = {
            ...component,
            finishingOps
        }


        updateFormData(
            "components",
            components
        )
    }


    // --------------------------------
    // QUANTITY FUNCTIONS
    // --------------------------------

    const updateQuantity = (
        index,
        value
    ) => {

        setFormData(prev => {

            const quantities =
                [...prev.quantities]

            quantities[index] = value

            return {
                ...prev,
                quantities
            }

        })
    }


    const addQuantity = () => {

        setFormData(prev => ({

            ...prev,

            quantities: [
                ...prev.quantities,
                ''
            ]

        }))
    }


    const removeQuantity = (
        index
    ) => {

        setFormData(prev => {

            const quantities =
                prev.quantities.filter(
                    (_, i) => i !== index
                )

            return {

                ...prev,

                quantities:
                    quantities.length > 0
                        ? quantities
                        : ['']

            }

        })
    }


    // --------------------------------
    // LOAD SELECTED RFE
    // --------------------------------

    const handleRFEChange = (
        e
    ) => {

        const id = e.target.value

        setSelectedRFEId(id)

        if (id) {

            loadRFE(id)

        } else {

            resetForm()

        }
    }


    // --------------------------------
    // LOAD RFE DATA
    // --------------------------------

    const loadRFE = async (
        id
    ) => {

        const {
            data: version,
            error: versionError
        } = await supabase
            .from("RFE Versions")
            .select("*")
            .eq("rfe_id", id)
            .order("version_number", {
                ascending: false
            })
            .limit(1)
            .single()


        if (versionError) {

            console.log(
                "error loading RFE Version:",
                versionError
            )

            return
        }


        const {
            data: quantities,
            error: quantityError
        } = await supabase
            .from("RFE Quantities")
            .select(
                "quantity, sort_order"
            )
            .eq("version_id", version.id)
            .order("sort_order", {
                ascending: true
            })


        if (quantityError) {

            console.log(
                "error loading RFE quantities:",
                quantityError
            )

            return
        }


        const loadedQuantities =
            quantities.length > 0

                ? quantities.map(
                    row => String(row.quantity)
                )

                : ['']


        setFormData({

            rfe_name:
                version.rfe_name || '',

            customer_name:
                version.customer_name || '',

            description:
                version.description || '',

            customer_number:
                version.customer_number || '',

            due_date:
                version.due_date || '',

            sales_rep:
                version.sales_rep || '',

            job_type:
                version.job_type || '',

            additional_comments:
                version.additional_comments || '',

            previous_job_number:
                version.previous_job_number || '',

            quantities:
                loadedQuantities,

            components:
                [INITIAL_COMPONENT()]

        })
    }


    // --------------------------------
    // RESET FORM
    // --------------------------------

    const resetForm = () => {

        setSelectedRFEId("")

        setFormData({
            ...INITIAL_FORM_DATA,
            components: [INITIAL_COMPONENT()]
        })
    }


    // --------------------------------
    // RENDER
    // --------------------------------

    return (

        <div style={{ padding: '20px' }}>

            <select
                className="border"
                value={selectedRFEId}
                onChange={handleRFEChange}
            >

                <option value="">
                    Select an RFE to edit
                </option>

                {rfes.map(rfe => (

                    <option
                        key={rfe.id}
                        value={rfe.id}
                    >
                        {rfe.rfe_name}
                    </option>

                ))}

            </select>


            <Button
                label="New RFE"
                onClick={resetForm}
            />


            <h2>
                Registration Wizard
            </h2>


            <Wizard>

                <StepOne
                    formData={formData}
                    updateFormData={updateFormData}
                    updateQuantity={updateQuantity}
                    addQuantity={addQuantity}
                    removeQuantity={removeQuantity}
                />


                <StepTwo
                    formData={formData}
                    updateFormData={updateFormData}

                    updateComponent={updateComponent}
                    addComponent={addComponent}
                    removeComponent={removeComponent}

                    updateComponentQtyVal={
                        updateComponentQtyVal
                    }

                    removeComponentQty={
                        removeComponentQty
                    }

                    handleSameQty={
                        handleSameQty
                    }

                    handleRequiresFinishing={
                        handleRequiresFinishing
                    }

                    handleFinishingOps={
                        handleFinishingOps
                    }

                    updateFinishingOpDetail={
                        updateFinishingOpDetail
                    }
                />


                <FinalStep
                    formData={formData}
                    selectedRFEId={selectedRFEId}
                />

            </Wizard>

        </div>
    )
}


export default Form

