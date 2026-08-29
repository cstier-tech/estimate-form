import NewestForm from "./NewestForm"
import ProjectViewer from "./ProjectViewer"
import FormOutline from "./FormOutline"

function ProjectsPage({ view, editingProject, user, clientName, customerNumber, onEditProject, onSaved }) {
    return (
        <div className='px-4 py-10 sm:px-6 lg:px-8 bg-gray-50 min-h-screen h-full'>
            {view === 'form' && (
                // <div className='mx-auto max-w-3xl'>
                <NewestForm
                    key={editingProject?.id ?? 'new'}
                    projectToEdit={editingProject}
                    user={user}
                    clientName={clientName}
                    customerNumber={customerNumber}
                    onSaved={onSaved}
                />
                // </div>
            )}

            {view === 'outline' && <FormOutline />}

            {view === 'list' && (
                <ProjectViewer onEdit={onEditProject} />
            )}
        </div>
    )
}

export default ProjectsPage
