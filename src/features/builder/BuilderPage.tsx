import { useReducer, useEffect, useState, useCallback } from 'react'
import type { Template, Field, FieldType } from '@/schema'
import { templateStore } from '@/storage'
import { useTheme } from '@/storage/useTheme'
import { builderReducer, makeBlankTemplate } from './builderReducer'
import { createField } from './fieldDefaults'
import { FieldTypePalette } from './FieldTypePalette'
import { BuilderCanvas } from './BuilderCanvas'
import { FieldConfigPanel } from './config/FieldConfigPanel'
import { PreviewModal } from './PreviewModal'
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
  const [previewOpen, setPreviewOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [titleGlow, setTitleGlow] = useState(!state.template.title)
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    if (!titleGlow) return
    const id = setTimeout(() => setTitleGlow(false), 2500)
    return () => clearTimeout(id)
  }, [titleGlow])

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

  const hasInputField = state.template.fields.some(
    f => f.type !== 'section-header' && f.type !== 'calculation'
  )
  const hasTitle = state.template.title.trim().length > 0
  const canSave = hasTitle && hasInputField
  const saveBlockReason = !hasTitle
    ? 'Add a form name before saving'
    : !hasInputField
    ? 'Add at least one input field before saving'
    : undefined

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

  const handleAddFieldMobile = useCallback((type: FieldType) => {
    dispatch({ type: 'ADD_FIELD', field: createField(type) })
    setPaletteOpen(false)
  }, [])

  return (
    <>
    <div className="flex flex-col h-screen overflow-hidden bg-neutral-50">
      {/* Header */}
      <header className="relative flex items-center gap-2 px-3 py-3 bg-neutral-0 border-b-2 border-brand-500 shadow-sm shrink-0">
        <button
          onClick={onBack}
          className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-medium text-neutral-500
            hover:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer"
        >
          ← Back
        </button>

        <div className="w-px h-5 bg-neutral-200 shrink-0" />

        <div className="flex-1 min-w-0 flex items-center gap-2">
          <div className={`flex-1 min-w-0 rounded-lg transition-all duration-300 ${titleGlow ? 'animate-title-glow' : ''}`}>
            <input
              type="text"
              value={state.template.title}
              onChange={e => { dispatch({ type: 'SET_TITLE', title: e.target.value }); setTitleGlow(false) }}
              placeholder="Give form a name to save…"
              className="w-full text-base font-semibold text-brand-600 dark:text-mint-400 bg-transparent outline-none
                placeholder:text-neutral-400 min-w-0 text-center
                border-b-2 border-transparent focus:border-mint-400 transition-colors pb-0.5"
              aria-label="Form title"
            />
          </div>
          {isDraft && (
            <span className="shrink-0 hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
              Draft
            </span>
          )}
        </div>

        {/* Desktop action buttons */}
        <div className="hidden sm:flex items-center gap-2 shrink-0">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer"
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
          >
            {theme === 'dark' ? '☀️' : '🌙'}
          </button>
          <Button
            variant={state.dirty && canSave ? 'primary' : 'secondary'}
            size="sm"
            onClick={handleSave}
            disabled={!canSave}
            title={saveBlockReason}
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

        {/* Mobile ⋮ menu button */}
        <div className="sm:hidden shrink-0 relative">
          <button
            onClick={() => setMobileMenuOpen(o => !o)}
            className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer text-lg leading-none"
            aria-label="More options"
          >
            ⋮
          </button>

          {mobileMenuOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setMobileMenuOpen(false)}
              />
              <div className="absolute right-0 top-full mt-1 z-50 w-52 bg-neutral-0 rounded-xl shadow-lg border border-neutral-200 overflow-hidden">
                {isDraft && (
                  <div className="px-4 py-2 border-b border-neutral-100">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                      Draft
                    </span>
                  </div>
                )}
                <button
                  onClick={() => { toggleTheme(); setMobileMenuOpen(false) }}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer"
                >
                  <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
                  {theme === 'dark' ? 'Light mode' : 'Dark mode'}
                </button>
                <button
                  onClick={() => { handleSave(); setMobileMenuOpen(false) }}
                  disabled={!canSave}
                  title={saveBlockReason}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <span>{saved ? '✅' : '💾'}</span>
                  {saved ? 'Saved!' : 'Save form'}
                </button>
                <button
                  onClick={() => { handleSave(); onFill(state.template); setMobileMenuOpen(false) }}
                  disabled={isDraft}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-neutral-700 hover:bg-neutral-50 transition-colors cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed border-t border-neutral-100"
                >
                  <span>📝</span>
                  New Response
                </button>
              </div>
            </>
          )}
        </div>
      </header>

      {/* 3-column layout */}
      <div className="flex flex-1 min-h-0">
        {/* Left: palette sidebar */}
        <aside className="hidden md:flex w-56 lg:w-64 shrink-0 flex-col bg-neutral-0 border-r border-neutral-200">
          <FieldTypePalette onAdd={handleAddField} onPreview={() => setPreviewOpen(true)} />
        </aside>

        {/* Center: canvas */}
        <main className="flex-1 overflow-y-auto bg-neutral-50 scrollbar-mint">
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
          <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-neutral-0 border-t border-neutral-200 max-h-[60vh] flex flex-col rounded-t-2xl shadow-lg">
            <div className="sticky top-0 z-10 flex items-center justify-between px-4 py-3 rounded-t-2xl shrink-0" style={{ backgroundColor: '#111827' }}>
              <div>
                <span className="text-sm font-semibold text-white">Configure field</span>
                <p className="text-xs text-neutral-400 mt-0.5">Adjust the selected field's settings</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'SELECT_FIELD', id: null })}
                className="text-neutral-400 hover:text-white cursor-pointer text-lg leading-none"
              >✕</button>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <FieldConfigPanel
                field={selectedField}
                allFields={state.template.fields}
                onChange={handleFieldChange}
              />
            </div>
          </div>
        )}

        {/* Mobile FAB — opens palette drawer */}
        <button
          type="button"
          onClick={() => setPaletteOpen(true)}
          className="md:hidden fixed bottom-6 left-4 z-30 flex items-center gap-2 px-4 py-3 rounded-full
            bg-brand-600 text-white shadow-lg hover:bg-brand-700 active:scale-95
            transition-all duration-150 cursor-pointer text-sm font-semibold"
          aria-label="Add field"
        >
          <span className="text-base leading-none">＋</span> Add Field
        </button>

        {/* Mobile palette drawer */}
        {paletteOpen && (
          <>
            <div
              className="md:hidden fixed inset-0 z-40 bg-neutral-900/40 backdrop-blur-sm"
              onClick={() => setPaletteOpen(false)}
            />
            <div className="md:hidden fixed inset-x-0 bottom-0 z-50 rounded-t-2xl shadow-xl overflow-hidden max-h-[80vh] flex flex-col">
              <FieldTypePalette
                onAdd={handleAddFieldMobile}
                onPreview={() => { setPaletteOpen(false); setPreviewOpen(true) }}
              />
            </div>
          </>
        )}
      </div>

    </div>

    {previewOpen && (
      <PreviewModal
        template={state.template}
        onClose={() => setPreviewOpen(false)}
      />
    )}
    </>
  )
}
