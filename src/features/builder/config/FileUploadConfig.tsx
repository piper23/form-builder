import type { FileUploadField, Field } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: FileUploadField
  allFields: Field[]
  onChange: (updated: FileUploadField) => void
}

export function FileUploadConfig({ field, allFields, onChange }: Props) {
  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as FileUploadField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <Input
          label="Allowed types"
          value={field.allowedTypes}
          onChange={e => onChange({ ...field, allowedTypes: e.target.value })}
          placeholder=".pdf, .jpg, .png"
        />

        <Input
          label="Max files"
          type="number"
          min={1}
          value={field.maxFiles ?? ''}
          onChange={e => onChange({ ...field, maxFiles: e.target.value ? Number(e.target.value) : null })}
          placeholder="No limit"
        />
      </div>
    </div>
  )
}
