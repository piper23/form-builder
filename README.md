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

#### AND vs OR — decision and reasoning

**Multiple conditions on a single field use OR semantics: if *any* condition fires, its effect applies.**

I chose OR over AND for three reasons:

1. **Matches the common use-case.** The most frequent scenario is "show this field if the user answered A *or* B." AND would require the user to stack conditions on a single field to do the same thing, which is unintuitive.
2. **Simpler mental model for builders.** Each condition row reads as an independent rule. With AND you'd need to think about the full set being simultaneously true, which is harder to reason about in a UI with no grouping/nesting controls.
3. **AND can be approximated via field structure.** If a form truly needs AND logic, the builder can achieve it by gating a visible intermediate field on condition A and then conditioning the target field on that intermediate field.

#### Conflict resolution

When multiple conditions fire at the same time and their effects contradict each other, the more conservative effect wins:

- `hide` beats `show` — a field with both a hide and show condition active will be hidden.
- `mark-required` beats `mark-not-required` — required wins ties.

#### Other rules

- A hidden field is **never validated as required**, even if its `defaultRequired` or a `mark-required` condition says so.
- A hidden field's **value is stripped** from submitted data and never appears in the PDF export.
- A field **cannot target itself** in a condition (enforced in the builder UI).
- Conditions are evaluated in a **single forward pass** (top to bottom through the field list). A field earlier in the form cannot be controlled by a field that appears later. This keeps the evaluation O(n) and avoids circular dependency issues; reordering fields in the builder is the workaround if needed.

### PDF export

Uses `window.print()` with a `@media print` stylesheet that hides everything except the rendered export layout. No third-party libraries.

---

## Key decisions

| Decision | Choice | Reason |
|----------|--------|--------|
| Multiple-condition logic | OR | See "Conditional logic" section above for full reasoning |
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
