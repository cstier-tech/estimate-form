import FormSection from "../components/FormSection"
import TextInput from "../components/TextInput"

function Mailing({
    classOfMail,
    setClassOfMail,

    indicia,
    setIndicia,

    paymentMethod,
    setPaymentMethod,

    permitType,
    setPermitType,

    nonprofitAuth,
    setNonprofitAuth,

    mailingFrom,
    setMailingFrom,

    permitOwner,
    setPermitOwner,

    exactCompanyName,
    setExactCompanyName,

    exactCompanyAddress,
    setExactCompanyAddress,
}) {
    return (
        <FormSection legend='Mailing' >
            <TextInput label='Class of Mail' value={classOfMail} onChange={(e) => setClassOfMail(e.target.value)} />
            <TextInput label='Indicia' value={indicia} onChange={(e) => setIndicia(e.target.value)} />
            <TextInput label='Payment Method' value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)} />
            <TextInput label='Permit Type' value={permitType} onChange={(e) => setPermitType(e.target.value)} />
            <TextInput label='Nonprofit Auth #' value={nonprofitAuth} onChange={(e) => setNonprofitAuth(e.target.value)} />
            <TextInput label='Mailing From' value={mailingFrom} onChange={(e) => setMailingFrom(e.target.value)} />
            <TextInput label='Permit Owner Info' value={permitOwner} onChange={(e) => setPermitOwner(e.target.value)} />
            <TextInput label='Exact Company Name' value={exactCompanyName} onChange={(e) => setExactCompanyName(e.target.value)} />
            <TextInput label='Exact Company Address' value={exactCompanyAddress} onChange={(e) => setExactCompanyAddress(e.target.value)} />
        </FormSection>
    )
}

export default Mailing