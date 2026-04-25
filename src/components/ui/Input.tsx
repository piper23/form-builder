import type { InputHTMLAttributes, ReactNode } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  prefix?: ReactNode
  suffix?: ReactNode
  isRequired?: boolean
}

export function Input({
  label,
  error,
  prefix,
  suffix,
  isRequired = false,
  className = '',
  id,
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
      <div
        className={[
          'flex items-center rounded-lg border bg-neutral-0 transition-colors',
          error
            ? 'border-danger-500 focus-within:ring-2 focus-within:ring-danger-500/30'
            : 'border-neutral-300 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-500/20',
        ].join(' ')}
      >
        {prefix && (
          <span className="pl-3 text-sm text-neutral-500 select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          {...rest}
          className={[
            'flex-1 px-3 py-2 text-sm bg-transparent outline-none placeholder:text-neutral-400 min-w-0',
            prefix ? 'pl-1' : '',
            suffix ? 'pr-1' : '',
            className,
          ].join(' ')}
        />
        {suffix && (
          <span className="pr-3 text-sm text-neutral-500 select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
