import { useState } from "react"

import Header from "./components/layout_parts/Header"
import Form from "./Form2/Form"
import RfeListPage from "./Form2/RfeListPage"

function App() {

    const [view, setView] = useState("form")

    // { rfeId, formData } when editing a past RFE, else null
    const [editing, setEditing] = useState(null)

    function showNewForm() {
        setEditing(null)
        setView("form")
    }

    function showList() {
        setEditing(null)
        setView("list")
    }

    function editRfe({ rfeId, formData }) {
        setEditing({ rfeId, formData })
        setView("form")
    }

    return (
        <div>

            <Header
                onNewRfe={showNewForm}
                onViewRfes={showList}
                onOutline={showList}
            />

            {view === "list" ? (
                <RfeListPage onEdit={editRfe} />
            ) : (
                <Form
                    key={editing?.rfeId || "new"}
                    selectedRFEId={editing?.rfeId || null}
                    initialData={editing?.formData || null}
                />
            )}

        </div>
    )
}

export default App
