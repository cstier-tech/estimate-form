import TextInput from '../components/TextInput'
import Textarea from '../components/Textarea'
import DateInput from '../components/DateInput'
import SelectInput from '../components/SelectInput'
import FinishingOp from './Finishing'
import ServiceType from './ServiceType'
import QuantityControl from './QuantityControl'

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

    changesFromPrev,
    setChangesFromPrev,



    serviceTypes,
    handleServiceTypes,
    isOtherType,
    setIsOtherType,
    otherServiceTypes,
    setOtherServiceTypes,



    qtys,
    updateQtyCount,
    updateQtyVal,
    removeQty,

}) {
    return (
        <>
            <div className='md:grid gap-3 md:grid-cols-2'>
                {/* Client Name */}
                {/* <TextInput label='Client Name' name='ClientName' value={clientName} onChange={(e) => setClientName(e.target.value)} readOnly disabled /> */}
                {/* <TextInput label='Client Name' name='ClientName' value={clientName} onChange={(e) => setClientName(e.target.value)} /> */}
                {/* Customer Number */}
                {/* <TextInput label='Customer Number' name='CustomerNumner' value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} readOnly disabled /> */}
                {/* <TextInput label='Customer Number' name='CustomerNumner' value={customerNumber} onChange={(e) => setCustomerNumber(e.target.value)} /> */}

                {/* Job Name/Title */}
                <div className='col-span-2'>
                    <TextInput label='Job Name' name='ProjName' value={projName} onChange={(e) => setProjName(e.target.value)} />
                </div>


                {/* Material Code
            <TextInput label='Material Code' name='MaterialCode' value={materialCode} onChange={(e) => setMaterialCode(e.target.value)} /> */}

                {/* Revision Version
            <TextInput label='Revision Version' name='RevisionVersion' value={revisionVersion} onChange={(e) => setRevisionVersion(e.target.value)} /> */}




                {/* Estimate Due Date */}
                <DateInput label='Estimate Due Date' value={dueDate} onChange={(e) => setDueDate(e.target.value)} />

                {/* Sales Rep Name */}
                {/* <TextInput label='Sales Rep' name='SalesRep' value={salesRep} onChange={(e) => setSalesRep(e.target.value)} readOnly disabled /> */}
                <TextInput label='Sales Rep' name='SalesRep' value={salesRep} onChange={(e) => setSalesRep(e.target.value)} />

                {/* Product Type
            <SelectInput options={PRODUCT_TYPE} label='Product Type' value={productType} onChange={(e) => setProductType(e.target.value)} /> */}

                {/* Job Type */}
                <div className='col-span-2'>
                    <SelectInput options={JOB_TYPE} label='Job Type' value={jobType} onChange={(e) => setJobType(e.target.value)} />
                </div>


                {/*  ----- If job type = reprint or quote update ----- */}
                {(jobType == 'Reprint – No Changes' || jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                    <div className='flex flex-wrap gap-3 col-span-2 border border-gray-200 p-3 rounded-md bg-gray-50'>
                        {(jobType == 'Reprint – No Changes' || jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                            <div className='grow-2'>
                                <TextInput label='Previous Job # (if applicable)' name='PrevJobNo' value={prevJobNo} onChange={(e) => setPrevJobNo(e.target.value)} />
                            </div>
                        }
                        {(jobType == 'Reprint – No Changes' || jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                            <div className='grow-2'>
                                <TextInput label='Previous Estimate # (if applicable)' name='PrevEstNo' value={prevEstNo} onChange={(e) => setPrevEstNo(e.target.value)} />
                            </div>
                        }
                        {(jobType == 'Reprint – With Changes' || jobType == 'Quote Update') &&
                            <div className='grow-4'>
                                <Textarea label='Changes from previous job or quote?' name='ChangesFromPrev' value={changesFromPrev} onChange={(e) => setChangesFromPrev(e.target.value)} />
                            </div>
                        }
                    </div>
                }
                {/* Job Description */}
                <div className='col-span-2'>
                    <Textarea label='Job Description' name='ProjDesc' placeholder='Briefly describe the finished piece and work to be performed.' value={projDesc} onChange={(e) => setProjDesc(e.target.value)} rows={4} />
                </div>

                <div className='my-2 col-span-2'>
                    <div className='mb-2'>
                        <h5>Quantity of completed units</h5>
                        <small>Add all quantities you need estimated</small>
                    </div>
                    <QuantityControl
                        label=''
                        addQtyBtnText='+ Estimate another quantity level'
                        qtys={qtys}
                        updateQtyCount={updateQtyCount}
                        updateQtyVal={updateQtyVal}
                        removeQty={removeQty}
                        allowRemove
                        allowAdd
                    />
                </div>


                <div className='col-span-2 my-2'>
                    <div className='mb-2'>
                        <h5>Services performed for this job:</h5>
                        <small>Select all that apply</small>
                    </div>

                    <ServiceType
                        serviceTypes={serviceTypes}
                        handleServiceTypes={handleServiceTypes}
                        isOtherType={isOtherType}
                        setIsOtherType={setIsOtherType}
                        otherServiceTypes={otherServiceTypes}
                        setOtherServiceTypes={setOtherServiceTypes}
                    />
                </div>
            </div>



        </>
    )
}

export default ProjectOverview
