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
    <div className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-4 py-3 sm:px-6 lg:px-8">
        <ButtonBar>
          <Button label='Form' onClick={(e) => setActivePage('form')} />
          <Button label='View' onClick={(e) => setActivePage('view')} />
        </ButtonBar>
      </div>

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
    </div>
  )
}

export default App
