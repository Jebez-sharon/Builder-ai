import React,{useEffect, useState} from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAppContext } from '../context/AppContext'
import Loading from '../components/Loading'
import { FolderTreeIcon, MessageSquareIcon } from 'lucide-react'
import api from '../api/api'
import toast from 'react-hot-toast'
import BuilderHeader from '../components/BuilderHeader'
import {exportProjectZip} from '../utils/exportProject'
import ChatPanel from '../components/ChatPanel'
import FileExplorer from '../components/FileExplorer'
import PreviewPanel from '../components/PreviewPanel'
import AgentProgressDashboard from '../components/AgentProgressDashboard'
import PublishModal from '../components/PublishModal'

const BuilderPage = () =>{
  const{
    activeProject,
    loadingActiveProject,
    chatLoading,
    activeFile,
    showCode,
    setActiveFile,
    setShowCode,
    loadProject,
    handleChat,
    logout
  } = useAppContext()

  const { id } = useParams()
  const navigate = useNavigate()

  const [leftTab, setLeftTab] = useState('chat')
  const [publishing, setPublishing] = useState(false)
  const [publishUrl, setPublishUrl] = useState(null)

  useEffect(()=>{
    if (!id) return
    loadProject(id)
  },[id])

  const handleOpenPreview = () =>{
    if(!id) return
    window.open(`/preview/${id}`,'_blank')
  }

  const handlePublish = async () => {
    if (!id) return
    setPublishing(true)
    try{
      await api.post(`/api/projects/${id}/publish`)
      const url = `${window.location.origin}/publish/${id}`
      setPublishUrl(url)
      toast.success('Website Published Successfully.')
    }catch(error){
      console.error('Failed to publish project',error)
      toast.error('Failed to publish project')
    }finally{
      setPublishing(false)
    }
  }

  const handleDownload = () =>{
    if (!activeProject) return
    exportProjectZip(activeProject)
  }

  if(loadingActiveProject || !activeProject){
    return <Loading />
  }

  return (
    <div className="h-screen flex flex-col bg-white text-zinc-900 relative">
      {/* top bar / header */}
      <BuilderHeader 
      projectName={activeProject.name}
      version={activeProject.version}
      showCode={showCode}
      publishing={publishing}
      onToggleShowCode={() => setShowCode(!showCode)}
      onOpenPreview= {handleOpenPreview}
      onPublish={handlePublish}
      onDownload= {handleDownload}
      onBack ={() => navigate('/')}
      onLogout={logout}
      />

      {/* main layout */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-[320px] shrink-0 flex flex-col border-r
        border-zinc-200 bg-white">
          {/* Sidebar Tabs */}
          <div className="flex border-b border-zinc-200">
            <button
            onClick={()=> setLeftTab('chat')}
            className={`flex-1 flex items-center justify-center
              gap-2 py-2.5 text-xs font-medium border-b-2 transition-colors
              ${leftTab === 'chat'?
                'border-zinc-900 text-zinc-900':
                'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <MessageSquareIcon size={14}/>
              <span>Chat</span>
            </button>

            <button
            onClick={() => setLeftTab('files')}
            className={`flex-1 flex items-center justify-center gap-2
              py-2.5 text-xs font-medium border-b-2 transition-colors ${
                leftTab === 'files'
                ? 'border-zinc-900 text-zinc-900'
                : 'border-transparent text-zinc-500 hover:text-zinc-700'
              }`}
            >
              <FolderTreeIcon size={14}/>
              <span>Files</span>
            </button>
          </div>

        {/* Sidebar Content */}
        <div className="flex-1 overflow-hidden">
          {leftTab === 'chat' ?(
            <ChatPanel
            messages={activeProject.messages}
            onSend={handleChat}
            loading={chatLoading}
            />
          ):(
            <FileExplorer 
              files={activeProject.files}
              activeFile={activeFile}
              onFileSelect={(path) => {
                setActiveFile(path)
                setShowCode(true)
              }}
            />
          )}
        </div>
        </div>

        {/* Preview or code area  */}
        <div className="flex-1 overflow-hidden">
          {activeProject.status === 'pending'||
          activeProject.status === 'generating' ||
          activeProject.status === 'failed' ? (
              <AgentProgressDashboard 
               project={activeProject}
              />
          ):(
            <PreviewPanel 
              project={activeProject}
              activeFile={activeFile}
              showCode={showCode}
            />
          )}
        </div>
      </div>

      {publishUrl && <PublishModal 
        publishUrl={publishUrl}
        onClose={() => setPublishUrl(null)}
      />
      }
    </div>
  )
}


export default BuilderPage
