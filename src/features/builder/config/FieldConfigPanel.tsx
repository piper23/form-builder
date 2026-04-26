import type { Field } from '@/schema'
import { SingleLineTextConfig } from './SingleLineTextConfig'
import { MultiLineTextConfig } from './MultiLineTextConfig'
import { NumberConfig } from './NumberConfig'
import { DateConfig } from './DateConfig'
import { SingleSelectConfig } from './SingleSelectConfig'
import { MultiSelectConfig } from './MultiSelectConfig'
import { FileUploadConfig } from './FileUploadConfig'
import { SectionHeaderConfig } from './SectionHeaderConfig'
import { CalculationConfig } from './CalculationConfig'

interface Props {
  field: Field | null
  allFields: Field[]
  onChange: (updated: Field) => void
}

export function FieldConfigPanel({ field, allFields, onChange }: Props) {
  if (!field) {
    return (
      <aside className="flex flex-col h-full items-center justify-center text-center px-6 bg-neutral-0 border-l border-neutral-200">
        <span className="text-3xl mb-3">⚙️</span>
        <p className="text-sm font-medium text-neutral-500">Select a field to configure it</p>
      </aside>
    )
  }

  return (
    <aside className="flex flex-col h-full bg-neutral-0 border-l border-neutral-200 overflow-y-auto">
      <div className="px-4 py-4 bg-linear-to-br from-mint-600 to-mint-700 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base" role="img" aria-hidden="true">⚙️</span>
          <h2 className="text-sm font-semibold text-neutral-900 tracking-wide">Field Config</h2>
        </div>
        <p className="text-xs text-mint-800 mt-0.5">Configure the selected field</p>
      </div>
      <div className="p-4 flex-1">
        {renderConfig(field, allFields, onChange)}
      </div>
    </aside>
  )
}

function renderConfig(field: Field, allFields: Field[], onChange: (f: Field) => void) {
  switch (field.type) {
    case 'single-line-text':
      return <SingleLineTextConfig field={field} allFields={allFields} onChange={onChange} />
    case 'multi-line-text':
      return <MultiLineTextConfig field={field} allFields={allFields} onChange={onChange} />
    case 'number':
      return <NumberConfig field={field} allFields={allFields} onChange={onChange} />
    case 'date':
      return <DateConfig field={field} allFields={allFields} onChange={onChange} />
    case 'single-select':
      return <SingleSelectConfig field={field} allFields={allFields} onChange={onChange} />
    case 'multi-select':
      return <MultiSelectConfig field={field} allFields={allFields} onChange={onChange} />
    case 'file-upload':
      return <FileUploadConfig field={field} allFields={allFields} onChange={onChange} />
    case 'section-header':
      return <SectionHeaderConfig field={field} allFields={allFields} onChange={onChange} />
    case 'calculation':
      return <CalculationConfig field={field} allFields={allFields} onChange={onChange} />
  }
}
