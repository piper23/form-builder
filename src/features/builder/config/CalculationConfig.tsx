import type { CalculationField, AggregationType, Field, NumberField } from '@/schema'
import { Select } from '@/components/ui/Select'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: CalculationField
  allFields: Field[]
  onChange: (updated: CalculationField) => void
}

const AGGREGATION_OPTIONS: { value: AggregationType; label: string }[] = [
  { value: 'sum', label: '∑ Sum' },
  { value: 'average', label: '∅ Average' },
  { value: 'minimum', label: '↓ Minimum' },
  { value: 'maximum', label: '↑ Maximum' },
]

const DECIMAL_OPTIONS = [0, 1, 2, 3, 4].map(n => ({
  value: String(n),
  label: n === 0 ? '0 (integer)' : `${n} decimal${n > 1 ? 's' : ''}`,
}))

export function CalculationConfig({ field, allFields, onChange }: Props) {
  const numberFields = allFields.filter(
    (f): f is NumberField => f.type === 'number',
  )

  function toggleSource(id: string) {
    const current = field.sourceFieldIds
    if (current.includes(id)) {
      onChange({ ...field, sourceFieldIds: current.filter(s => s !== id) })
    } else {
      onChange({ ...field, sourceFieldIds: [...current, id] })
    }
  }

  return (
    <div className="space-y-4">
      <BaseFieldConfig
        field={field}
        allFields={allFields}
        onChange={f => onChange(f as CalculationField)}
        showRequired={false}
      />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Select
          label="Aggregation"
          options={AGGREGATION_OPTIONS}
          value={field.aggregation}
          onChange={e => onChange({ ...field, aggregation: e.target.value as AggregationType })}
        />

        <Select
          label="Decimal places"
          options={DECIMAL_OPTIONS}
          value={String(field.decimalPlaces)}
          onChange={e => onChange({ ...field, decimalPlaces: Number(e.target.value) as CalculationField['decimalPlaces'] })}
        />

        <div className="space-y-1">
          <span className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
            Source fields
          </span>
          {numberFields.length === 0 ? (
            <p className="text-xs text-neutral-400 italic">Add Number fields to use as sources.</p>
          ) : (
            <div className="space-y-1">
              {numberFields.map(nf => (
                <label key={nf.id} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={field.sourceFieldIds.includes(nf.id)}
                    onChange={() => toggleSource(nf.id)}
                    className="rounded border-neutral-300 text-brand-500 focus:ring-brand-500"
                  />
                  <span className="text-sm text-neutral-700">{nf.label || '(untitled number field)'}</span>
                </label>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
