import type { MultiLineTextField, Field } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: MultiLineTextField
  allFields: Field[]
  onChange: (updated: MultiLineTextField) => void
}

export function MultiLineTextConfig({ field, allFields, onChange }: Props) {
  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as MultiLineTextField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <Input
          label="Placeholder"
          value={field.placeholder}
          onChange={e => onChange({ ...field, placeholder: e.target.value })}
          placeholder="Placeholder text…"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min length"
            type="number"
            min={0}
            value={field.minLength ?? ''}
            onChange={e => onChange({ ...field, minLength: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
          />
          <Input
            label="Max length"
            type="number"
            min={0}
            value={field.maxLength ?? ''}
            onChange={e => onChange({ ...field, maxLength: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
          />
        </div>

        <Input
          label="Rows"
          type="number"
          min={1}
          max={20}
          value={field.rows}
          onChange={e => onChange({ ...field, rows: Math.max(1, Number(e.target.value)) })}
        />
      </div>
    </div>
  )
}
