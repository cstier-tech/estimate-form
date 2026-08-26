import { useState } from "react"

import NewestForm from "./NewestForm"
import ProjectViewer from "./ProjectViewer"

function ProjectsPage() {
    const [editingProject, setEditingProject] = useState(null)

    return (
        <div className='px-4 py-10 sm:px-6 lg:px-8 bg-gray-50 min-h-screen h-full'>
            {editingProject ? (
                <div  className='mx-auto max-w-3xl'>
                    <button
                        type="button"
                        onClick={() => setEditingProject(null)}
                        className="mb-4 rounded bg-gray-500 px-4 py-2 text-white"
                    >
                        Back to Projects
                    </button>

                    <NewestForm
                        projectToEdit={editingProject}
                        onSaved={() => {
                            setEditingProject(null)
                        }}
                    />
                </div>
            ) : (
                <ProjectViewer
                    onEdit={project => {
                        setEditingProject(project)
                    }}
                />
            )}
        </div>
    )
}

export default ProjectsPage