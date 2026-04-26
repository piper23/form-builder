# Builder Agent

Responsible for implementing all application features: Builder Mode, Fill Mode, conditional logic, PDF export, and the templates list.

---

## Project stack

| Tool | Version |
|------|---------|
| React | 19 |
| TypeScript | 5.7 — strict mode, no `any` |
| Vite | 6 |
| Tailwind CSS | 4 (via `@tailwindcss/vite`) |
| Drag-and-drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| PDF export | `window.print()` + print stylesheet — no third-party libs |

---

## Feature areas

### 1. Templates List (`src/features/templates/`)

- `TemplateList.tsx` — page shell, reads from `templateStore.getAll()`
- `TemplateCard.tsx` — shows title, field count, response count, last modified

Card actions:
- Click title/card body → `onEdit(id)`
- "New Response" button → `onFill(id)`
- Delete button → `templateStore.delete(id)` + `responseStore.deleteByTemplateId(id)`

### 2. Builder Mode (`src/features/builder/`)

Three-column layout: palette | canvas | config panel.

```
src/features/builder/
├── BuilderPage.tsx          ← state container, no UI logic
├── BuilderLayout.tsx        ← 3-column grid wrapper
├── FieldTypePalette.tsx     ← left panel: click-to-add field types
├── BuilderCanvas.tsx        ← center: sortable list of FieldCards
├── FieldCard.tsx            ← single field row with drag handle + delete
└── config/
    ├── FieldConfigPanel.tsx ← right panel: dispatches to concrete config
    ├── BaseFieldConfig.tsx  ← label, conditions, defaultVisible/Required
    ├── SingleLineTextConfig.tsx
    ├── MultiLineTextConfig.tsx
    ├── NumberConfig.tsx
    ├── DateConfig.tsx
    ├── SingleSelectConfig.tsx
    ├── MultiSelectConfig.tsx
    ├── FileUploadConfig.tsx
    ├── SectionHeaderConfig.tsx
    └── CalculationConfig.tsx
```

**State management**: builder state lives in `BuilderPage` as `{ template: Template, selectedFieldId: string | null }`. No global store needed — the builder is a single-page experience.

**Saving**: "Save" calls `templateStore.save(template)` with a fresh `updatedAt`.

**Adding a field type**: add its default factory to `src/features/builder/fieldDefaults.ts`, register it in the palette list, and add a config component. No other files change.

### 3. Fill Mode (`src/features/fill/`)

```
src/features/fill/
├── FillPage.tsx             ← loads template, manages values + visibility
├── FormRenderer.tsx         ← renders ordered visible fields
├── FieldRenderer.tsx        ← dispatches to concrete input by field.type
├── fields/
│   ├── SingleLineTextInput.tsx
│   ├── MultiLineTextInput.tsx
│   ├── NumberInput.tsx
│   ├── DateInput.tsx
│   ├── SingleSelectInput.tsx   ← handles radio / dropdown / tiles via displayType
│   ├── MultiSelectInput.tsx
│   ├── FileUploadInput.tsx
│   ├── SectionHeaderDisplay.tsx
│   └── CalculationDisplay.tsx
└── ResponsesPanel.tsx       ← lists past submissions for this template
```

**Values state**: `Record<string, FieldValue>` keyed by field id. Managed in `FillPage`.

**Conditional visibility**: computed by `src/features/fill/useConditionalVisibility.ts`:

```ts
function useConditionalVisibility(
  fields: Field[],
  values: FieldValues,
): Record<string, boolean>  // fieldId → isVisible
```

This hook is pure-computation — no side effects. It re-runs on every `values` change, which is fast because it's just array iteration.

**Submission**:
1. Validate all visible fields (required check + constraint check) — abort with inline errors if any fail.
2. Strip hidden field values from the submission payload.
3. Build `FormResponse` with snapshot and call `responseStore.save(response)`.

#### Validation rules (enforced in `validateFields` in `FillPage.tsx`)

Constraints are validated even when a field is not required — if a value is present it must still satisfy min/max. Only skips validation entirely if the field is hidden.

| Field type | Validates |
|---|---|
| `single-line-text` | required, `minLength`, `maxLength` |
| `multi-line-text` | required, `minLength`, `maxLength` |
| `number` | required, `min`, `max` |
| `multi-select` | required, `minSelections`, `maxSelections` |
| `file-upload` | required (at least 1 file), `maxFileSizeMb` per file |
| `date` | required |
| `single-select` | required |

Error messages surface inline below each field via the `error` prop on the input component.

### 4. Conditional Logic Engine (`src/lib/conditions.ts`)

```ts
function evaluateConditions(
  field: Field,
  fields: Field[],
  values: FieldValues,
): { isVisible: boolean; isRequired: boolean }
```

Rules:
- A hidden field is never required, regardless of its `required` / `defaultRequired` flag.
- `hide` takes priority over `show` when multiple conditions conflict.
- `mark-required` takes priority over `mark-not-required`.
- A field cannot reference itself as a target (enforced in the builder).
- If the target field is itself hidden, treat its value as absent (condition evaluates to false).

### 5. PDF Export (`src/lib/pdf.ts`)

Uses `window.print()` with a dedicated print stylesheet.

Approach:
1. Render a hidden `<div id="pdf-root">` with the PDF layout.
2. Apply `@media print` CSS that hides everything except `#pdf-root`.
3. Call `window.print()`.

The print layout includes:
- Form title (large)
- Submission timestamp
- Each visible field as: label (bold) + value (normal)
- File upload fields show filenames and sizes instead of file contents.
- Calculated fields show the computed value.

---

## Field schemas

### `FileUploadField`

```ts
interface FileUploadField extends BaseField {
  type: 'file-upload'
  required: boolean
  allowedTypes: string        // comma-separated extensions e.g. ".pdf,.jpg,.jpeg"
  maxFiles: number | null
  maxFileSizeMb: number | null  // per-file size cap in MB; validated on submit
}
```

`allowedTypes` is passed directly to the native `<input accept>` attribute and also validated in `FileUploadInput` at selection time. `maxFileSizeMb` is only checked at submit time inside `validateFields`.

Old localStorage records without `maxFileSizeMb` are safe — the validation guard is falsy for `undefined`.

---

## Field default factories

Every field type needs a default factory in `src/features/builder/fieldDefaults.ts`:

```ts
export function createField(type: FieldType, id: string): Field {
  const base = {
    id,
    label: '',
    conditions: [],
    defaultVisible: true,
    defaultRequired: false,
  }
  switch (type) {
    case 'single-line-text': return { ...base, type, placeholder: '', required: false, ... }
    // ...
    case 'file-upload':
      return { ...base, type, required: false, allowedTypes: '', maxFiles: null, maxFileSizeMb: null }
  }
}
```

---

## Coding rules

- Strict TypeScript — no `any`, no `as unknown as X` without a comment.
- Components ≤ 500 lines.
- No stale closures — full dep arrays on all hooks.
- No `useEffect` for derived state — compute it inline or in a `useMemo`.
- Prefer `useReducer` for builder state to avoid batching issues.
- IDs generated with `nanoid` (prefixed).
- All localStorage access via store modules only.
- Validation lives in `validateFields` inside `FillPage.tsx` — not inside individual input components.
