import React, { useEffect } from 'react'
import { useAppContext } from '../context/AppContext'
import PromptInput from '../components/PromptInput';
import { homeTags } from '../assets/assets';
import { useNavigate } from 'react-router-dom';
import { ArrowRightIcon, ClockIcon, Trash2Icon } from 'lucide-react';
import moment from 'moment'

const HomePage = () => {

  const { user, projects, loadingProjects, generatingProject, loadProjects, handleGenerate, handleDelete, logout } = useAppContext();
  const navigate = useNavigate()  

  useEffect(() => {
    loadProjects()
  },[loadProjects])

  return (
    <div className="h-screen overflow-y-auto text-white font-sans bg-[url('/bg-img.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      
      {/* Navigation */}
      <nav className="sticky top-0 z-20 flex items-center justify-between px-6 py-4 backdrop-blur-md bg-black/10 border-b border-white/[0.06]">
        <div className="flex items-center gap-2.5">
          <img src="/logo.svg" alt="logo" className='size-6' />
          <span className="text-xl font-semibold tracking-tight">Builder AI</span>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <div className="flex items-center gap-2.5">
            <div className="size-7 rounded-full bg-gradient-to-br from-red-500 to-amber-500 grid place-items-center text-[11px] font-bold uppercase">
              {user?.name?.charAt(0) || '?'}
            </div>
            <span className="text-zinc-200 font-medium">{user?.name}</span>
          </div>
          <button
            onClick={logout}
            className="px-3 py-1.5 rounded-lg border border-white/15 bg-white/[0.03] text-zinc-300 text-xs font-medium
            hover:bg-white/10 hover:text-white hover:border-white/25 transition-all cursor-pointer">
            Sign out
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="flex flex-col items-center px-4 pt-16 pb-20">
        <div className="w-full max-w-2xl flex flex-col items-center">

          {/* Promo badge */}
          <div className="flex items-center gap-2 pl-1.5 pr-3.5 py-1.5 rounded-full 
          border border-amber-400/25 bg-amber-500/10 text-amber-200/90 text-xs mb-7 backdrop-blur-sm">
            <span className='px-2 py-0.5 rounded-full bg-amber-400 text-black font-bold text-[10px] tracking-wide'>
              PROMO
            </span>
            <span>Create your first project for free.</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-[3.25rem] font-bold tracking-tighter text-center leading-[1.05]
          bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
            Let's build your app together
          </h1>

          {/* Description */}
          <p className="text-sm md:text-base text-zinc-300/70 text-center mt-4 max-w-md leading-relaxed">
            Describe your idea and watch AI design, structure and launch your website instantly. No coding required.
          </p>

          {/* Prompt input with glassmorphic variant */}
          <div className="w-full mt-8">
            <PromptInput
              onSubmit={handleGenerate}  
              loading={generatingProject}
              placeholder='Create a portfolio website'
              variant='glass'
              autoFocus
            />
          </div>

          {/* Scrolling marquee tags */}
          <div className="masked-marque w-full mt-5 overflow-hidden py-1">
            <div className="flex animate-marquee gap-2.5 w-max">
              {homeTags.map((tag, index) => (
                <button
                  key={index}
                  onClick={() => handleGenerate(tag)}
                  disabled={generatingProject}
                  className="shrink-0 px-4 py-2 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-sm
                  text-xs text-zinc-300 hover:text-white hover:bg-white/10 hover:border-white/20
                  disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer">
                  {tag}
                </button>
              ))}
            </div>
          </div>

          {/* All projects */}
          {!loadingProjects && projects?.length > 0 && (
            <div className="w-full mt-12">
              <div className='flex items-center justify-between
               mb-4 px-1'>
                <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-[0.15em]">
                  Your projects
                </p>
                <span className="text-[11px] text-zinc-500 tabular-nums">
                  {projects.length} {projects.length === 1 ? 'project' : 'projects'}
                </span>
              </div>

              <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                {projects.map((p) => (
                  <div
                    key={p._id}
                    onClick={() => navigate(`/builder/${p._id}`)}
                    className="relative flex items-center justify-between p-3.5 rounded-xl border border-white/[0.08]
                    bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.07] hover:border-white/20
                    transition-all cursor-pointer group overflow-hidden">

                    <span className="absolute left-0 top-0 h-full w-0.5 bg-gradient-to-b from-red-500 to-amber-500
                    scale-y-0 group-hover:scale-y-100 transition-transform origin-center" />

                    <div className="flex-1 min-w-0 pr-4">
                      <p className="text-sm font-medium text-white truncate">{p.name}</p>
                      <div className="flex items-center gap-2.5 mt-1.5">
                        <span className="flex items-center gap-1.5 text-[11px] text-zinc-400">
                          <ClockIcon size={11} />
                          {moment(p.updatedAt || p.createdAt).fromNow()}
                        </span>
                        <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/[0.06] text-[10px] text-zinc-400 font-medium tabular-nums">
                          v{p.version}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          handleDelete(p._id)
                        }}
                        className='p-2 rounded-lg text-zinc-500 hover:text-red-400 
                        hover:bg-red-500/10 transition opacity-0 group-hover:opacity-100 cursor-pointer'>
                        <Trash2Icon size={14} />
                      </button>
                      <ArrowRightIcon size={15} className="text-zinc-500 group-hover:text-white 
                      group-hover:translate-x-0.5 transition-all mr-1" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

export default HomePage