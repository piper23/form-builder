import type { InputHTMLAttributes, ReactNode } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix' | 'suffix'> {
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
      <div
        className={[
          'flex items-center rounded-xl border bg-neutral-0 transition-all duration-150',
          error
            ? 'border-danger-500 focus-within:ring-3 focus-within:ring-danger-500/20'
            : 'border-neutral-300 focus-within:border-brand-500 focus-within:ring-3 focus-within:ring-brand-500/15',
        ].join(' ')}
      >
        {prefix && (
          <span className="pl-3.5 text-sm text-neutral-400 select-none shrink-0">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          {...rest}
          className={[
            'flex-1 px-3.5 py-2.5 text-sm bg-transparent outline-none placeholder:text-neutral-400 min-w-0',
            prefix ? 'pl-1.5' : '',
            suffix ? 'pr-1.5' : '',
            className,
          ].join(' ')}
        />
        {suffix && (
          <span className="pr-3.5 text-sm text-neutral-400 select-none shrink-0">
            {suffix}
          </span>
        )}
      </div>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
