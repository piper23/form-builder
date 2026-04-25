import type { SingleSelectField, SingleSelectDisplayType, SelectOption, Field } from '@/schema'
import { Toggle } from '@/components/ui/Toggle'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import { BaseFieldConfig } from './BaseFieldConfig'
import { ids } from '@/lib/ids'

interface Props {
  field: SingleSelectField
  allFields: Field[]
  onChange: (updated: SingleSelectField) => void
}

const DISPLAY_OPTIONS: { value: SingleSelectDisplayType; label: string }[] = [
  { value: 'radio', label: '⚪ Radio buttons' },
  { value: 'dropdown', label: '▼ Dropdown' },
  { value: 'tiles', label: '▦ Tiles' },
]

export function SingleSelectConfig({ field, allFields, onChange }: Props) {
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

  function moveOption(id: string, dir: -1 | 1) {
    const idx = field.options.findIndex(o => o.id === id)
    if (idx === -1) return
    const next = [...field.options]
    const swapIdx = idx + dir
    if (swapIdx < 0 || swapIdx >= next.length) return
    ;[next[idx], next[swapIdx]] = [next[swapIdx], next[idx]]
    onChange({ ...field, options: next })
  }

  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as SingleSelectField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <Select
          label="Display type"
          options={DISPLAY_OPTIONS}
          value={field.displayType}
          onChange={e => onChange({ ...field, displayType: e.target.value as SingleSelectDisplayType })}
        />

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
                onClick={() => moveOption(opt.id, -1)}
                disabled={idx === 0}
                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-20"
                aria-label="Move up"
              >↑</button>
              <button
                type="button"
                onClick={() => moveOption(opt.id, 1)}
                disabled={idx === field.options.length - 1}
                className="text-neutral-400 hover:text-neutral-700 disabled:opacity-20"
                aria-label="Move down"
              >↓</button>
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
