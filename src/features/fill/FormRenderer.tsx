import type { Field, FieldValues } from '@/schema'
import { FieldRenderer } from './FieldRenderer'
import { evaluateAllFields } from '@/lib/conditions'

interface Props {
  fields: Field[]
  values: FieldValues
  errors: Record<string, string>
  visibility: Record<string, { isVisible: boolean; isRequired: boolean }>
  onChange: (id: string, value: FieldValues[string]) => void
  isPreview?: boolean
}

export function FormRenderer({ fields, values, errors, visibility, onChange, isPreview = false }: Props) {
  // In preview mode, compute visibility on the fly (no external state needed)
  const effectiveVisibility = isPreview ? evaluateAllFields(fields, values) : visibility

  const visibleFields = fields.filter(f => effectiveVisibility[f.id]?.isVisible !== false)

  if (visibleFields.length === 0) {
    return (
      <p className="text-sm text-neutral-400 italic text-center py-8">
        {fields.length === 0 ? 'No fields added yet.' : 'All fields are hidden by conditions.'}
      </p>
    )
  }

  return (
    <div className="space-y-5">
      {visibleFields.map(field => (
        <FieldRenderer
          key={field.id}
          field={field}
          allValues={values}
          value={values[field.id] ?? null}
          onChange={onChange}
          error={errors[field.id]}
          isRequired={effectiveVisibility[field.id]?.isRequired ?? false}
          isDisabled={isPreview}
        />
      ))}
    </div>
  )
}
