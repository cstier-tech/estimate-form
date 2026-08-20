import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import SelectInput from '../components/SelectInput'
import FormSection from '../components/FormSection'
import Button from '../components/Button'

function EstimateViewer({ onEdit }) {
    const [estimates, setEstimates] = useState([])
    const [selectedId, setSelectedId] = useState('')
    const [estimate, setEstimate] = useState(null)

    useEffect(() => {
        async function loadEstimates() {
            const { data, error } = await supabase
                .from('Estimates')
                .select('*')

            if (error) {
                console.error(error)
                return
            }

            setEstimates(data)
        }

        loadEstimates()
    }, [])
    useEffect(() => {
        if (!selectedId) return

        async function loadEstimate() {
            const { data, error } = await supabase
                .from('Estimates')
                .select(`
        *,
        Components(*),
        "Shrinkwrap Packs"(*)
      `)
                .eq('id', selectedId)
                .single()

            if (error) {
                console.error(error)
                return
            }

            setEstimate(data)
        }

        loadEstimate()
    }, [selectedId])

    return (
        <div className="bg-lime-950/10 p-20">
            <FormSection legend='Select Estimate'>
                <SelectInput
                    label="Estimate"
                    value={selectedId}
                    onChange={(e) => setSelectedId(e.target.value)}
                    options={estimates.map(est => ({
                        label: `Estimate #${est.id}`,
                        value: est.id
                    }))}
                />
            </FormSection>


            <FormSection legend="Project Details">
                <p>{estimate?.project_description}</p>
                <p>{estimate?.project_type}</p>
            </FormSection>

            <FormSection legend='Components'>
                {estimate?.Components?.map(component => (
                    <fieldset key={component.id}>
                        <legend>{component.component_name}</legend>

                        <p>Type: {component.component_type}</p>
                        <p>Source: {component.component_source}</p>

                        <p>Job Number: {component.job_number}</p>
                        <p>Department: {component.department}</p>
                    </fieldset>
                ))}
            </FormSection>

            <FormSection legend='Shrinkwrap Packs'>
                {estimate?.["Shrinkwrap Packs"]?.map(pack => (
                    <fieldset key={pack.id}>
                        <p>Qty Per Pack: {pack.qty_per_pack}</p>
                        <p>Number of Packs: {pack.num_of_packs}</p>
                        <p>Total: {pack.pack_total}</p>
                    </fieldset>
                ))}
            </FormSection>

            {estimate && (
  <Button
    label="Edit Estimate"
    onClick={() => onEdit(estimate.id)}
  />
)}

        </div>
        
    )
}

export default EstimateViewer