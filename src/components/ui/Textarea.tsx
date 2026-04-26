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
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          htmlFor={inputId}
          className="text-sm font-medium text-neutral-700"
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
          'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-0 outline-none resize-none transition-all duration-150 placeholder:text-neutral-400',
          error
            ? 'border-danger-500 focus:ring-3 focus:ring-danger-500/20'
            : 'border-neutral-300 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15',
          className,
        ].join(' ')}
      />
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
