'use client'

import { useState } from 'react'
import {
    PencilIcon,
    TrashIcon,
} from '@heroicons/react/24/outline'
import useFiles from '@/hooks/useFiles'

/**
 * Lists files in the current `path` ('' = bucket root) and lets the user
 * rename or delete each file.  Relies on:
 *   utils/storage.js   →  listFiles(), deleteFiles(), renameFile()
 *   hooks/useFiles.js  →  exposes { files, loading, remove, rename }
 *
 * Props
 * -----
 * path   string   folder prefix, always ending with '/' or '' for root
 */
export default function FileList({ path = '' }) {
    const { files, loading, remove, rename } = useFiles(path)

    // local state for “inline rename” UX
    const [editName, setEditName] = useState(null) // filename currently being edited
    const [temp, setTemp] = useState('')           // live value in the <input>

    /* ---- helpers -------------------------------------------------------- */

    const startEdit = (file) => {
        setEditName(file.name)
        setTemp(file.name)
    }

    const commitRename = async () => {
        if (temp && temp !== editName) {
            await rename(editName, temp)
        }
        setEditName(null)
        setTemp('')
    }

    /* ---- rendering ------------------------------------------------------ */

    if (loading) return <p className="text-gray-400">Loading…</p>
    if (!files.length) return <p className="text-gray-500">No files here yet.</p>

    return (
        <ul className="rounded bg-gray-800 divide-y divide-gray-700">
            {files.map((file) => (
                <li
                    key={file.id ?? file.name}
                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-700"
                >
                    {/* -------- file name / editable input -------- */}
                    {editName === file.name ? (
                        <input
                            className="bg-gray-900 rounded px-1 w-1/2"
                            value={temp}
                            autoFocus
                            onChange={(e) => setTemp(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') commitRename()
                                if (e.key === 'Escape') setEditName(null)
                            }}
                        />
                    ) : (
                        <span className="truncate">{file.name}</span>
                    )}

                    {/* -------- action buttons -------- */}
                    <div className="flex gap-3">
                        {/* rename */}
                        <button
                            onClick={() => startEdit(file)}
                            className="file-btn bg-green-600"
                            title="Rename"
                        >
                            <PencilIcon className="h-4 w-4" />
                        </button>

                        {/* delete */}
                        <button
                            onClick={() => remove(file.name)}
                            className="file-btn bg-red-600"
                            title="Delete"
                        >
                            <TrashIcon className="h-4 w-4" />
                        </button>
                    </div>
                </li>
            ))}
        </ul>
    )
}
