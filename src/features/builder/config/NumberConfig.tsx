import type { NumberField, Field } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Toggle } from '@/components/ui/Toggle'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: NumberField
  allFields: Field[]
  onChange: (updated: NumberField) => void
}

const DECIMAL_OPTIONS = [0, 1, 2, 3, 4].map(n => ({
  value: String(n),
  label: n === 0 ? 'Integer (0)' : `${n} decimal${n > 1 ? 's' : ''}`,
}))

export function NumberConfig({ field, allFields, onChange }: Props) {
  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as NumberField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min value"
            type="number"
            value={field.min ?? ''}
            onChange={e => onChange({ ...field, min: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
          />
          <Input
            label="Max value"
            type="number"
            value={field.max ?? ''}
            onChange={e => onChange({ ...field, max: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
          />
        </div>

        <Select
          label="Decimal places"
          options={DECIMAL_OPTIONS}
          value={String(field.decimalPlaces)}
          onChange={e => onChange({ ...field, decimalPlaces: Number(e.target.value) as NumberField['decimalPlaces'] })}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prefix"
            value={field.prefix}
            onChange={e => onChange({ ...field, prefix: e.target.value })}
            placeholder="e.g. $"
          />
          <Input
            label="Suffix"
            value={field.suffix}
            onChange={e => onChange({ ...field, suffix: e.target.value })}
            placeholder="e.g. kg"
          />
        </div>
      </div>
    </div>
  )
}
