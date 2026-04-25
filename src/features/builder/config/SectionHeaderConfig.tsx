import type { SectionHeaderField, SectionHeaderSize, Field } from '@/schema'
import { Select } from '@/components/ui/Select'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: SectionHeaderField
  allFields: Field[]
  onChange: (updated: SectionHeaderField) => void
}

const SIZE_OPTIONS: { value: SectionHeaderSize; label: string }[] = [
  { value: 'xl', label: 'XL — h1 (largest)' },
  { value: 'lg', label: 'Large — h2' },
  { value: 'md', label: 'Medium — h3' },
  { value: 'sm', label: 'Small — h4' },
  { value: 'xs', label: 'XS — h5 (smallest)' },
]

export function SectionHeaderConfig({ field, allFields, onChange }: Props) {
  return (
    <div className="space-y-4">
      <BaseFieldConfig
        field={field}
        allFields={allFields}
        onChange={f => onChange(f as SectionHeaderField)}
        showRequired={false}
      />

      <div className="border-t border-neutral-100 pt-4">
        <Select
          label="Size"
          options={SIZE_OPTIONS}
          value={field.size}
          onChange={e => onChange({ ...field, size: e.target.value as SectionHeaderSize })}
        />
      </div>
    </div>
  )
}
