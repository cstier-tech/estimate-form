import NumberInput from "../components/NumberInput"
import SelectInput from "../components/SelectInput"
import Button from "../components/Button"
import { createPackDistributionRow } from "../pages/newestForm/factories"

const PACK_TYPE_OPTIONS = [
    { label: 'Select pack type', value: '' },
    { label: 'Shrink Wrapped', value: 'Shrink Wrap' },
    { label: 'Banded', value: 'Banded' },
    { label: 'Other', value: 'Other' },
]

function rowTotal(row) {
    return (Number(row.qtyPerPack) || 0) * (Number(row.numberOfPacks) || 0)
}

// A user-extendable list of pack distributions. Each row carries its own pack
// type plus a { qtyPerPack, numberOfPacks } split, e.g. "5000 shrink-wrapped in
// packs of 10, 2000 banded in packs of 20".
//
// `completedUnits` is the project-level completed-units quantities; the packed
// Total Qty is checked against each level so an over/under pack count is flagged.
function PackDistribution({ rows, onChange, completedUnits = [] }) {
    const addRow = () => onChange([...rows, createPackDistributionRow()])

    const updateRow = (index, name, value) => {
        onChange(rows.map((row, i) => i === index ? { ...row, [name]: value } : row))
    }

    const removeRow = (index) => {
        onChange(rows.filter((_, i) => i !== index))
    }

    const totalQty = rows.reduce((sum, row) => sum + rowTotal(row), 0)

    return (
        <div className="space-y-3">
            {rows.map((row, index) => (
                <div key={index} className="flex items-end gap-2">
                    <SelectInput
                        label="Pack Type"
                        options={PACK_TYPE_OPTIONS}
                        value={row.packType}
                        onChange={(e) => updateRow(index, 'packType', e.target.value)}
                    />
                    <NumberInput
                        label="Qty per Pack"
                        value={row.qtyPerPack}
                        onChange={(e) => updateRow(index, 'qtyPerPack', e.target.value)}
                    />
                    <NumberInput
                        label="Number of Packs"
                        value={row.numberOfPacks}
                        onChange={(e) => updateRow(index, 'numberOfPacks', e.target.value)}
                    />
                    <span className="pb-2 text-sm whitespace-nowrap text-gray-600">= {rowTotal(row)}</span>
                    <Button size="sm" variant="danger" label="Remove" onClick={() => removeRow(index)} />
                </div>
            ))}

            <Button size="sm" variant="info" label="Add Distribution Row" onClick={addRow} />

            <p className="text-sm font-semibold text-gray-800">Total Qty: {totalQty}</p>

            {completedUnits
                .filter(units => units !== "" && units != null)
                .map((units, i) => {
                    const target = Number(units)
                    const diff = totalQty - target
                    return (
                        <p key={i} className="text-sm text-gray-700">
                            Completed Units: {target}
                            {diff === 0
                                ? <span className="ml-2 font-semibold text-green-700">✓ matches Total Qty</span>
                                : <span className={`ml-2 font-semibold ${diff > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                                    Total Qty is {Math.abs(diff)} {diff > 0 ? 'more' : 'less'}
                                </span>
                            }
                        </p>
                    )
                })}
        </div>
    )
}

export default PackDistribution
