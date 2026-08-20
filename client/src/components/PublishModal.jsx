import React from 'react'
import { X } from 'lucide-react'
import toast from 'react-hot-toast'


const PublishModal = ({ publishUrl, onClose }) => {
    const handleCopyLink = () =>{
        if (!publishUrl) return;
        navigator.clipboard.writeText(publishUrl);
        toast.success('Public link copied to clipboard');
    }
  return (
    <div className='absolute inset-0 z-50 flex items-center justify-center
    bg-black/50 backdrop-blur-sm'>
        <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 relative border border-zinc-200">
            <button
                onClick={onClose}
                className='absolute right-4 top-4 text-zinc-400
                hover:text-zinc-600 cursor-pointer'
            >
                <X size={16}/>
            </button>


            <div>
                <h3 className="text-lg font-semibold text-zinc-900 mb-1">
                Your website is live
            </h3>
            <p className="text-sm text-zinc-500 mb-4">Anyone can visit your website using this link.</p>
            </div>

            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 mb-1">
                        Published Link
                    </label>
                    <input 
                    type="text"
                    readOnly
                    value={publishUrl} 
                    className="w-full px-3 py-2 bg-zinc-50 border border-zinc-200 rounded-lg text-sm text-zinc-600 focus:outline-none" />
                </div>

                <div className="flex gap-3">
                    <button 
                    onClick={handleCopyLink}
                    className="flex-1 bg-zinc-900 text-white px-4 py-2 rounded-lg text-sm
                    font-medium hover:bg-zinc-800 transition-colors">
                        Copy Link
                    </button>

                    <button 
                    onClick={()=> window.open(publishUrl, '_blank')}
                    className="flex-1 bg-indigo-600 text-white px-4 py-2
                    rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                        Open Site
                    </button>
                </div>
            </div>
        </div>
      
    </div>
  )
}

export default PublishModal
