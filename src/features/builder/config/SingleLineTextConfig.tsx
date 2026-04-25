import type { SingleLineTextField } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { BaseFieldConfig } from './BaseFieldConfig'
import type { Field } from '@/schema'

interface Props {
  field: SingleLineTextField
  allFields: Field[]
  onChange: (updated: SingleLineTextField) => void
}

export function SingleLineTextConfig({ field, allFields, onChange }: Props) {
  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as SingleLineTextField)} />

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

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Prefix"
            value={field.prefix}
            onChange={e => onChange({ ...field, prefix: e.target.value })}
            placeholder="e.g. https://"
          />
          <Input
            label="Suffix"
            value={field.suffix}
            onChange={e => onChange({ ...field, suffix: e.target.value })}
            placeholder="e.g. .com"
          />
        </div>
      </div>
    </div>
  )
}
