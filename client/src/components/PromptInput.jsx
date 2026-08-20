import React, {useEffect, useRef, useState} from "react"
import { ArrowRightIcon, CloudUploadIcon, Loader2Icon , MicIcon} from 'lucide-react'

const PromptInput =({
    onSubmit,
    loading=false,
    placeholder="Describe the website you want to build...",
    large = false,
    autoFocus = false,
    variant = 'default'
}) => {
    const [value, setValue] = useState('')
    const textareaRef = useRef(null)

    useEffect(() =>{
        if(autoFocus && textareaRef.current){
            textareaRef.current.focus();
        }
    }, [autoFocus])

    const handleSubmit = (e) =>{
        if (e) e.preventDefault()   
        const trimmed = value.trim()
        if (!trimmed || loading) return
        onSubmit(trimmed)
        setValue('')
    }

    const handleKeyDown = (e) => {
        if(e.key === 'Enter' && !e.shiftKey){
            e.preventDefault()
            handleSubmit() 
        }
    }

    if (variant === 'glass'){
        return(
            <form onSubmit={handleSubmit} className="w-full
             rounded-2xl border border-white/10 bg-white/5 
             p-4 backdrop-blur-xl transition-colors
              focus-within:border-white/20">
                <textarea 
                ref = {textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
                rows={3}
                className="w-full resize-none bg-transparent text-sm text-white placeholder:text-zinc-500 outline-none"
                />

                <div className="flex items-center justify-between pt-2">
                    
                    {/* File Upload Label */}
                    <label htmlFor="file" className="flex items-center justify-center p-2 rounded-lg text-zinc-400 hover:bg-white/5 cursor-pointer transition">
                    <input type="file" id="file" hidden />
                    <CloudUploadIcon size={18}/>
                    </label>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-end gap-2">
                        <button type="button" className="p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 cursor-pointer transition">
                        <MicIcon size={18} />
                        </button>

                        <button type="submit"
                        disabled={!value.trim() || loading}
                        className="flex items-center justify-center p-2 rounded-lg bg-white
                        text-zinc-900 hover:bg-zinc-200 transition disabled:opacity-30 disabled:cursor-not-allowed
                        cursor-pointer">
                            {loading ? (
                                <Loader2Icon size={18} className="animate-spin"/>
                            ):(
                                <ArrowRightIcon size={18}/>
                            )}
                        </button>
                    </div>

                </div>

            </form>
        )
    }
    
    return (
        <div className={`flex items-end gap-2 rounded-2xl border border-zinc-200 bg-white
            shadow-sm transition-all focus-within:border-zinc-400 focus-within:shadow-md focus-within:ring-4
            focus-within:ring-zinc-900/[0.04] ${large ? 'p-3.5' : 'p-2.5'}`}>
                <textarea 
                ref = {textareaRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={loading}
                rows={ large ? 5 : 1 }
                className={`w-full resize-none bg-transparent text-zinc-900 placeholder:text-zinc-400 outline-none px-1.5 py-1 leading-relaxed disabled:opacity-50 ${
                    large ? 'text-base' : 'text-sm'
                }`}
                />

                <button
                type="button"
                onClick={handleSubmit}
                disabled={!value.trim() || loading}
                style={{
                    width:large ? 36 :24,
                    height: large ? 36 : 24
                }}
                className="flex items-center justify-center rounded-xl bg-zinc-900 text-white
                hover:bg-zinc-700 active:scale-95 transition-all disabled:opacity-20
                disabled:cursor-not-allowed disabled:hover:bg-zinc-900 shrink-0
                cursor-pointer">
                    {
                        loading?(
                            <Loader2Icon size={large ? 20: 15} className="animate-spin"/>
                        ):(
                            <ArrowRightIcon size={large ? 20 : 15}/>
                        )
                    }
                </button>
            </div>
    )

    
}

export default PromptInput