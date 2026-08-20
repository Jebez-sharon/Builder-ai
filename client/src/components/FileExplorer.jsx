import React, { useMemo } from "react";
import {FolderIcon, FileCodeIcon, FileTextIcon} from 'lucide-react'
import { Children } from "react";

function getFileIcon(name) {
    if(name.endsWith('.css')){
        return <FileTextIcon size={14} className="text-sky-500 shrink-0"/>
    }
    if(name.endsWith('.jsx') ||name.endsWith('.js') ){
        return <FileCodeIcon size={14} className="text-amber-500 shrink-0"/>
    }
    if(name.endsWith('.json')){
        return <FileTextIcon size={14} className="text-emerald-500 shrink-0"/>
    }
        return <FileTextIcon size={14} className="text-zinc-400 shrink-0"/>   
}

function buildTree(paths){
    const root =[];
    for(const filePath of paths.sort()){
        const parts = filePath.split('/').filter(Boolean);
        let current = root;
        for (let i = 0; i< parts.length; i++){
            const name = parts[i];
            const isLast = i === parts.length -1;
            const fullPath = '/' + parts.slice(0, i+1).join('/');
            let existing = current.find((n) => n.name === name);
            if (!existing){
                existing = {
                    name,
                    path:fullPath,
                    isDirectory:!isLast,
                    children:[]
                };
                current.push(existing)
            }
            current = existing.children;
        }
    }
    return root;
}

function TreeItem({node, activeFile, onFileSelect, depth = 0}){
    const isActive = node.path === activeFile;
    
    if (node.isDirectory){
        return(
            <div>
                <div className="flex items-center gap-1.5 py-1 text-xs text-zinc-600 font-medium"
                style={{ paddingLeft: `${depth * 12 + 8}px`}}>
                    <FolderIcon size={14} className="text-zinc-400 shrink-0"/>
                    <span>{node.name}</span>
                </div>
                <div>
                    {node.children.map((child) => (
                        <TreeItem 
                            key = {child.path}
                            node={child}
                            activeFile={activeFile}
                            onFileSelect={onFileSelect}
                            depth={depth+1}
                        />
                    ))}
                </div>
            </div>
        );
    }

    return (
        <button
            onClick={() => onFileSelect(node.path)}
            className={`w-full flex items-center gap-1.5 py-1 text-xs text-left transition-colors ${
                isActive
                ? 'bg-zinc-100 text-zinc-900 font-medium'
                : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'
            }`}
            style={{ paddingLeft: `${depth * 12 + 8}px`}}
        >
            {getFileIcon(node.name)}
            <span className="truncate">{node.name}</span>
        </button>
    );
}

const FileExplorer = ({ files , activeFile, onFileSelect }) =>{
    const tree = useMemo(() => {
        return buildTree(Object.keys(files || {}));
    },[files])

    return(
        <div className="h-full overflow-y-auto py-2">
            <p className="px-3 pb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                Files
            </p>
            <div>
                {tree.map((node) => (
                    <TreeItem 
                        key={node.path}
                        node={node}
                        activeFile={activeFile}
                        onFileSelect={onFileSelect} 
                    />
                ))}
            </div>
        </div>
    );
};

export default FileExplorer;