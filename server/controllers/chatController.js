import { Project } from "../models/Project.js";
import { reviseProject } from "../services/ai.js";
import {applyOperations} from "../services/diff.js";

export function buildManifest(files){
    const manifest = [];
    for (const [path, entry] of Object.entries(files)){
        manifest.push({
            path,
            hash:entry.hash,
            size:entry.content.length
        });
    }
    return manifest
}

// POST /api/projects/:id/chat
// Send a revision prompt and return updated project
export async function chat(req, res) {
    const { prompt } =req.body;

    if(!prompt || typeof prompt !== 'string'){
        return res.status(400).json({error:'prompt is required'});
    }

    if(!req.user){
        return res.status(401).json({error:'Unauthorized'});
    }

    const project = await Project.findOne({
        _id: req.params.id,
        owner:req.user.userId
    });

    if(!project){
        return res.status(404).json({error:'Project not found'});
    }

    project.status = 'revising';
    project.messages.push({
        role:'user',
        content:prompt,
        timestamp: new Date()
    });
    await project.save();

    try{
        // Build compact manifest that contains path, hash , size instead of sending all code
        const manifest = buildManifest(project.files);

        // Include all files contents so that AI can do accurate search and replace
        const relevantFiles = {};
        for (const[path, entry] of Object.entries(project.files)){
            relevantFiles[path] = entry.content;
        }

        // Recent messages for context(last 4 maximum)
        const recentMessages = project.messages.slice(-4).map(m =>({
            role: m.role,
            content: m.content
        }));

        console.log('Calling AI with manifest and relevant files...');

        // Call AI with manifest + relevant files
        const result = await reviseProject(prompt, manifest, relevantFiles, recentMessages);

        console.log('AI got result:', result.operations?.length || 0, 'operations -',result.description);

        // Apply operations to file map
        const {files:updatedFiles, applied, errors} = applyOperations(project.files, result.operations);

        if(errors.length >0){
            console.warn('Operation errors:', errors);
        }

        // Update project in database
        project.files = updatedFiles;
        project.markModified('files');
        project.version += 1;
        project.status = 'completed';

        project.messages.push({
            role:'assistant',
            content:result.description + (errors.length >0 ? '\n\n(With some operation errors)' : ''),
            timestamp: new Date()
        });

        await project.save();

        // return updated project
        const filesObject = {}
        for (const[path, entry] of Object.entries(project.files)){
            filesObject[path] = entry.content;
        }

        res.json({
            _id:project.id,
            name:project.name,
            description:project.description,
            files:filesObject,
            messages: project.messages,
            version: project.version,
            status: project.status,
            applied,
            errors,
            aiDescription:result.description
        });
    }catch(err){
        console.error(err);
        project.status='completed';
        await project.save();
        res.status(500).json({error:err.message || 'Failed to process revision request'});
    }
}