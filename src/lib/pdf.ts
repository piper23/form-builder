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

  const FULL_WIDTH_TYPES = new Set(['section-header', 'textarea', 'file-upload', 'multi-select'])

  const rows = orderedFields
    .map(field => {
      if (field.type === 'section-header') {
        return `<div class="pdf-section-header full-width">${escapeHtml(field.label || 'Section')}</div>`
      }
      const isFullWidth = FULL_WIDTH_TYPES.has(field.type)
      if (field.type === 'calculation') {
        const { text, isEmpty } = formatValue(field, response.values)
        return `
          <div class="pdf-field${isFullWidth ? ' full-width' : ''}">
            <div class="pdf-label">${escapeHtml(field.label || '(unlabelled)')} <span class="pdf-calc-badge">calc</span></div>
            <div class="pdf-value${isEmpty ? ' empty' : ''}">${escapeHtml(text)}</div>
          </div>`
      }
      const { text, isEmpty } = formatValue(field, response.values)
      return `
        <div class="pdf-field${isFullWidth ? ' full-width' : ''}">
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
    @page { margin: 0; size: A4; }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: ui-sans-serif, system-ui, -apple-system, sans-serif;
      color: #111827;
      background: #ffffff;
      -webkit-font-smoothing: antialiased;
    }

    /* ── Header ─────────────────────────────────── */
    .pdf-header {
      background: linear-gradient(135deg, #0e5fa3 0%, #106ebe 60%, #0d8f7a 100%);
      color: #ffffff;
      padding: 32px 48px 28px;
      position: relative;
      overflow: hidden;
    }
    .pdf-header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: #0ffcbe;
    }
    .pdf-header h1 {
      font-size: 24px;
      font-weight: 700;
      letter-spacing: -0.02em;
      margin-bottom: 10px;
      line-height: 1.2;
    }
    .pdf-header .meta {
      font-size: 11px;
      opacity: 0.8;
      display: flex;
      gap: 20px;
      flex-wrap: wrap;
    }
    .pdf-header .meta-item {
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .pdf-header .meta-dot {
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #0ffcbe;
      display: inline-block;
    }

    /* ── Body ────────────────────────────────────── */
    .pdf-body {
      padding: 36px 48px 28px;
    }

    /* ── Section headers ─────────────────────────── */
    .pdf-section-header {
      font-size: 10px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.12em;
      color: #0d8f7a;
      display: flex;
      align-items: center;
      gap: 10px;
      margin: 36px 0 18px;
    }
    .pdf-section-header:first-child { margin-top: 0; }
    .pdf-section-header::before {
      content: '';
      display: block;
      width: 18px;
      height: 2px;
      background: #0ffcbe;
      flex-shrink: 0;
    }
    .pdf-section-header::after {
      content: '';
      display: block;
      flex: 1;
      height: 1px;
      background: #e5e7eb;
    }

    /* ── Fields ──────────────────────────────────── */
    .pdf-fields-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0 32px;
    }
    .pdf-field {
      margin-bottom: 20px;
      padding: 12px 14px;
      background: #f9fafb;
      border-radius: 6px;
      border: 1px solid #f3f4f6;
      border-left: 3px solid #106ebe;
    }
    .pdf-field.full-width {
      grid-column: 1 / -1;
    }
    .pdf-label {
      font-size: 9px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.1em;
      color: #6b7280;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .pdf-calc-badge {
      font-size: 8px;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.06em;
      color: #0d8f7a;
      background: #e6fdf8;
      border: 1px solid #0ffcbe;
      border-radius: 3px;
      padding: 1px 5px;
    }
    .pdf-value {
      font-size: 13px;
      color: #111827;
      line-height: 1.5;
      font-weight: 500;
    }
    .pdf-value.empty {
      color: #9ca3af;
      font-style: italic;
      font-weight: 400;
    }

    /* ── Footer ──────────────────────────────────── */
    .pdf-footer {
      margin-top: 8px;
      padding: 14px 48px;
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
      font-weight: 600;
      font-size: 10px;
      color: #106ebe;
    }
    .pdf-footer .brand-dot {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #0ffcbe;
      display: inline-block;
    }

    @media print {
      .pdf-header { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-header::after { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-section-header::before { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-calc-badge { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-field { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .pdf-footer .brand-dot { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
    }
  </style>
</head>
<body>
  <div class="pdf-header">
    <h1>${title}</h1>
    <div class="meta">
      <span class="meta-item"><span class="meta-dot"></span> Submitted: ${submitted}</span>
      <span class="meta-item"><span class="meta-dot"></span> Response #${escapeHtml(response.id.slice(-6).toUpperCase())}</span>
    </div>
  </div>

  <div class="pdf-body">
    <div class="pdf-fields-grid">
      ${rows}
    </div>
  </div>

  <div class="pdf-footer">
    <span>${title}</span>
    <span class="brand"><span class="brand-dot"></span> Form Builder</span>
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
