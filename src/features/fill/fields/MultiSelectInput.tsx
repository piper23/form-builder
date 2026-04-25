import type { MultiSelectField } from '@/schema'

interface Props {
  field: MultiSelectField
  value: string[]
  onChange: (value: string[]) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function MultiSelectInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  const labelId = `msi-${field.id}`

  function toggle(label: string) {
    if (isDisabled) return
    if (value.includes(label)) {
      onChange(value.filter(v => v !== label))
    } else {
      onChange([...value, label])
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label id={labelId} className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
        {field.label}
        {isRequired && <span className="text-danger-500 ml-0.5">*</span>}
        {(field.minSelections || field.maxSelections) && (
          <span className="ml-1 text-neutral-400 normal-case font-normal">
            ({[field.minSelections && `min ${field.minSelections}`, field.maxSelections && `max ${field.maxSelections}`].filter(Boolean).join(', ')})
          </span>
        )}
      </label>

      <div className="space-y-2" role="group" aria-labelledby={labelId}>
        {field.options.map(opt => (
          <label key={opt.id} className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={value.includes(opt.label)}
              onChange={() => toggle(opt.label)}
              disabled={isDisabled}
              className="w-4 h-4 rounded text-brand-500 border-neutral-300 focus:ring-brand-500"
            />
            <span className="text-sm text-neutral-700">{opt.label}</span>
          </label>
        ))}
      </div>

      {error && <p className="text-xs text-danger-500">{error}</p>}
    </div>
  )
}
