import type { Field, FieldValues, FormResponse, Template, FileMetadata } from '@/schema'

function formatValue(field: Field, values: FieldValues): { text: string; isEmpty: boolean } {
  const val = values[field.id]
  if (val === undefined || val === null || val === '') return { text: '—', isEmpty: true }

  if (field.type === 'file-upload') {
    const files = val as FileMetadata[]
    if (!files.length) return { text: '—', isEmpty: true }
    return { text: files.map(f => `${f.name} (${(f.size / 1024).toFixed(1)} KB)`).join(', '), isEmpty: false }
  }

  if (Array.isArray(val)) {
    const joined = (val as string[]).join(', ')
    return joined ? { text: joined, isEmpty: false } : { text: '—', isEmpty: true }
  }

  const str = String(val)
  return str ? { text: str, isEmpty: false } : { text: '—', isEmpty: true }
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
        return `<div class="pdf-section-header">${escapeHtml(field.label || 'Section')}</div>`
      }
      if (field.type === 'calculation') {
        const { text, isEmpty } = formatValue(field, response.values)
        return `
          <div class="pdf-field">
            <div class="pdf-label">${escapeHtml(field.label || '(unlabelled)')} <span class="pdf-calc-badge">calc</span></div>
            <div class="pdf-value${isEmpty ? ' empty' : ''}">${escapeHtml(text)}</div>
          </div>`
      }
      const { text, isEmpty } = formatValue(field, response.values)
      return `
        <div class="pdf-field">
          <div class="pdf-label">${escapeHtml(field.label || '(unlabelled)')}</div>
          <div class="pdf-value${isEmpty ? ' empty' : ''}">${escapeHtml(text)}</div>
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
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      color: #111827;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Header ─────────────────────────────────── */
    .pdf-header {
      background: #106ebe;
      color: #ffffff;
      padding: 28px 40px 24px;
    }
    .pdf-header h1 {
      font-size: 22px;
      font-weight: 700;
      letter-spacing: -0.01em;
      margin-bottom: 6px;
    }
    .pdf-header .meta {
      font-size: 12px;
      opacity: 0.75;
      display: flex;
      gap: 16px;
    }
    .pdf-header .meta span::before {
      content: '';
    }

    /* ── Body ────────────────────────────────────── */
    .pdf-body {
      padding: 32px 40px 24px;
    }

    /* ── Section headers ─────────────────────────── */
    .pdf-section-header {
      font-size: 11px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #09a280;
      border-bottom: 2px solid #0ffcbe;
      padding-bottom: 6px;
      margin: 32px 0 16px;
    }
    .pdf-section-header:first-child { margin-top: 0; }

    /* ── Fields ──────────────────────────────────── */
    .pdf-field {
      margin-bottom: 18px;
      padding-left: 12px;
      border-left: 3px solid #e5e7eb;
    }
    .pdf-label {
      font-size: 10px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.08em;
      color: #6b7280;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pdf-calc-badge {
      font-size: 9px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #106ebe;
      background: #e8f3fc;
      border-radius: 4px;
      padding: 1px 5px;
    }
    .pdf-value {
      font-size: 14px;
      color: #111827;
      line-height: 1.5;
    }
    .pdf-value.empty {
      color: #9ca3af;
      font-style: italic;
    }

    /* ── Footer ──────────────────────────────────── */
    .pdf-footer {
      margin-top: 16px;
      padding: 14px 40px;
      border-top: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 10px;
      color: #9ca3af;
    }
    .pdf-footer .brand {
      display: flex;
      align-items: center;
      gap: 6px;
      color: #106ebe;
      font-weight: 600;
      font-size: 11px;
    }

    @media print {
      .pdf-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-calc-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <h1>${title}</h1>
    <div class="meta">
      <span>Submitted: ${submitted}</span>
      <span>Response #${escapeHtml(response.id.slice(-6).toUpperCase())}</span>
    </div>
  </div>

  <div class="pdf-body">
    ${rows}
  </div>

  <div class="pdf-footer">
    <span>${title}</span>
    <span class="brand">Form Builder</span>
  </div>

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
