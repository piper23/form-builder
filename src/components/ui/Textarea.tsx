import type { TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
  isRequired?: boolean
}

export function Textarea({
  label,
  error,
  isRequired = false,
  className = '',
  id,
  rows = 3,
  ...rest
}: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium text-neutral-700 uppercase tracking-wide"
        >
          {label}
          {isRequired && <span className="text-danger-500 ml-0.5">*</span>}
        </label>
      )}
      <textarea
        id={inputId}
        rows={rows}
        {...rest}
        className={[
          'w-full rounded-lg border px-3 py-2 text-sm bg-white outline-none resize-none transition-colors placeholder:text-neutral-400',
          error
            ? 'border-danger-500 focus:ring-2 focus:ring-danger-500/30'
            : 'border-neutral-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          className,
        ].join(' ')}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
