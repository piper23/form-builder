import type { FileUploadField, Field } from '@/schema'
import { Input } from '@/components/ui/Input'
import { Toggle } from '@/components/ui/Toggle'
import { BaseFieldConfig } from './BaseFieldConfig'

interface Props {
  field: FileUploadField
  allFields: Field[]
  onChange: (updated: FileUploadField) => void
}

const TYPE_GROUPS = [
  {
    label: 'Images',
    types: [
      { label: 'JPG', value: '.jpg,.jpeg' },
      { label: 'PNG', value: '.png' },
      { label: 'GIF', value: '.gif' },
      { label: 'WebP', value: '.webp' },
      { label: 'SVG', value: '.svg' },
    ],
  },
  {
    label: 'Documents',
    types: [
      { label: 'PDF', value: '.pdf' },
      { label: 'Word', value: '.doc,.docx' },
      { label: 'Excel', value: '.xls,.xlsx,.csv' },
    ],
  },
  {
    label: 'Video',
    types: [
      { label: 'MP4', value: '.mp4' },
      { label: 'MOV', value: '.mov' },
      { label: 'AVI', value: '.avi' },
      { label: 'MKV', value: '.mkv' },
      { label: 'WebM', value: '.webm' },
    ],
  },
  {
    label: 'Audio',
    types: [
      { label: 'MP3', value: '.mp3' },
      { label: 'WAV', value: '.wav' },
      { label: 'AAC', value: '.aac' },
      { label: 'OGG', value: '.ogg' },
      { label: 'FLAC', value: '.flac' },
    ],
  },
  {
    label: 'Archives',
    types: [
      { label: 'ZIP', value: '.zip' },
      { label: 'RAR', value: '.rar' },
      { label: '7Z', value: '.7z' },
      { label: 'TAR/GZ', value: '.tar,.gz' },
    ],
  },
]

function getParts(allowedTypes: string): string[] {
  return allowedTypes
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
}

function joinParts(parts: string[]): string {
  return parts.join(',')
}

function isSubActive(parts: string[], subValue: string): boolean {
  return subValue.split(',').map(s => s.trim()).every(t => parts.includes(t))
}

type GroupState = 'all' | 'some' | 'none'

function getGroupState(parts: string[], group: (typeof TYPE_GROUPS)[number]): GroupState {
  const allSubs = group.types.flatMap(t => t.value.split(',').map(s => s.trim()))
  const included = allSubs.filter(t => parts.includes(t))
  if (included.length === 0) return 'none'
  if (included.length === allSubs.length) return 'all'
  return 'some'
}

function toggleSub(parts: string[], subValue: string): string[] {
  const subTypes = subValue.split(',').map(s => s.trim())
  const allIncluded = subTypes.every(t => parts.includes(t))
  if (allIncluded) {
    return parts.filter(p => !subTypes.includes(p))
  }
  return [...parts, ...subTypes.filter(t => !parts.includes(t))]
}

function toggleGroup(parts: string[], group: (typeof TYPE_GROUPS)[number]): string[] {
  const allSubs = group.types.flatMap(t => t.value.split(',').map(s => s.trim()))
  const state = getGroupState(parts, group)
  if (state === 'all') {
    return parts.filter(p => !allSubs.includes(p))
  }
  return [...parts, ...allSubs.filter(t => !parts.includes(t))]
}

export function FileUploadConfig({ field, allFields, onChange }: Props) {
  const parts = getParts(field.allowedTypes)

  function updateTypes(next: string[]) {
    onChange({ ...field, allowedTypes: joinParts(next) })
  }

  return (
    <div className="space-y-4">
      <BaseFieldConfig field={field} allFields={allFields} onChange={f => onChange(f as FileUploadField)} />

      <div className="border-t border-neutral-100 pt-4 space-y-3">
        <Toggle
          isOn={field.required}
          onChange={v => onChange({ ...field, required: v, defaultRequired: v })}
          label="Required"
        />

        <div className="space-y-2">
          <label className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
            Allowed types
          </label>

          <div className="space-y-2">
            {TYPE_GROUPS.map(group => {
              const state = getGroupState(parts, group)
              return (
                <div key={group.label} className="space-y-1">
                  <button
                    type="button"
                    onClick={() => updateTypes(toggleGroup(parts, group))}
                    className={[
                      'px-2.5 py-1 rounded-md text-xs font-semibold border transition-colors cursor-pointer',
                      state === 'all'
                        ? 'bg-brand-500 border-brand-500 text-white'
                        : state === 'some'
                          ? 'bg-brand-50 border-brand-300 text-brand-700'
                          : 'bg-neutral-0 border-neutral-200 text-neutral-600 hover:border-neutral-300 hover:text-neutral-800',
                    ].join(' ')}
                  >
                    {group.label}
                    {state === 'some' && <span className="ml-1 opacity-70">–</span>}
                  </button>

                  <div className="flex flex-wrap gap-1 pl-1">
                    {group.types.map(sub => {
                      const active = isSubActive(parts, sub.value)
                      return (
                        <button
                          key={sub.label}
                          type="button"
                          onClick={() => updateTypes(toggleSub(parts, sub.value))}
                          className={[
                            'px-2 py-0.5 rounded text-xs border transition-colors cursor-pointer',
                            active
                              ? 'bg-brand-50 border-brand-300 text-brand-700'
                              : 'bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-300 hover:text-neutral-700',
                          ].join(' ')}
                        >
                          {sub.label}
                        </button>
                      )
                    })}
                  </div>
                </div>
              )
            })}
          </div>

          <input
            type="text"
            value={field.allowedTypes}
            onChange={e => onChange({ ...field, allowedTypes: e.target.value })}
            placeholder="e.g. .pdf,.png or leave blank for any"
            className="w-full px-3 py-2 text-sm border border-neutral-200 rounded-lg bg-neutral-0 text-neutral-800 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-brand-400 focus:border-transparent transition"
          />
        </div>

        <Input
          label="Max files"
          type="number"
          min={1}
          value={field.maxFiles ?? ''}
          onChange={e => onChange({ ...field, maxFiles: e.target.value ? Number(e.target.value) : null })}
          placeholder="No limit"
        />

        <Input
          label="Max file size (MB)"
          type="number"
          min={0.1}
          step={0.1}
          value={field.maxFileSizeMb ?? ''}
          onChange={e => onChange({ ...field, maxFileSizeMb: e.target.value ? Number(e.target.value) : null })}
          placeholder="No limit"
        />
      </div>
    </div>
  )
}
