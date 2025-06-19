'use client'

import { useState } from 'react'
import { uploadFile } from '@/utils/storage'
import { CheckCircleIcon, CloudArrowUpIcon } from '@heroicons/react/24/solid'

export default function FileUploader() {
    const [file, setFile]       = useState(null)
    const [status, setStatus]   = useState('idle')   // idle | uploading | done | error
    const [message, setMessage] = useState('')

    const handleSelect = e => {
        const f = e.target.files[0]
        setFile(f)
        setStatus('idle')
        setMessage(f ? `Selected: ${f.name}` : '')
    }

    const handleUpload = async () => {
        if (!file) return
        setStatus('uploading')
        setMessage('Uploading…')

        const { error } = await uploadFile(file, '')      // upload to root
        if (error) {
            setStatus('error')
            setMessage(error.message ?? 'Upload failed')
        } else {
            setStatus('done')
            setMessage('✅ Uploaded!')
            setFile(null)
            window.dispatchEvent(new Event('file-uploaded'))
        }
    }

    const btnStyles = {
        idle:        'bg-blue-600 hover:bg-blue-700',
        uploading:   'bg-blue-400 cursor-not-allowed',
        done:        'bg-green-600',
        error:       'bg-red-600'
    }[status]

    return (
        <div className="space-y-3">
            <input
                type="file"
                onChange={handleSelect}
                className="file:mr-4 file:rounded file:border-0 file:bg-gray-700 file:p-2 file:text-sm"
            />

            <button
                onClick={handleUpload}
                disabled={status === 'uploading'}
                className={`flex items-center gap-2 rounded px-4 py-2 text-sm text-white ${btnStyles}`}
            >
                {status === 'done' ? (
                    <CheckCircleIcon className="h-5 w-5" />
                ) : (
                    <CloudArrowUpIcon className="h-5 w-5 animate-bounce" />
                )}
                {status === 'uploading' ? 'Uploading…' : 'Upload'}
            </button>

            {message && (
                <p
                    className={{
                        idle:  'text-gray-400',
                        done:  'text-green-400',
                        error: 'text-red-400'
                    }[status] ?? ''}
                >
                    {message}
                </p>
            )}
        </div>
    )
}
