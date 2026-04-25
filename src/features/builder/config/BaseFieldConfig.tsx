import type { Field } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { ConditionsConfig } from './ConditionsConfig'

interface Props {
  field: Field
  allFields: Field[]
  onChange: (updated: Field) => void
  showRequired?: boolean
}

export function BaseFieldConfig({ field, allFields, onChange, showRequired = true }: Props) {
  return (
    <div className="space-y-4">
      <Input
        label="Label"
        value={field.label}
        onChange={e => onChange({ ...field, label: e.target.value })}
        placeholder="Field label…"
        isRequired
      />

      <div className="space-y-3">
        <Toggle
          isOn={field.defaultVisible}
          onChange={v => onChange({ ...field, defaultVisible: v })}
          label="Visible by default"
          description="Field shows when no conditions are active"
        />

        {showRequired && (
          <Toggle
            isOn={field.defaultRequired}
            onChange={v => onChange({ ...field, defaultRequired: v })}
            label="Required by default"
            description="Field is required when no conditions are active"
          />
        )}
      </div>

      <div className="border-t border-neutral-100 pt-4">
        <ConditionsConfig
          field={field}
          allFields={allFields}
          onChange={conditions => onChange({ ...field, conditions })}
        />
      </div>
    </div>
  )
}
