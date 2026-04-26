import { useState } from 'react'
import type { Template, FieldValues } from '@/schema'
import { Modal } from '@/components/ui/Modal'
import { FormRenderer } from '@/features/fill/FormRenderer'
import { useConditionalVisibility } from '@/features/fill/useConditionalVisibility'

interface Props {
  template: Template
  onClose: () => void
}

export function PreviewModal({ template, onClose }: Props) {
  const [values, setValues] = useState<FieldValues>({})
  const [submitted, setSubmitted] = useState(false)

  const visibility = useConditionalVisibility(template.fields, values)

  function handleChange(id: string, value: FieldValues[string]) {
    setValues(prev => ({ ...prev, [id]: value }))
  }

  function handleReset() {
    setValues({})
    setSubmitted(false)
  }

  return (
    <Modal isOpen onClose={onClose} size="lg">
      {/* Custom header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 shrink-0">
        <div className="flex items-center gap-2">
          <span className="text-base font-semibold text-neutral-900 truncate">
            {template.title || 'Untitled Form'}
          </span>
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-brand-100 text-brand-700 border border-brand-200">
            Preview
          </span>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-neutral-600 transition-colors text-xl leading-none cursor-pointer"
          aria-label="Close preview"
        >
          ✕
        </button>
      </div>

      <div className="overflow-y-auto flex-1 px-6 py-6">
        {submitted ? (
          <div className="text-center py-12">
            <div className="text-4xl mb-3">✅</div>
            <p className="text-neutral-700 font-medium">Form submitted (preview only)</p>
            <p className="text-sm text-neutral-400 mt-1">No response was saved.</p>
            <button
              onClick={handleReset}
              className="mt-5 text-sm text-brand-600 hover:underline cursor-pointer"
            >
              ← Fill again
            </button>
          </div>
        ) : (
          <>
            {template.fields.length === 0 ? (
              <p className="text-sm text-neutral-400 italic text-center py-12">
                No fields added yet. Add some fields to preview the form.
              </p>
            ) : (
              <FormRenderer
                fields={template.fields}
                values={values}
                errors={{}}
                visibility={visibility}
                onChange={handleChange}
              />
            )}

            {template.fields.length > 0 && (
              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors cursor-pointer"
                >
                  Reset
                </button>
                <button
                  onClick={() => setSubmitted(true)}
                  className="px-5 py-2 text-sm font-medium bg-brand-600 text-white rounded-lg hover:bg-brand-700 transition-colors cursor-pointer"
                >
                  Submit (Preview)
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </Modal>
  )
}
