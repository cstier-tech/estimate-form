import { Wizard, useWizard } from "react-use-wizard"


function Steppers() {
    const {activeStep} = useWizard()

    const steps = [
        'RFE Overview',
        'Components',
        'Final'
    ]
  return (

    <div>
        {steps.map((step, index) => {
            const stepNum = index;

            const active = activeStep === stepNum;
            const completed = activeStep > stepNum;
            
            if(active){
                return <p className="text-blue-500">{step}</p> 
            } else if (completed){
                return <p className="text-green-500">{step}</p>
            } else {
                return <p className="text-gray-800">{step}</p>
            }
        })}
    </div>
    
  )
}

export default Steppers