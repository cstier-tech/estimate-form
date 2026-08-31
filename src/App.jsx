import { useState } from 'react'
import ProjectsPage from './pages/ProjectsPage'
import Header from './components/layout_parts/Header'
import Form from './Form2/Form'
import Steppers from './Form2/Steppers'

// user, clientName and customerNumber come from URL query params
// (e.g. ?user=Jane&clientName=Acme&customerNumber=12345), not the form.
function readUrlParam(name) {
  return new URLSearchParams(window.location.search).get(name) || ''
}

function App() {
  const user = readUrlParam('user')
  const clientName = readUrlParam('clientName')
  const customerNumber = readUrlParam('customerNumber')

  // 'list' shows ProjectViewer, 'form' shows NewestForm, 'outline' shows the
  // FormOutline testing reference. The header buttons are the only nav.
  const [view, setView] = useState('list')
  const [editingProject, setEditingProject] = useState(null)

  function showNewForm() {
    setEditingProject(null)
    setView('form')
  }

  function showList() {
    setEditingProject(null)
    setView('list')
  }

  function showOutline() {
    setEditingProject(null)
    setView('outline')
  }

  function editProject(project) {
    setEditingProject(project)
    setView('form')
  }

  const [projectName, setProjectName] = useState('')

  return (
    <div>
      <Header
        onNewRfe={showNewForm}
        onViewRfes={showList}
        onOutline={showOutline}
      />
      {/* <ProjectsPage
        view={view}
        editingProject={editingProject}
        user={user}
        clientName={clientName}
        customerNumber={customerNumber}
        onEditProject={editProject}
        onSaved={showList}
      /> */}
      
      <Form
        projectName={projectName}
        setProjectName={setProjectName}
      />
    </div>
  )
}

export default App
