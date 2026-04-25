import type { MultiSelectField, SelectOption, Field } from '@/schema'
import { Toggle } from '@/components/ui/Toggle'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { BaseFieldConfig } from './BaseFieldConfig'
import { ids } from '@/lib/ids'

interface Props {
  field: MultiSelectField
  allFields: Field[]
  onChange: (updated: MultiSelectField) => void
}

export function MultiSelectConfig({ field, allFields, onChange }: Props) {
  function addOption() {
    const opt: SelectOption = { id: ids.option(), label: '' }
    onChange({ ...field, options: [...field.options, opt] })
  }

  function updateOption(id: string, label: string) {
    onChange({
      ...field,
      options: field.options.map(o => (o.id === id ? { ...o, label } : o)),
    })
  }

  function removeOption(id: string) {
    onChange({ ...field, options: field.options.filter(o => o.id !== id) })
  }

  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as MultiSelectField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            label="Min selections"
            type="number"
            min={0}
            value={field.minSelections ?? ''}
            onChange={e => onChange({ ...field, minSelections: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
          />
          <Input
            label="Max selections"
            type="number"
            min={0}
            value={field.maxSelections ?? ''}
            onChange={e => onChange({ ...field, maxSelections: e.target.value ? Number(e.target.value) : null })}
            placeholder="—"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-neutral-700 uppercase tracking-wide">Options</span>
            <Button type="button" size="sm" variant="ghost" onClick={addOption}>➕ Add</Button>
          </div>
          {field.options.length === 0 && (
            <p className="text-xs text-neutral-400 italic">No options yet.</p>
          )}
          {field.options.map((opt, idx) => (
            <div key={opt.id} className="flex items-center gap-2">
              <input
                type="text"
                value={opt.label}
                onChange={e => updateOption(opt.id, e.target.value)}
                placeholder={`Option ${idx + 1}`}
                className="flex-1 border border-neutral-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={() => removeOption(opt.id)}
                className="text-neutral-400 hover:text-danger-500 transition-colors"
                aria-label="Remove"
              >✕</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
