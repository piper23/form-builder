import { useReducer, useEffect, useState, useCallback } from 'react'
import type { Template, Field, FieldType } from '@/schema'
import { templateStore } from '@/storage'
import { builderReducer, makeBlankTemplate } from './builderReducer'
import { createField } from './fieldDefaults'
import { FieldTypePalette } from './FieldTypePalette'
import { BuilderCanvas } from './BuilderCanvas'
import { FieldConfigPanel } from './config/FieldConfigPanel'
import { Button } from '@/components/ui/Button'

interface Props {
  templateId: string
  onBack: () => void
  onFill: (template: Template) => void
}

export function BuilderPage({ templateId, onBack, onFill }: Props) {
  const [state, dispatch] = useReducer(builderReducer, null, () => {
    const existing = templateStore.getById(templateId)
    return {
      template: existing ?? makeBlankTemplate(),
      selectedFieldId: null,
      dirty: false,
    }
  })

  const [saved, setSaved] = useState(false)

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  useEffect(() => {
    const t = templateStore.getById(templateId)
    if (t) dispatch({ type: 'LOAD', template: t })
  }, [templateId])

  const selectedField = state.template.fields.find(f => f.id === state.selectedFieldId) ?? null
  const isDraft = !!state.template.isDraft
  const canSave = state.template.title.trim().length > 0

  const handleAddField = useCallback((type: FieldType) => {
    dispatch({ type: 'ADD_FIELD', field: createField(type) })
  }, [])

  const handleSave = useCallback(() => {
    if (!canSave) return
    const now = new Date().toISOString()
    const toSave = { ...state.template, isDraft: false, updatedAt: now }
    templateStore.save(toSave)
    dispatch({ type: 'MARK_SAVED' })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }, [state.template, canSave])

  // Auto-persist draft changes to localStorage (without clearing isDraft)
  useEffect(() => {
    if (state.dirty) {
      templateStore.save({ ...state.template, updatedAt: new Date().toISOString() })
    }
  }, [state.template, state.dirty])

  const handleFieldChange = useCallback((updated: Field) => {
    dispatch({ type: 'UPDATE_FIELD', field: updated })
  }, [])

  const FIELD_TYPES: FieldType[] = [
    'single-line-text', 'multi-line-text', 'number', 'date',
    'single-select', 'multi-select', 'file-upload', 'section-header', 'calculation',
  ]

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-50">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 bg-neutral-0 border-b border-neutral-200 shadow-sm shrink-0">
        <button
          onClick={onBack}
          className="text-neutral-500 hover:text-neutral-800 transition-colors text-sm flex items-center gap-1 cursor-pointer"
        >
          ← Back
        </button>

        <div className="w-px h-5 bg-neutral-200 mx-1" />

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <input
            type="text"
            value={state.template.title}
            onChange={e => dispatch({ type: 'SET_TITLE', title: e.target.value })}
            placeholder="Give your form a name to save…"
            className="flex-1 text-base font-semibold text-mint-600 dark:text-mint-400 bg-transparent outline-none placeholder:text-neutral-400 min-w-0 text-center"
            aria-label="Form title"
          />
          {isDraft && (
            <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
              Draft
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant={state.dirty && canSave ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleSave}
            disabled={!canSave}
            title={!canSave ? 'Add a name before saving' : undefined}
          >
            {saved ? '✅ Saved' : '💾 Save'}
          </Button>

          <Button
            variant="mint"
            size="sm"
            disabled={isDraft}
            title={isDraft ? 'Save the form first before filling it' : undefined}
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
        {/* Left: palette sidebar */}
        <aside className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col bg-neutral-0 border-r border-neutral-200">
          <FieldTypePalette onAdd={handleAddField} />
        </aside>

        {/* Center: canvas */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 scrollbar-mint">
          {/* Mobile palette */}
          <div className="md:hidden p-3 border-b border-neutral-200 bg-neutral-0">
            <div className="flex gap-2 overflow-x-auto pb-1">
              {FIELD_TYPES.map(type => (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleAddField(type)}
                  className="shrink-0 px-3 py-1.5 text-xs bg-neutral-0 border border-neutral-200 rounded-full hover:bg-brand-50 hover:border-brand-300 hover:text-brand-700 transition-colors whitespace-nowrap cursor-pointer"
                >
                  {type.replace(/-/g, ' ')}
                </button>
              ))}
            </div>
          </div>

          <BuilderCanvas
            fields={state.template.fields}
            allFields={state.template.fields}
            selectedFieldId={state.selectedFieldId}
            onSelectField={id => dispatch({ type: 'SELECT_FIELD', id })}
            onDeleteField={id => dispatch({ type: 'DELETE_FIELD', id })}
            onReorder={(activeId, overId) => dispatch({ type: 'REORDER_FIELDS', activeId, overId })}
          />
        </main>

        {/* Right: config panel sidebar */}
        <aside className="hidden lg:flex w-72 xl:w-80 shrink-0 flex-col bg-neutral-0 border-l border-neutral-200">
          <FieldConfigPanel
            field={selectedField}
            allFields={state.template.fields}
            onChange={handleFieldChange}
          />
        </aside>

        {/* Mobile config — slide-up when field selected */}
        {selectedField && (
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-neutral-0 border-t border-neutral-200 max-h-[60vh] overflow-y-auto rounded-t-2xl shadow-lg">
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100">
              <span className="text-sm font-semibold text-neutral-700">Configure field</span>
              <button
                onClick={() => dispatch({ type: 'SELECT_FIELD', id: null })}
                className="text-neutral-400 hover:text-neutral-700 cursor-pointer"
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

    </div>
  )
}
