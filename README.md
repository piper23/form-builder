# Form Builder

A browser-based form builder with builder and fill modes. Built as a frontend take-home assignment.

---

## Running locally

**Prerequisites**: Node.js 18+

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173).

```bash
npm run build    # production build → dist/
npm run preview  # serve the production build locally
npm run lint     # ESLint
```

---

## Tech stack

| Layer | Tool |
|-------|------|
| Framework | React 19 + TypeScript 5.7 (strict) |
| Build | Vite 6 |
| Styling | Tailwind CSS 4 |
| Drag-and-drop | @dnd-kit/core + @dnd-kit/sortable |
| PDF export | `window.print()` — no third-party libs |
| Persistence | `localStorage` — no backend |
| State | `useState` / `useReducer` — no external store |

---

## localStorage schema

Two keys, both storing JSON arrays.

### `fb_templates` — `Template[]`

```jsonc
[
  {
    "id": "tmpl_abc12345",
    "title": "Customer Feedback",
    "fields": [ /* ordered Field[] */ ],
    "createdAt": "2026-04-25T10:00:00.000Z",
    "updatedAt": "2026-04-25T11:30:00.000Z"
  }
]
```

**Why an array?** Order is meaningful (most-recently-updated first) and the dataset is small. A map would require a separate index to preserve order.

### `fb_responses` — `FormResponse[]`

```jsonc
[
  {
    "id": "rsp_xyz98765",
    "templateId": "tmpl_abc12345",
    "templateSnapshot": {
      "title": "Customer Feedback",
      "fieldOrder": ["fld_1", "fld_2", "fld_3"]
    },
    "values": {
      "fld_1": "Jane Smith",
      "fld_2": 42
    },
    "submittedAt": "2026-04-25T14:00:00.000Z"
  }
]
```

**Why a flat array?** Keeps both reads and writes simple. Filtering by `templateId` is O(n) but the total dataset is small.

**Why `templateSnapshot`?** Templates can be edited after responses are submitted. The snapshot preserves field order so PDF re-downloads remain coherent even after the template is changed.

---

## Architecture

### Source layout

```
src/
├── schema/          TypeScript types only — no runtime code
├── storage/         localStorage access — templateStore, responseStore
├── lib/             Pure logic — conditions engine, PDF helper, id utils
├── design-system/   CSS tokens (CSS custom properties + Tailwind layer)
├── components/ui/   Primitive components — Button, Input, Card, Modal, …
└── features/
    ├── templates/   Home screen / templates list
    ├── builder/     Builder Mode (3-column: palette, canvas, config panel)
    └── fill/        Fill Mode + responses panel
```

### Adding a new field type

The field registry follows the **open/closed principle** — adding a new type touches exactly 6 files, none of which are shared logic:

1. `src/schema/fields.ts` — add the TypeScript type to the `Field` union
2. `src/features/builder/fieldDefaults.ts` — add the default factory
3. `src/features/builder/config/` — add a config panel component
4. `src/features/fill/fields/` — add a fill-mode render component
5. `src/features/builder/FieldTypePalette.tsx` — register in the palette list
6. `src/features/fill/FieldRenderer.tsx` — register in the fill dispatcher

### Conditional logic

Multiple conditions on a single field use **OR semantics** — if *any* condition is active, its effect fires.

Conflict resolution: `hide` beats `show`; `mark-required` beats `mark-not-required`.

A hidden field is never validated as required and its value is stripped from submitted data.

### PDF export

Uses `window.print()` with a `@media print` stylesheet that hides everything except the rendered export layout. No third-party libraries.

---

## Key decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Multiple-condition logic | OR | Covers the common use-case; simpler mental model |
| Conflict resolution | `hide` > `show` | Conservative — safer to hide than show unexpectedly |
| Template snapshot in response | Yes | PDF re-download stays correct after template edits |
| State management | Local component state only | Builder and Fill modes don't share live state |
| Drag-and-drop | @dnd-kit | Accessible, headless, well-typed for React |

---

## What I'd improve with more time

- Undo / redo in the builder
- Field copy/paste
- Keyboard-accessible drag-and-drop (already built into @dnd-kit, just needs wiring)
- Template duplication
- Richer PDF layout (multi-column, page breaks, branding)
- Schema versioning + migration runner for localStorage
- Unit tests for the conditions engine
- E2E tests for the full builder → fill → PDF flow

---

## Agent architecture

This project uses specialised Claude Code agents. See [AGENTS.md](AGENTS.md) for the index and links to each agent's spec.
