import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Condition, ConditionEffect, Field, FieldValues } from '@/schema'
import { FieldRenderer } from '@/features/fill/FieldRenderer'
import { ConditionsSummary } from './ConditionsSummary'

const EFFECT_STYLES: Record<ConditionEffect, string> = {
  'show':            'bg-success-50 text-success-700 border-success-200',
  'hide':            'bg-neutral-100 text-neutral-600 border-neutral-300',
  'mark-required':   'bg-danger-50 text-danger-600 border-danger-200',
  'mark-not-required': 'bg-neutral-100 text-neutral-500 border-neutral-200',
}

const EFFECT_LABEL: Record<ConditionEffect, string> = {
  'show':              '↗ Show',
  'hide':              '↘ Hide',
  'mark-required':     '★ Required',
  'mark-not-required': '★ Optional',
}

function ConditionBadge({ condition, allFields }: { condition: Condition; allFields: Field[] }) {
  const trigger = allFields.find(f => f.id === condition.targetFieldId)?.label || 'field'
  return (
    <span
      title={`When "${trigger}" matches → ${EFFECT_LABEL[condition.effect]}`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[10px] font-semibold border ${EFFECT_STYLES[condition.effect]}`}
    >
      ⚡ {EFFECT_LABEL[condition.effect]}
    </span>
  )
}

interface Props {
  field: Field
  allFields: Field[]
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export function FieldPreviewCard({ field, allFields, isSelected, onSelect, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id })

  // Ephemeral preview value — never persisted to the template
  const [value, setValue] = useState<FieldValues[string]>(null)

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  // Reset value when focus leaves the preview area entirely
  function handleBlurCapture(e: React.FocusEvent<HTMLDivElement>) {
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setValue(null)
    }
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'group rounded-xl border transition-all duration-150 bg-neutral-0',
        isSelected
          ? 'border-brand-500 shadow-md ring-1 ring-brand-500/20'
          : 'border-neutral-200 hover:border-neutral-300 hover:shadow-md',
      ].join(' ')}
      onClick={onSelect}
    >
      {/* Card toolbar */}
      <div className="flex items-center gap-2 px-3 py-2 border-b bg-mint-50 border-mint-200 dark:bg-mint-900/20 dark:border-mint-800/50 rounded-t-xl">
        {/* Drag handle */}
        <button
          type="button"
          {...attributes}
          {...listeners}
          onClick={e => e.stopPropagation()}
          className="text-neutral-300 hover:text-neutral-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
          aria-label="Drag to reorder"
        >
          <svg width="12" height="20" viewBox="0 0 12 20" fill="currentColor">
            <circle cx="2" cy="3" r="2" />
            <circle cx="10" cy="3" r="2" />
            <circle cx="2" cy="10" r="2" />
            <circle cx="10" cy="10" r="2" />
            <circle cx="2" cy="17" r="2" />
            <circle cx="10" cy="17" r="2" />
          </svg>
        </button>

        <span className="flex-1 text-xs font-medium text-mint-700 dark:text-mint-400 uppercase tracking-wide select-none">
          {field.type.replace(/-/g, ' ')}
        </span>

        {isSelected && (
          <span className="text-xs text-brand-500 font-medium select-none">Selected</span>
        )}

        {/* Delete */}
        <button
          type="button"
          onClick={e => { e.stopPropagation(); onDelete() }}
          className="shrink-0 p-1 rounded-lg text-neutral-300 hover:text-danger-500 hover:bg-danger-50 opacity-0 group-hover:opacity-100 transition-all duration-150 cursor-pointer"
          aria-label="Delete field"
        >
          🗑️
        </button>
      </div>

      {/* Status badge strip */}
      <div className="flex items-center gap-1.5 px-3 py-1.5 border-b border-neutral-100 flex-wrap min-h-7.5">
        {field.defaultRequired && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-danger-50 text-danger-600 border border-danger-200">
            ● Required
          </span>
        )}
        {!field.defaultVisible && (
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-neutral-100 text-neutral-600 border border-neutral-300">
            ◎ Hidden
          </span>
        )}
        {field.conditions.map(c => (
          <ConditionBadge key={c.id} condition={c} allFields={allFields} />
        ))}
        {!field.defaultRequired && field.defaultVisible && field.conditions.length === 0 && (
          <span className="text-[10px] text-neutral-300 italic">Optional · Visible · No conditions</span>
        )}
      </div>

      {/* Interactive preview — values are ephemeral and reset on blur */}
      <div
        className="p-4"
        onBlurCapture={handleBlurCapture}
        onClick={e => e.stopPropagation()}
      >
        <FieldRenderer
          field={field}
          allValues={value !== null ? { [field.id]: value } : {}}
          value={value}
          onChange={(_, v) => setValue(v)}
          error={undefined}
          isRequired={field.defaultRequired}
          isDisabled={field.type === 'file-upload'}
        />
      </div>

      {/* Conditions summary */}
      {field.conditions.length > 0 && (
        <div className="px-4 pb-3">
          <ConditionsSummary conditions={field.conditions} allFields={allFields} />
        </div>
      )}
    </div>
  )
}
