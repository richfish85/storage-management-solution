import { supabase } from '@/utils/supabaseClient'




export async function renameFile(oldPath, newPath){
    return supabase.storage.from('drive-files').move(oldPath, newPath)
}

export async function listFiles(path = '') {
    return supabase.storage.from('drive-files').list(path, { limit: 1000 })
}

export async function deleteFiles(pathsArray) {
    return supabase.storage.from('drive-files').remove(pathsArray)
}


export async function uploadFile(file, path = ''){
    if (!file) return {error: 'No file provided'}

    const filePath = path ? `${path}/${file}` : file.name

    const { data, error } = await supabase
        .storage
        .from('drive-files')
        .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true,
        })
    return { data, error }
}

export function getPublicUrl(path) {
    const { data } = supabase
        .storage
        .from('drive-files')
        .getPublicUrl(path)

    return data.publicUrl
}

export async function getSignedUrl(path, expiresIn = 60) {
    const { data, error } = await supabase
        .storage
        .from('drive-files')
        .createSignedUrl(path, expiresIn)

    return { data, error }
}

