import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { Field } from '@/schema'

const TYPE_LABELS: Record<Field['type'], string> = {
  'single-line-text': 'Text',
  'multi-line-text': 'Textarea',
  'number': 'Number',
  'date': 'Date',
  'single-select': 'Single Select',
  'multi-select': 'Multi Select',
  'file-upload': 'File Upload',
  'section-header': 'Section',
  'calculation': 'Calculation',
}

const TYPE_ICONS: Record<Field['type'], string> = {
  'single-line-text': '✏️',
  'multi-line-text': '📝',
  'number': '🔢',
  'date': '📅',
  'single-select': '⚪',
  'multi-select': '☑️',
  'file-upload': '📎',
  'section-header': '🏷️',
  'calculation': '🧮',
}

interface Props {
  field: Field
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

export function FieldCard({ field, isSelected, onSelect, onDelete }: Props) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: field.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={[
        'group flex items-center gap-2 px-3 py-3 rounded-xl border cursor-pointer transition-all duration-150',
        isSelected
          ? 'border-brand-500 bg-brand-50 shadow-sm'
          : 'border-neutral-200 bg-white hover:border-neutral-300 hover:shadow-sm',
      ].join(' ')}
      onClick={onSelect}
    >
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

      {/* Icon */}
      <span className="text-base shrink-0" role="img" aria-hidden="true">
        {TYPE_ICONS[field.type]}
      </span>

      {/* Label */}
      <div className="flex-1 min-w-0">
        <p className={['text-sm font-medium truncate', isSelected ? 'text-brand-700' : 'text-neutral-800'].join(' ')}>
          {field.label || <span className="text-neutral-400 italic">Untitled</span>}
        </p>
        <p className="text-xs text-neutral-400">{TYPE_LABELS[field.type]}</p>
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={e => { e.stopPropagation(); onDelete() }}
        className="shrink-0 p-1 rounded-lg text-neutral-300 hover:text-danger-500 hover:bg-danger-50 opacity-0 group-hover:opacity-100 transition-all duration-150"
        aria-label="Delete field"
      >
        🗑️
      </button>
    </div>
  )
}
