import { useState } from 'react'
import EstimateForm from './pages/EstimateForm'
import EstimateViewer from './pages/EstimateViewer'
import Button from './components/Button'
import ButtonBar from './components/ButtonBar'
import NewEstimateForm from './pages/NewEstimateForm'




function App() {
  const [activePage, setActivePage] = useState('form')
  const [editingEstimateId, setEditingEstimateId] = useState(null)
  return (
    <>
      <ButtonBar>
        <Button label='Form' onClick={(e) => setActivePage('form')} />
        <Button label='View' onClick={(e) => setActivePage('view')} />
      </ButtonBar>

      {/* {activePage == 'form' &&
        <EstimateForm estimateId={editingEstimateId} />
      } */}

      {activePage == 'view' &&
        <EstimateViewer
          onEdit={(id) => {
            setEditingEstimateId(id)
            setActivePage('form')
          }}
        />
      }
      <NewEstimateForm />
    </>
  )
}

export default App
