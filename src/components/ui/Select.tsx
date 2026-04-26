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
      <select
        id={inputId}
        {...rest}
        className={[
          'w-full rounded-xl border px-3.5 py-2.5 text-sm bg-neutral-0 outline-none transition-all duration-150 cursor-pointer appearance-none',
          error
            ? 'border-danger-500 focus:ring-3 focus:ring-danger-500/20'
            : 'border-neutral-300 focus:border-brand-500 focus:ring-3 focus:ring-brand-500/15',
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
