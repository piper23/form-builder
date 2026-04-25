import type { SingleSelectField } from '@/schema'

interface Props {
  field: SingleSelectField
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function SingleSelectInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  const labelId = `ssi-${field.id}`

  return (
    <div className="flex flex-col gap-2">
      <label id={labelId} className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
        {field.label}
        {isRequired && <span className="text-danger-500 ml-0.5">*</span>}
      </label>

      {field.displayType === 'radio' && (
        <div className="space-y-2" role="radiogroup" aria-labelledby={labelId}>
          {field.options.map(opt => (
            <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
              <input
                type="radio"
                name={field.id}
                value={opt.label}
                checked={value === opt.label}
                onChange={() => !isDisabled && onChange(opt.label)}
                disabled={isDisabled}
                className="w-4 h-4 text-brand-500 border-neutral-300 focus:ring-brand-500"
              />
              <span className="text-sm text-neutral-700">{opt.label}</span>
            </label>
          ))}
        </div>
      )}

      {field.displayType === 'dropdown' && (
        <select
          value={value}
          onChange={e => onChange(e.target.value)}
          disabled={isDisabled}
          aria-labelledby={labelId}
          className="w-full border border-neutral-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 disabled:opacity-50 appearance-none"
        >
          <option value="">Select an option…</option>
          {field.options.map(opt => (
            <option key={opt.id} value={opt.label}>{opt.label}</option>
          ))}
        </select>
      )}

      {field.displayType === 'tiles' && (
        <div className="flex flex-wrap gap-2" role="radiogroup" aria-labelledby={labelId}>
          {field.options.map(opt => (
            <button
              key={opt.id}
              type="button"
              disabled={isDisabled}
              onClick={() => onChange(opt.label)}
              className={[
                'px-4 py-2 rounded-xl text-sm font-medium border transition-all duration-150',
                value === opt.label
                  ? 'border-brand-500 bg-brand-500 text-white shadow-sm'
                  : 'border-neutral-300 bg-white text-neutral-700 hover:border-brand-300 hover:bg-brand-50',
                isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer',
              ].join(' ')}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
