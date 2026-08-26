import TextInput from '../components/TextInput'
import Textarea from '../components/Textarea'
import CheckboxInput from '../components/CheckboxInput'
import FormSection from '../components/FormSection'
import DateInput from '../components/DateInput'
import SelectInput from '../components/SelectInput'

const PRODUCT_TYPE = [
    { label: 'Select One', value: '' },
    { label: 'Flat Sheet', value: 'Flat Sheet' },
    { label: 'Folded Piece', value: 'Folded Piece' },
    { label: 'Self-Mailer', value: 'Self-Mailer' },
    { label: 'Booklet / Multi-page', value: 'Booklet / Multi-page' },
    { label: 'Pocket Folder', value: 'Pocket Folder' },
    { label: 'Other', value: 'Other' }
]

const JOB_TYPE = [
    { label: 'Select One', value: '' },
    { label: 'New Job', value: 'New Job' },
    { label: 'Reprint – No Changes', value: 'Reprint – No Changes' },
    { label: 'Reprint – With Changes', value: 'Reprint – With Changes' },
    { label: 'Quote Update', value: 'Quote Update' },
]

const SERVICE_TYPES = [
    { label: 'Assembly', name: 'Assembly' },
    { label: 'Fulfillment', name: 'Fulfillment' },
    { label: 'Mailing', name: 'Mailing' },
    { label: 'Inkjet', name: 'Inkjet' },
    { label: 'Distribution', name: 'Distribution' },
    { label: 'Kitting', name: 'Kitting' },
    { label: 'Packaging', name: 'Packaging' },
    { label: 'Distribution', name: 'Distribution' },
    { label: 'Inventory Storage', name: 'Inventory Storage' },
]

function ProjectOverview({

    clientName,
    setClientName,

    customerNumber,
    setCustomerNumber,

    projName,
    setProjName,

    projDesc,
    setProjDesc,

    dueDate,
    setDueDate,

    salesRep,
    setSalesRep,

    jobType,
    setJobType,

    prevJobNo,
    setPrevJobNo,

    prevEstNo,
    setPrevEstNo,

}) {
    return (
        <>
            <div className='md:grid gap-3 md:grid-cols-2'>
                {/* Client Name */}
                {/* <TextInput label='Client Name' name='ClientName' value={clientName} onChange={(e) => setClientName(e.target.value)} readOnly disabled /> */}
                <TextInput label='Client Name' name='ClientName' value={clientName} onChange={(e) => setClientName(e.target.value)} />

                {/* Customer Number */}
                {/* <TextInput label='Customer Number' name='CustomerNumner' value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} readOnly disabled /> */}
                <TextInput label='Customer Number' name='CustomerNumner' value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} />

                {/* Job Name/Title */}
                <TextInput label='Project Name (optional)' name='ProjName' value={projName} onChange={(e) => setProjName(e.target.value)} />

                {/* Material Code
            <TextInput label='Material Code' name='MaterialCode' value={materialCode} onChange={(e) => setMaterialCode(e.target.value)} /> */}

                {/* Revision Version
            <TextInput label='Revision Version' name='RevisionVersion' value={revisionVersion} onChange={(e) => setRevisionVersion(e.target.value)} /> */}

                {/* Job Description */}


                {/* Estimate Due Date */}
                <DateInput label='Estimate Due Date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

                {/* Sales Rep Name */}
                {/* <TextInput label='Sales Rep' name='SalesRep' value={salesRep} onChange={(e) => setSalesRep(e.target.value)} readOnly disabled /> */}
                <TextInput label='Sales Rep' name='SalesRep' value={salesRep} onChange={(e) => setSalesRep(e.target.value)} />

                {/* Product Type
            <SelectInput options={PRODUCT_TYPE} label='Product Type' value={productType} onChange={(e) => setProductType(e.target.value)} /> */}

                {/* Job Type */}
                <SelectInput options={JOB_TYPE} label='Job Type' value={jobType} onChange={(e) => setJobType(e.target.value)} />

                {/*  ----- If job type = reprint or quote update ----- */}
                {(jobType == 'Reprint – No Changes' || jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                    <div className='flex gap-3 col-span-2 border border-gray-200 p-3 rounded-md bg-gray-50'>
                        {(jobType == 'Reprint – No Changes' || jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                            <div className='grow'>
                                <TextInput label='Previous Job # (if applicable)' name='PrevJobNo' value={prevJobNo} onChange={(e) => setPrevJobNo(e.target.value)} />
                            </div>
                        }
                        {(jobType == 'Reprint – No Changes' || jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                            <div className='grow'>
                                <TextInput label='Previous Estimate # (if applicable)' name='PrevEstNo' value={prevEstNo} onChange={(e) => setPrevEstNo(e.target.value)} />
                            </div>
                        }
                        {(jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                            <div className='grow'>
                                <TextInput label='Changes from previous job or quote?' />
                            </div>
                        }
                    </div>
                }

                <div className='col-span-2'>
                    <Textarea label='Project Description' name='ProjDesc' placeholder='Briefly describe the finished piece and work to be performed.' value={projDesc} onChange={(e) => setProjDesc(e.target.value)} required rows={4} />
                </div>
            </div>



        </>
    )
}

export default ProjectOverview
