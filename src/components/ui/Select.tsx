import type { SelectHTMLAttributes } from 'react'

interface SelectOption {
  value: string
  label: string
}

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  options: SelectOption[]
  isRequired?: boolean
  placeholder?: string
}

export function Select({
  label,
  error,
  options,
  isRequired = false,
  placeholder,
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
      <select
        id={inputId}
        {...rest}
        className={[
          'w-full rounded-lg border px-3 py-2 text-sm bg-neutral-0 outline-none transition-colors cursor-pointer appearance-none',
          error
            ? 'border-danger-500 focus:ring-2 focus:ring-danger-500/30'
            : 'border-neutral-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20',
          className,
        ].join(' ')}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map(o => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
