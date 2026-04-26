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
  onPreview: () => void
}

export function FieldTypePalette({ onAdd, onPreview }: Props) {
  return (
    <aside className="flex flex-col h-full bg-neutral-0 border-r border-neutral-200">
      {/* Gradient header */}
      <div className="px-4 py-4 bg-linear-to-br from-brand-600 to-brand-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-hidden="true">🧩</span>
          <h2 className="text-sm font-semibold text-white tracking-wide">Field Types</h2>
        </div>
        <p className="text-xs text-brand-200 mt-0.5">Click to add to canvas</p>
      </div>

      {/* Items */}
      <ul className="p-2 space-y-0.5 flex-1 overflow-y-auto scrollbar-mint">
        {PALETTE_ITEMS.map((item, index) => (
          <li
            key={item.type}
            className="animate-palette-in"
            style={{ animationDelay: `${index * 45}ms` }}
          >
            <button
              type="button"
              onClick={() => onAdd(item.type)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left
                border border-transparent
                hover:bg-brand-50 hover:border-brand-100 hover:shadow-sm
                transition-all duration-200 cursor-pointer group"
            >
              <span
                className="text-lg shrink-0 group-hover:scale-110 transition-transform duration-200"
                role="img"
                aria-hidden="true"
              >
                {item.icon}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-medium text-neutral-700 group-hover:text-brand-700 truncate">
                  {item.label}
                </span>
                <span className="block text-xs text-neutral-400 truncate">
                  {item.description}
                </span>
              </span>
              <span className="text-brand-400 text-base font-light opacity-0 group-hover:opacity-100 transition-opacity duration-150 shrink-0">
                +
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* Preview button */}
      <div className="p-3 border-t border-neutral-200 shrink-0">
        <button
          type="button"
          onClick={onPreview}
          className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-sm font-semibold
            bg-linear-to-r from-mint-500 to-mint-600 text-neutral-900
            hover:from-mint-400 hover:to-mint-500 hover:shadow-md hover:-translate-y-px
            transition-all duration-200 cursor-pointer"
        >
          <span role="img" aria-hidden="true">👁️</span>
          Preview Form
        </button>
      </div>
    </aside>
  )
}
