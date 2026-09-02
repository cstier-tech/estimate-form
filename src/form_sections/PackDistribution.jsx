import NumberInput from "../components/NumberInput"
import SelectInput from "../components/SelectInput"
import Button from "../components/Button"
import { createPackDistributionRow } from "../pages/newestForm/factories"

const nf = new Intl.NumberFormat()

const PACK_TYPE_OPTIONS = [
    { label: 'Select pack type', value: '' },
    { label: 'Shrink Wrapped', value: 'Shrink Wrap' },
    { label: 'Banded', value: 'Banded' },
    { label: 'Other', value: 'Other' },
]

// A user-extendable list of pack distributions shared by every quantity level.
// Each row carries its own pack type and quantity per pack. The number of packs
// and resulting total are calculated separately for each quantity level.
function PackDistribution({ rows, quantities = [], onChange }) {
    
    const addRow = () => onChange([...rows, createPackDistributionRow()])

    const combinedQtyPerPack = rows.reduce(
        (sum, row) => sum + (Number(row.qtyPerPack) || 0),
        0
    )

    const updateRow = (index, name, value) => {
        onChange(rows.map((row, i) => i === index ? { ...row, [name]: value } : row))
    }

    const updateNumberOfPacks = (rowIndex, levelIndex, value) => {
        onChange(rows.map((row, index) => {
            if (index !== rowIndex) {
                return row
            }

            const numberOfPacks = [...(row.numberOfPacks || [])]
            numberOfPacks[levelIndex] = value

            return { ...row, numberOfPacks }
        }))
    }

    const removeRow = (index) => {
        onChange(rows.filter((_, i) => i !== index))
    }

    return (
        <div className="space-y-3">
            <div className=''>
                <div>
                    {rows.map((row, index) => (
                        <div key={index} className="border-be border-gray-400 grid grid-cols-2">
                            <div className="p-2">
                                <SelectInput
                                    label="Pack Type"
                                    options={PACK_TYPE_OPTIONS}
                                    value={row.packType}
                                    onChange={(e) => updateRow(index, 'packType', e.target.value)}
                                />
                            </div>
                            <div className="p-2">
                                <NumberInput
                                    label="Qty per Pack"
                                    value={row.qtyPerPack}
                                    onChange={(e) => updateRow(index, 'qtyPerPack', e.target.value)}
                                />
                            </div>
                            <div className='col-span-2'>
                            {quantities.map((quantity, levelIndex) => {
                                const target = Number(quantity) || 0
                                const rowQtyPerPack = Number(row.qtyPerPack) || 0
                                const calculatedNumberOfPacks = combinedQtyPerPack > 0
                                    ? Math.ceil(target / combinedQtyPerPack)
                                    : 0
                                const numberOfPacks = row.numberOfPacks?.[levelIndex] ?? calculatedNumberOfPacks
                                const calculatedTotal = rowQtyPerPack * (Number(numberOfPacks) || 0)

                                return (
                                    <div key={levelIndex} className="p-2">
                                        <NumberInput
                                            label={`${nf.format(numberOfPacks)} packs = ${nf.format(calculatedTotal)}`}
                                            value={numberOfPacks}
                                            onChange={(e) => updateNumberOfPacks(index, levelIndex, e.target.value)}
                                        />
                                    </div>
                                )
                            })}
                            </div>
                            <div className="p-2">
                                <Button size="sm" variant="danger" label="Remove" onClick={() => removeRow(index)} />

                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <Button size="sm" variant="info" label="Add Distribution Row" onClick={addRow} />

            <div className="space-y-1 text-sm text-gray-700">
                {quantities.map((quantity, levelIndex) => {
                    const target = Number(quantity) || 0
                    const calculatedTotal = rows.reduce((sum, row) => {
                        const rowQtyPerPack = Number(row.qtyPerPack) || 0
                        const calculatedNumberOfPacks = combinedQtyPerPack > 0
                            ? Math.ceil(target / combinedQtyPerPack)
                            : 0
                        const numberOfPacks = row.numberOfPacks?.[levelIndex] ?? calculatedNumberOfPacks
                        return sum + rowQtyPerPack * (Number(numberOfPacks) || 0)
                    }, 0)

                    return (
                        <p key={levelIndex}>
                            Level {levelIndex + 1} combined total: {nf.format(calculatedTotal)}
                            {' '}
                            <span className={calculatedTotal === target ? "text-green-700" : "text-amber-700"}>
                                (target: {nf.format(target)})
                            </span>
                        </p>
                    )
                })}
            </div>

        </div>
    )
}

export default PackDistribution
