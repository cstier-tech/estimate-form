import Button from "../components/Button"
import { useState } from "react"
import TextInput from "../components/TextInput"
import QuantityControl from "./QuantityControl"
import FormSection from "../components/FormSection"

function Versions2({
    version,
    updateVersion,
    index,
    updateVersionQtyCount,
    updateVersionQtyVal,
    removeVersion
}) {

    return (
        <FormSection bg="bg-blue-50" border="border-blue-200" legend={`Version ${String.fromCharCode(96 + (index + 1)).toUpperCase()}`}>
            <TextInput
                label='Version Name'
                value={version.Version}
                onChange={(e) => updateVersion(index, 'Version', e.target.value)} />
            <QuantityControl
                updateQtyCount={() => updateVersionQtyCount(index)}
                updateQtyVal={(qtyIndex, value) => updateVersionQtyVal(index, qtyIndex, value)}
                qtys={version.quantities} />
            <Button variant="danger" label='Remove Version' onClick={() => removeVersion(index)} />
        </FormSection>
    )
}

export default Versions2