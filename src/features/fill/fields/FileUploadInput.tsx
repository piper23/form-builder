import { useRef } from 'react'
import type { FileUploadField, FileMetadata } from '@/schema'
import { Button } from '@/components/ui/Button'

interface Props {
  field: FileUploadField
  value: FileMetadata[]
  onChange: (value: FileMetadata[]) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function FileUploadInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleFiles(files: FileList | null) {
    if (!files) return
    const newFiles: FileMetadata[] = Array.from(files).map(f => ({
      name: f.name,
      size: f.size,
      type: f.type,
    }))
    const combined = [...value, ...newFiles]
    const limited = field.maxFiles ? combined.slice(0, field.maxFiles) : combined
    onChange(limited)
  }

  function removeFile(idx: number) {
    onChange(value.filter((_, i) => i !== idx))
  }

  const atMax = field.maxFiles !== null && value.length >= field.maxFiles

  return (
    <div className="flex flex-col gap-2">
      <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
        {field.label}
        {isRequired && <span className="text-danger-500 ml-0.5">*</span>}
      </label>

      <div className="border-2 border-dashed border-neutral-300 rounded-xl p-5 text-center hover:border-brand-400 transition-colors">
        <span className="text-2xl mb-2 block">📎</span>
        <p className="text-sm text-neutral-500 mb-3">
          {atMax
            ? `Maximum ${field.maxFiles} file${field.maxFiles !== 1 ? 's' : ''} reached`
            : 'Drop files here or click to browse'}
        </p>
        {!atMax && (
          <Button
            type="button"
            variant="secondary"
            size="sm"
            disabled={isDisabled}
            onClick={() => inputRef.current?.click()}
          >
            📂 Choose files
          </Button>
        )}
        <input
          ref={inputRef}
          type="file"
          multiple={!field.maxFiles || field.maxFiles > 1}
          accept={field.allowedTypes || undefined}
          className="sr-only"
          onChange={e => handleFiles(e.target.files)}
          disabled={isDisabled || atMax}
          tabIndex={-1}
        />
        {field.allowedTypes && (
          <p className="text-xs text-neutral-400 mt-2">
            Accepted: {field.allowedTypes}
          </p>
        )}
      </div>

      {value.length > 0 && (
        <ul className="space-y-1">
          {value.map((f, idx) => (
            <li key={idx} className="flex items-center gap-2 px-3 py-2 bg-neutral-50 rounded-lg border border-neutral-200">
              <span className="text-sm">📄</span>
              <span className="flex-1 text-sm text-neutral-700 truncate min-w-0">{f.name}</span>
              <span className="text-xs text-neutral-400 shrink-0">{(f.size / 1024).toFixed(1)} KB</span>
              {!isDisabled && (
                <button
                  type="button"
                  onClick={() => removeFile(idx)}
                  className="text-neutral-400 hover:text-danger-500 transition-colors shrink-0"
                  aria-label="Remove file"
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
