import { useState, useMemo } from 'react'
import type { Field, FieldValues, FormResponse, FileMetadata } from '@/schema'
import { templateStore } from '@/storage'
import { useResponses } from '@/storage'
import { useConditionalVisibility } from './useConditionalVisibility'
import { FormRenderer } from './FormRenderer'
import { ResponsesPanel } from './ResponsesPanel'
import { Button } from '@/components/ui/Button'
import { ids } from '@/lib/ids'
import { printResponse } from '@/lib/pdf'

interface Props {
  templateId: string
  responseId: string | null
  onBack: () => void
}

type Tab = 'fill' | 'responses'

function buildInitialValues(fields: Field[]): FieldValues {
  const values: FieldValues = {}
  const today = new Date().toISOString().split('T')[0]
  for (const field of fields) {
    if (field.type === 'date' && field.prefillToday) {
      values[field.id] = today
    }
  }
  return values
}

function validateFields(
  fields: Field[],
  values: FieldValues,
  visibility: Record<string, { isVisible: boolean; isRequired: boolean }>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const state = visibility[field.id]
    if (!state?.isVisible || !state?.isRequired) continue
    if (field.type === 'section-header' || field.type === 'calculation') continue

    const val = values[field.id]

    if (field.type === 'file-upload') {
      const files = val as FileMetadata[] | undefined
      if (!files || files.length === 0) {
        errors[field.id] = `${field.label || 'This field'} is required`
      }
      continue
    }

    if (field.type === 'multi-select') {
      const arr = val as string[] | undefined
      if (!arr || arr.length === 0) {
        errors[field.id] = `${field.label || 'This field'} is required`
        continue
      }
      if ('minSelections' in field && field.minSelections && arr.length < field.minSelections) {
        errors[field.id] = `Select at least ${field.minSelections} option${field.minSelections > 1 ? 's' : ''}`
      }
      if ('maxSelections' in field && field.maxSelections && arr.length > field.maxSelections) {
        errors[field.id] = `Select at most ${field.maxSelections} option${field.maxSelections > 1 ? 's' : ''}`
      }
      continue
    }

    if (val === null || val === undefined || val === '') {
      errors[field.id] = `${field.label || 'This field'} is required`
    }
  }

  return errors
}

export function FillPage({ templateId, responseId: _responseId, onBack }: Props) {
  const template = useMemo(() => templateStore.getById(templateId), [templateId])
  const { responses, save: saveResponse, remove: removeResponse } = useResponses(templateId)
  const [tab, setTab] = useState<Tab>('fill')
  const [values, setValues] = useState<FieldValues>(() =>
    template ? buildInitialValues(template.fields) : {},
  )
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [submitted, setSubmitted] = useState(false)

  const visibility = useConditionalVisibility(template?.fields ?? [], values)

  if (!template) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-neutral-500">Template not found.</p>
          <button onClick={onBack} className="mt-3 text-sm text-brand-600 hover:underline">
            ← Back
          </button>
        </div>
      </div>
    )
  }

  function handleChange(id: string, value: FieldValues[string]) {
    setValues(prev => ({ ...prev, [id]: value }))
    if (errors[id]) {
      setErrors(prev => { const next = { ...prev }; delete next[id]; return next })
    }
  }

  function handleSubmit() {
    const newErrors = validateFields(template!.fields, values, visibility)
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // Strip hidden field values
    const cleanValues: FieldValues = {}
    for (const field of template!.fields) {
      if (visibility[field.id]?.isVisible && field.type !== 'section-header') {
        cleanValues[field.id] = values[field.id] ?? null
      }
    }

    const response: FormResponse = {
      id: ids.response(),
      templateId: template!.id,
      templateSnapshot: {
        title: template!.title,
        fieldOrder: template!.fields.map(f => f.id),
      },
      values: cleanValues,
      submittedAt: new Date().toISOString(),
    }

    saveResponse(response)
    setSubmitted(true)
    setValues(buildInitialValues(template!.fields))
    setErrors({})
    setTab('responses')
  }

  function handlePrintLatest() {
    if (!responses.length) return
    const last = [...responses].sort((a, b) => b.submittedAt.localeCompare(a.submittedAt))[0]
    printResponse(template!, last, visibility)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={onBack}
            className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm"
          >
            ← Back
          </button>
          <div className="w-px h-5 bg-neutral-200" />
          <h1 className="flex-1 font-semibold text-neutral-900 truncate">
            {template.title || 'Untitled Form'}
          </h1>
        </div>

        {/* Tabs */}
        <div className="max-w-2xl mx-auto px-4 flex gap-1 border-t border-neutral-100">
          <button
            onClick={() => setTab('fill')}
            className={[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors',
              tab === 'fill'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700',
            ].join(' ')}
          >
            📝 Fill Form
          </button>
          <button
            onClick={() => setTab('responses')}
            className={[
              'px-4 py-2 text-sm font-medium border-b-2 transition-colors flex items-center gap-1.5',
              tab === 'responses'
                ? 'border-brand-500 text-brand-600'
                : 'border-transparent text-neutral-500 hover:text-neutral-700',
            ].join(' ')}
          >
            📋 Responses
            {responses.length > 0 && (
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full text-xs bg-brand-100 text-brand-700">
                {responses.length}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-8">
        {tab === 'fill' && (
          <>
            {submitted && (
              <div className="mb-6 px-4 py-3 bg-success-50 border border-success-500/30 rounded-xl text-sm text-success-500 font-medium">
                ✅ Response submitted successfully!
              </div>
            )}

            <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm p-6">
              <FormRenderer
                fields={template.fields}
                values={values}
                errors={errors}
                visibility={visibility}
                onChange={handleChange}
              />
            </div>

            {template.fields.length > 0 && (
              <div className="mt-6 flex justify-end gap-3">
                <Button variant="secondary" size="md" onClick={handlePrintLatest} disabled={!responses.length}>
                  📄 Download PDF
                </Button>
                <Button variant="primary" size="md" onClick={handleSubmit}>
                  📤 Submit
                </Button>
              </div>
            )}
          </>
        )}

        {tab === 'responses' && (
          <ResponsesPanel
            responses={responses}
            template={template}
            onDelete={removeResponse}
          />
        )}
      </main>
    </div>
  )
}
