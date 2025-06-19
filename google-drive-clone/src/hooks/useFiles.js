'use client'

import { useEffect, useState, useCallback } from 'react'
import {
    listFiles,
    deleteFiles,
    renameFile,
} from '@/utils/storage'

/**
 * React hook that wraps Supabase-Storage file operations.
 *
 * @param {string} initialPath - Folder prefix, e.g. '' for root or 'photos/vacation/'.
 *                               **Must** end with a trailing slash if not root.
 */
export default function useFiles (initialPath = '') {
    const [path, setPath]   = useState(initialPath)  // current folder
    const [files, setFiles] = useState([])           // file array from Supabase
    const [loading, setLoading] = useState(true)

    /** 👉 Fetch the list for the current path */
    const refresh = useCallback(async () => {
        setLoading(true)
        const { data, error } = await listFiles(path)
        if (!error) setFiles(data ?? [])
        setLoading(false)
    }, [path])

    /** 👉 Remove a single file (by name, not full path) */
    const remove = useCallback(async (name) => {
        // Supabase expects full path relative to bucket root
        const fullPath = `${path}${name}`
        const { error } = await deleteFiles([fullPath])
        if (!error) refresh()
    }, [path, refresh])

    /** 👉 Rename a file inside the current folder */
    const rename = useCallback(async (oldName, newName) => {
        if (!newName || oldName === newName) return
        const oldPath = `${path}${oldName}`
        const newPath = `${path}${newName}`
        const { error } = await renameFile(oldPath, newPath)
        if (!error) refresh()
    }, [path, refresh])

    /** Auto-load whenever the folder path changes */
    useEffect(() => { refresh() }, [refresh])

    return {
        path, setPath,   // 🔹 for breadcrumb / navigation
        files, loading,  // 🔹 data + loader flag
        refresh, remove, rename
    }
}
