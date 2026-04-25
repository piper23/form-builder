import { useReducer, useEffect, useState, useCallback } from 'react'
import type { Template, Field, FieldType } from '@/schema'
import { templateStore } from '@/storage'
import { builderReducer, makeBlankTemplate } from './builderReducer'
import { createField } from './fieldDefaults'
import { FieldTypePalette } from './FieldTypePalette'
import { BuilderCanvas } from './BuilderCanvas'
import { FieldConfigPanel } from './config/FieldConfigPanel'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { FormRenderer } from '@/features/fill/FormRenderer'

interface Props {
  templateId: string | null
  onBack: () => void
  onFill: (template: Template) => void
}

export function BuilderPage({ templateId, onBack, onFill }: Props) {
  const [state, dispatch] = useReducer(builderReducer, null, () => {
    const existing = templateId ? templateStore.getById(templateId) : undefined
    return {
      template: existing ?? makeBlankTemplate(),
      selectedFieldId: null,
      dirty: false,
    }
  })

  const [saved, setSaved] = useState(false)
  const [isPreviewOpen, setIsPreviewOpen] = useState(false)

  // Keep title in sync with browser tab on mount
  useEffect(() => {
    if (templateId) {
      const t = templateStore.getById(templateId)
      if (t) dispatch({ type: 'LOAD', template: t })
    }
  }, [templateId])

  const selectedField = state.template.fields.find(f => f.id === state.selectedFieldId) ?? null

  const handleAddField = useCallback((type: FieldType) => {
    dispatch({ type: 'ADD_FIELD', field: createField(type) })
  }, [])

  const handleSave = useCallback(() => {
    const now = new Date().toISOString()
    const toSave = { ...state.template, updatedAt: now }
    templateStore.save(toSave)
    dispatch({ type: 'MARK_SAVED' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [state.template])

  const handleFieldChange = useCallback((updated: Field) => {
    dispatch({ type: 'UPDATE_FIELD', field: updated })
  }, [])

  return (
    <div className="flex flex-col h-screen bg-neutral-50">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-white border-b border-neutral-200 shrink-0">
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm flex items-center gap-1"
        >
          ← Back
        </button>

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        <input
          type="text"
          value={state.template.title}
          onChange={e => dispatch({ type: 'SET_TITLE', title: e.target.value })}
          placeholder="Untitled form…"
          className="flex-1 text-base font-semibold text-neutral-900 bg-transparent outline-none placeholder:text-neutral-400 min-w-0"
          aria-label="Form title"
        />

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsPreviewOpen(true)}
          >
            👁️ Preview
          </Button>

          <Button
            variant={state.dirty ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleSave}
          >
            {saved ? '✅ Saved' : '💾 Save'}
          </Button>

          <Button
            variant="mint"
            size="sm"
            onClick={() => {
              handleSave()
              onFill(state.template)
            }}
          >
            📝 New Response
          </Button>
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: palette (hidden on small screens) */}
        <div className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col">
          <FieldTypePalette onAdd={handleAddField} />
        </div>

        {/* Center: canvas */}
        <main className="flex-1 overflow-y-auto">
          {/* Mobile palette */}
          <div className="md:hidden p-3 border-b border-neutral-200 bg-white">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {(['single-line-text', 'multi-line-text', 'number', 'date', 'single-select', 'multi-select', 'file-upload', 'section-header', 'calculation'] as FieldType[]).map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAddField(type)}
                  className="shrink-0 px-3 py-1.5 text-xs bg-white border border-neutral-200 rounded-full hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors whitespace-nowrap"
                >
                  {type.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <BuilderCanvas
            fields={state.template.fields}
            selectedFieldId={state.selectedFieldId}
            onSelectField={id => dispatch({ type: 'SELECT_FIELD', id })}
            onDeleteField={id => dispatch({ type: 'DELETE_FIELD', id })}
            onReorder={(activeId, overId) => dispatch({ type: 'REORDER_FIELDS', activeId, overId })}
          />
        </main>

        {/* Right: config panel */}
        <div className="hidden lg:flex w-72 xl:w-80 shrink-0 flex-col">
          <FieldConfigPanel
            field={selectedField}
            allFields={state.template.fields}
            onChange={handleFieldChange}
          />
        </div>

        {/* Mobile config — slide-up when field selected */}
        {selectedField && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white border-t border-neutral-200 max-h-[60vh] overflow-y-auto rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <span className="text-sm font-semibold text-neutral-700">Configure field</span>
              <button
                onClick={() => dispatch({ type: 'SELECT_FIELD', id: null })}
                className="text-neutral-400 hover:text-neutral-700"
              >✕</button>
            </div>
            <div className="p-4">
              <FieldConfigPanel
                field={selectedField}
                allFields={state.template.fields}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        )}
      </div>

      {/* Preview Modal */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Form Preview"
        size="xl"
      >
        <div className="p-6">
          <FormRenderer
            fields={state.template.fields}
            values={{}}
            errors={{}}
            visibility={{}}
            onChange={() => undefined}
            isPreview
          />
        </div>
      </Modal>
    </div>
  )
}
