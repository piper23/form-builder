import type { DateField, Field } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: DateField
  allFields: Field[]
  onChange: (updated: DateField) => void
}

export function DateConfig({ field, allFields, onChange }: Props) {
  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as DateField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <Toggle
          isOn={field.prefillToday}
          onChange={v => onChange({ ...field, prefillToday: v })}
          label="Pre-fill with today's date"
          description="Sets to today when a new response is opened"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min date"
            type="date"
            value={field.minDate ?? ''}
            onChange={e => onChange({ ...field, minDate: e.target.value || null })}
          />
          <Input
            label="Max date"
            type="date"
            value={field.maxDate ?? ''}
            onChange={e => onChange({ ...field, maxDate: e.target.value || null })}
          />
        </div>
      </div>
    </div>
  )
}
