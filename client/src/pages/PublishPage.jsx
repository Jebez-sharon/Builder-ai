import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../api/api'
import Loading from '../components/Loading'
import { AlertCircle } from 'lucide-react'
import FullPagePreview from '../components/FullPagePreview'

export default function PublishPage() {
  // 1. Extract project ID from the url params
  const { id } = useParams()

  // 2. Define the necessary states
  const [project, setProject] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  //3. Fetch the public project data inside useEffect
  useEffect(() => {
    if (!id) return;

    const fetchPublicProject = async () => {
      try{
        // Network request to get the publicly published project
        const {data} = await api.get(`/api/projects/public/${id}`);
        setProject(data);
      }catch(error){
        console.error("Failed to load public project",error)
        // set the error message if the project isnt found or isnt published
        setError(error.response?.data?.error || error.message || 'This webiste is not available or is not published yet.')
      }finally{
        setLoading(false)
      }
    };

    fetchPublicProject();
  },[id]);

  // 4. Conditional Return: Loading state
  if (loading){
    return <Loading />
  }

  // 5. Conditinal Return: Error or missing project State
  if(error || !project){
    return(
      <div className="min-h-screen bg-zinc-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-sm border border-zinc-200 p-8 text-center">
          <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={24} className='text-red-500'/>
          </div>
          <h1 className="text-xl font-bold text-zinc-900 mb-2">
            Website Unavailable
          </h1>
          <p className="text-sm text-zinc-500 mb-6">{error}</p>

          <div className="pt-6 border-t border-zinc-100">
            <span className="text-zinc-400 font-medium tracking-tight">
              builder AI
            </span>
          </div>
        </div>
      </div>
    );
  }

  // 6. Final Return: The generated full page preview
  return <FullPagePreview files={project.files}/>

}
