import React, { version } from 'react'
import {ArrowLeft, Eye, Code2Icon , ExternalLinkIcon, Globe, Loader2, Download} from 'lucide-react'
const BuilderHeader = ({
    projectName,
    version,
    showCode,
    publishing,
    onToggleShowCode,
    onOpenPreview,
    onPublish,
    onDownload,
    onBack,
    onLogout,
}) =>{
    return(
        <header 
        className='h-14 border-b border-zinc-200 px-4 flex items-center justify-between bg-white select-none'>
            {/* Left Section: Back button , Logo , project name and version */}
            <div className="flex items-center gap-3">
                <button
                onClick={onBack}
                className='p-1.5 rounded-md hover:bg-zinc-100 text-zinc-600
                 transition-colors'
                 title='Back to Projects'
                >
                    <ArrowLeft size={16}/>
                </button>

                <img src="/logo.svg" alt="logo" className='size-5 invert' />

                <span className="font-semibold text-sm text-zinc-900 max-w-[200px] truncate">
                    {projectName}
                </span>

                <span className="text-xs px-2 py-0.5 rounded-full bg-zinc-100 text-zinc-600 font-medium">
                    v{version}
                </span>
            </div>

            {/* Right Section: Action Buttons */}

            <div className="flex items-center gap-1.5">
                {/* Toggle Code / Preview Button */}
                <button
                onClick={onToggleShowCode}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                     rounded-md border transition-colors ${
                        showCode?
                        'bg-zinc-900 text-white border-zinc-900 hover:bg-zinc-800':
                        'bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-50'
                     }`}
                >
                    {
                        showCode ?(
                            <>
                            <Eye size={13}/>
                            <span>Preview</span>
                            </>
                        ):(
                            <>
                            <Code2Icon size={13}/>
                            <span>Code</span>
                            </>
                        )
                    }
                </button>

                {/* Open Full Preview in New Tab */}
                <button
                onClick={onOpenPreview}
                className='flex items-center gap-1.5 px-3 py-1.5 
                text-xs font-medium rounded-md border border-zinc-200 text-zinc-700
                bg-white hover:bg-zinc-50 transition-colors'
                >
                    <ExternalLinkIcon size={13}/>
                    <span>Open Preview</span>
                </button>

                {/* Publish Button */}
                <button
                onClick={onPublish}
                disabled={publishing}
                className='flex items-center gap-1.5 px-3 py-1.5
                text-xs font-medium rounded-md border border-zinc-200 text-zinc-700
                bg-white hover:bg-zinc-50 disabled:opacity-50 transition-colors'
                >
                    {publishing ?(
                        <Loader2 size={13} className='animate-spin text-zinc-700'/>
                    ):(
                        <Globe size={13}/>
                    )}
                    <span>Publish</span>
                </button>

                {/* Export /Download code Button */}
                <button 
                onClick={onDownload}
                className="flex items-center gap-1.5 px-3 py-1.5
                text-xs font-medium rounded-md border border-zinc-200
                text-zinc-700 bg-white hover:bg-zinc-50 transition-colors"
                >
                    <Download size={13}/>
                    <span>Export</span>
                </button>

                {/* Sign Out Button */}
                <button
                onClick={onLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs
                font-medium rounded-md border border-zinc-200 text-zinc-700 
                bg-white hover:bg-zinc-50 transition-colors">
                    <span>Sign Out</span>
                </button>
            </div>
        </header>
    );
};

export default BuilderHeader;
