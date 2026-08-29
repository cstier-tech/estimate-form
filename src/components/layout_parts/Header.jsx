import Button from "../Button"

function Header({ onNewRfe, onViewRfes, onOutline }) {
    return (
        <header className="flex">
            <div>
                <Button label='New RFE' onClick={onNewRfe} />
                <Button label='View All RFEs' onClick={onViewRfes} />
                <Button label='Form Outline' onClick={onOutline} />
            </div>
        </header>
    )
}

export default Header
