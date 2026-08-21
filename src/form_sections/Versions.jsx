import { useState } from "react";
import FormSection from "../components/FormSection";
import NumberInput from "../components/NumberInput";
import SelectInput from "../components/SelectInput";
import TextInput from "../components/TextInput";
import Button from "../components/Button";
import CheckboxInput from "../components/CheckboxInput";


function Version({
    version,
    index,
    updateVersion,
    removeVersion
}) {
    return (
        <fieldset className="rounded-lg border border-sky-200 bg-sky-50 p-4 flex flex-col gap-3">
            <legend className="px-1 text-sm font-semibold text-gray-800">
                Version {index + 1}
            </legend>

            <TextInput
                label="Version Name/Label"
                value={version.Version}
                onChange={(e) =>
                    updateVersion(
                        index,
                        'Version',
                        e.target.value
                    )
                }
            />

            <NumberInput
                label="Total Qty"
                value={version.VersionQty}
                onChange={(e) =>
                    updateVersion(
                        index,
                        'VersionQty',
                        e.target.value
                    )
                }
            />

            <NumberInput
                label="Number of mail files for this version"
                value={version.VersionMailFilesQty}
                onChange={(e) =>
                    updateVersion(
                        index,
                        'VersionMailFilesQty',
                        e.target.value
                    )
                }
            />

            <Button
                label="Remove"
                variant="danger"
                onClick={() => removeVersion(index)}
            />
        </fieldset>
    )
}

export default Version