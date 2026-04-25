import type { Field, FieldValues, FormResponse, Template, FileMetadata } from '@/schema'

function formatValue(field: Field, values: FieldValues): string {
  const val = values[field.id]
  if (val === undefined || val === null || val === '') return '—'

  if (field.type === 'file-upload') {
    const files = val as FileMetadata[]
    if (!files.length) return '—'
    return files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', ')
  }

  if (Array.isArray(val)) {
    return (val as string[]).join(', ') || '—'
  }

  return String(val) || '—'
}

export function printResponse(
  template: Template,
  response: FormResponse,
  visibilityMap: Record<string, { isVisible: boolean }>,
): void {
  const orderedFields = response.templateSnapshot.fieldOrder
    .map(id => template.fields.find(f => f.id === id))
    .filter((f): f is Field => f !== undefined)
    .filter(f => visibilityMap[f.id]?.isVisible !== false)

  const rows = orderedFields
    .map(field => {
      if (field.type === 'section-header') {
        return `<div class="pdf-section-header">${escapeHtml(field.label)}</div>`
      }
      return `
        <div class="pdf-field">
          <div class="pdf-label">${escapeHtml(field.label || '(unlabelled)')}</div>
          <div class="pdf-value">${escapeHtml(formatValue(field, response.values))}</div>
        </div>`
    })
    .join('')

  const title = escapeHtml(template.title || 'Untitled Form')
  const submitted = new Date(response.submittedAt).toLocaleString()

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>${title}</title>
  <style>
    body { font-family: ui-sans-serif, system-ui, sans-serif; margin: 2cm; color: #111827; }
    h1 { font-size: 22px; font-weight: 700; margin: 0 0 4px; }
    .meta { font-size: 13px; color: #6b7280; margin-bottom: 28px; }
    .pdf-section-header {
      font-size: 15px; font-weight: 600; border-bottom: 1px solid #e5e7eb;
      padding-bottom: 6px; margin: 28px 0 12px;
    }
    .pdf-field { margin-bottom: 16px; }
    .pdf-label {
      font-size: 10px; font-weight: 600; text-transform: uppercase;
      letter-spacing: 0.08em; color: #374151; margin-bottom: 3px;
    }
    .pdf-value { font-size: 14px; color: #111827; }
    @media print { body { margin: 1cm; } }
  </style>
</head>
<body>
  <h1>${title}</h1>
  <p class="meta">Submitted: ${submitted}</p>
  ${rows}
  <script>window.onload = function() { window.print(); }<\/script>
</body>
</html>`

  const win = window.open('', '_blank')
  if (!win) return
  win.document.open()
  win.document.write(html)
  win.document.close()
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
