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
        <div className="px-4 py-10 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-3xl flex-col gap-6">
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
                    <p className="text-sm text-gray-700">{estimate?.project_description}</p>
                    <p className="text-sm text-gray-700">{estimate?.project_type}</p>
                </FormSection>

                <FormSection legend='Components'>
                    {estimate?.Components?.map(component => (
                        <fieldset key={component.id} className="rounded-md border border-gray-200 p-3">
                            <legend className="px-1 text-sm font-semibold text-gray-800">{component.component_name}</legend>

                            <p className="text-sm text-gray-700">Type: {component.component_type}</p>
                            <p className="text-sm text-gray-700">Source: {component.component_source}</p>

                            <p className="text-sm text-gray-700">Job Number: {component.job_number}</p>
                            <p className="text-sm text-gray-700">Department: {component.department}</p>
                        </fieldset>
                    ))}
                </FormSection>

                <FormSection legend='Shrinkwrap Packs'>
                    {estimate?.["Shrinkwrap Packs"]?.map(pack => (
                        <fieldset key={pack.id} className="rounded-md border border-gray-200 p-3">
                            <p className="text-sm text-gray-700">Qty Per Pack: {pack.qty_per_pack}</p>
                            <p className="text-sm text-gray-700">Number of Packs: {pack.num_of_packs}</p>
                            <p className="text-sm text-gray-700">Total: {pack.pack_total}</p>
                        </fieldset>
                    ))}
                </FormSection>

                {estimate && (
                    <div className="flex justify-end">
                        <Button
                            label="Edit Estimate"
                            onClick={() => onEdit(estimate.id)}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

export default EstimateViewer