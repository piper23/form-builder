import type { FieldType } from '@/schema'

interface PaletteItem {
  type: FieldType
  label: string
  icon: string
  description: string
}

const PALETTE_ITEMS: PaletteItem[] = [
  { type: 'single-line-text', label: 'Single Line Text', icon: '✏️', description: 'Short text input' },
  { type: 'multi-line-text', label: 'Multi-line Text', icon: '📝', description: 'Paragraph textarea' },
  { type: 'number', label: 'Number', icon: '🔢', description: 'Numeric input' },
  { type: 'date', label: 'Date', icon: '📅', description: 'Date picker' },
  { type: 'single-select', label: 'Single Select', icon: '⚪', description: 'Radio / dropdown / tiles' },
  { type: 'multi-select', label: 'Multi Select', icon: '☑️', description: 'Checkboxes' },
  { type: 'file-upload', label: 'File Upload', icon: '📎', description: 'Attach files' },
  { type: 'section-header', label: 'Section Header', icon: '🏷️', description: 'Visual divider' },
  { type: 'calculation', label: 'Calculation', icon: '🧮', description: 'Computed number' },
]

interface Props {
  onAdd: (type: FieldType) => void
}

export function FieldTypePalette({ onAdd }: Props) {
  return (
    <aside className="flex flex-col h-full overflow-y-auto bg-neutral-0 border-r border-neutral-200">
      <div className="px-4 py-3 border-b border-neutral-200">
        <h2 className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Field Types
        </h2>
      </div>
      <ul className="p-2 space-y-1 flex-1">
        {PALETTE_ITEMS.map(item => (
          <li key={item.type}>
            <button
              type="button"
              onClick={() => onAdd(item.type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left hover:bg-brand-50 hover:text-brand-700 hover:shadow-sm transition-all cursor-pointer group"
            >
              <span className="text-lg shrink-0" role="img" aria-hidden="true">
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-neutral-700 group-hover:text-brand-700 truncate">
                  {item.label}
                </span>
                <span className="block text-xs text-neutral-400 truncate">
                  {item.description}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </aside>
  )
}
