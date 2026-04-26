import { useState } from 'react'
import { useTemplates, responseStore } from '@/storage'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  theme: 'light' | 'dark'
  onToggleTheme: () => void
  onNew: () => void
  onEdit: (id: string) => void
  onFill: (id: string) => void
}

export function TemplateList({ theme, onToggleTheme, onNew, onEdit, onFill }: Props) {
  const { templates, remove } = useTemplates()
  const [copiedId, setCopiedId] = useState<string | null>(null)

  function copyFillLink(templateId: string) {
    const url = `${window.location.origin}/fill/${templateId}`
    navigator.clipboard.writeText(url)
    setCopiedId(templateId)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-neutral-0 border-b border-neutral-200 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl" role="img" aria-hidden="true">🏗️</span>
            <div>
              <h1 className="text-xl font-bold text-neutral-900">Form Builder</h1>
              <p className="text-xs text-neutral-500">Design, fill, and export forms</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onToggleTheme}
              className="p-2 rounded-lg text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800 transition-all cursor-pointer"
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              title={theme === 'dark' ? 'Light mode' : 'Dark mode'}
            >
              {theme === 'dark' ? '☀️' : '🌙'}
            </button>
            <Button variant="primary" size="md" onClick={onNew}>
              ✨ New Template
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-8">
        {templates.length === 0 ? (
          <EmptyState
            icon="📋"
            title="No templates yet"
            description="Create your first form template to get started."
            action={
              <Button variant="primary" onClick={onNew}>
                ✨ Create template
              </Button>
            }
          />
        ) : (
          <>
            <p className="text-sm text-neutral-500 mb-4">
              {templates.length} template{templates.length !== 1 ? 's' : ''}
            </p>
            <ul className="space-y-3">
              {templates
                .slice()
                .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))
                .map(t => {
                  const isDraft = !!t.isDraft
                  const responseCount = responseStore.getByTemplateId(t.id).length
                  return (
                    <li key={t.id}>
                      <div className="bg-neutral-0 border border-neutral-200 rounded-2xl p-5 flex items-center justify-between shadow-sm hover:shadow-md hover:border-neutral-300 transition-all duration-200">
                        <button
                          className="text-left flex-1 min-w-0 mr-4 group cursor-pointer"
                          onClick={() => onEdit(t.id)}
                        >
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-neutral-900 truncate group-hover:text-brand-600 transition-colors">
                              {t.title || <span className="italic text-neutral-400">Untitled</span>}
                            </p>
                            {isDraft && (
                              <span className="shrink-0 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-500 border border-neutral-200">
                                Draft
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500 mt-1 flex items-center gap-2">
                            <span>
                              {t.fields.length} field{t.fields.length !== 1 ? 's' : ''}
                            </span>
                            {!isDraft && (
                              <>
                                <span className="text-neutral-300">·</span>
                                <span>
                                  {responseCount} response{responseCount !== 1 ? 's' : ''}
                                </span>
                              </>
                            )}
                            <span className="text-neutral-300">·</span>
                            <span>
                              Updated {new Date(t.updatedAt).toLocaleDateString()}
                            </span>
                          </p>
                        </button>

                        <div className="flex items-center gap-2 shrink-0">
                          {isDraft ? (
                            <Button
                              variant="secondary"
                              size="sm"
                              onClick={() => onEdit(t.id)}
                            >
                              ✏️ Continue editing
                            </Button>
                          ) : (
                            <>
                              <Button
                                variant="mint"
                                size="sm"
                                onClick={() => onFill(t.id)}
                              >
                                📝 Fill
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => onEdit(t.id)}
                              >
                                ✏️ Edit
                              </Button>
                              <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => copyFillLink(t.id)}
                                title={`Copy shareable link — ${window.location.origin}/fill/${t.id}`}
                              >
                                {copiedId === t.id ? '✅ Copied!' : '🔗 Copy link'}
                              </Button>
                            </>
                          )}
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              if (confirm(`Delete "${t.title || 'Untitled'}"?${!isDraft ? ' This also deletes all responses.' : ''}`)) {
                                remove(t.id)
                              }
                            }}
                          >
                            🗑️
                          </Button>
                        </div>
                      </div>
                    </li>
                  )
                })}
            </ul>
          </>
        )}
      </main>
    </div>
  )
}
