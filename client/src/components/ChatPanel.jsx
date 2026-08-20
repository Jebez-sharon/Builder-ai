import React, { useEffect, useRef }from 'react'
import { UserIcon, BotIcon, BotMessageSquareIcon} from 'lucide-react'
import PromptInput from './PromptInput';

const ChatPanel = ({messages, onSend, loading}) => {
    const bottomRef = useRef(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'auto' });
    }, [messages, loading]);

  return (
    <div className='flex flex-col h-full bg-white'>
      {/* Messages Section */}
      <div className="flex-1 overflow-y-auto p-3 space-y-4">
        {messages?.length === 0 ?(
            <div className="h-full flex items-center justify-center">
                <p className='text-xs text-zinc-400 text-center'>
                    Ask AI to modify your website
                </p>
            </div>
        ):(
            messages?.map((message, i) => (
                <div key={i} className="flex gap-2.5 items-start text-xs">
                    <div className="size-6 rounded-full bg-zinc-100 flex items-center justify-center
                    shrink-0 mt-0.5">
                        {message.role === 'user' ? (
                            <UserIcon size={14} className='text-zinc-500'/>
                        ):(
                            <BotMessageSquareIcon size={14} className='text-zinc-500'/>
                        )}
                    </div>

                    <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-900 mb-0.5">
                            {message.role === 'user' ? 'You' : 'AI'}
                        </p>

                        <div className="text-zinc-600 leading-relaxed break-words">
                            {message.content.split(' - `/').map((text, index) => (
                                <span className="block mt-1" key={index}>
                                    <span className={index === 0 ? 'hidden' : ''}> - `/</span>
                                    {text}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            ))
        )}

        {/* Loading Bubble */}
        {loading && (
            <div className="flex gap-2.5 items-start text-xs">
                <div className="size-6 rounded-full bg-zinc-900/5 flex items-center justify-center shrink-0 mt-0.5">
                    <BotIcon size={13} className='text-zinc-900'/>
                </div>

                <div className="flex-1">
                    <p className="text-[11px] font-medium text-zinc-400 mb-2 uppercase tracking-wider">AI</p>
                    <div className="dot-loader">
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>
                </div>
            </div>
        )}
        <div ref={bottomRef}/>
      </div>

      {/* Input Section */}
      <div className="p-3 border-t border-zinc-200">
        <PromptInput 
            onSubmit={onSend}
            loading={loading}
            placeholder='Ask AI to modify....'
            autoFocus={true}
        />
      </div>
    </div>
  )
}

export default ChatPanel
