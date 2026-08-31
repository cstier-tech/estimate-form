import { useState } from "react"

import ProjectsPage from "./pages/ProjectsPage"
import Header from "./components/layout_parts/Header"
import Form from "./Form2/Form"

function readUrlParam(name) {
    return (
        new URLSearchParams(
            window.location.search
        ).get(name) || ""
    )
}

function App() {

    const user =
        readUrlParam("user")

    const clientName =
        readUrlParam("clientName")

    const customerNumber =
        readUrlParam("customerNumber")

    const [view, setView] =
        useState("list")

    const [editingProject, setEditingProject] =
        useState(null)

    function showNewForm() {
        setEditingProject(null)
        setView("form")
    }

    function showList() {
        setEditingProject(null)
        setView("list")
    }

    function showOutline() {
        setEditingProject(null)
        setView("outline")
    }

    function editProject(project) {
        setEditingProject(project)
        setView("form")
    }

    return (
        <div>

            <Header
                onNewRfe={showNewForm}
                onViewRfes={showList}
                onOutline={showOutline}
            />

            <Form
                selectedRFEId={
                    editingProject?.id || null
                }
            />

        </div>
    )
}

export default App