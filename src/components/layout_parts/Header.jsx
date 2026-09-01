import Button from "../Button"

function Header({ onNewRfe, onClearForm, onViewRfes, onOutline }) {
    return (
        <header className="flex">
            <div>
                <Button label='New RFE' onClick={onNewRfe} />
                <Button label='Clear Form' onClick={onClearForm} />
                <Button label='View All RFEs' onClick={onViewRfes} />
                {/* <Button label='Form Outline' onClick={onOutline} /> */}
            </div>
        </header>
    )
}

export default Header
