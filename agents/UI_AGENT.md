# UI Agent

Responsible for the design system, component library, and all visual output.

---

## Scope

- Design tokens (`src/design-system/tokens.css`)
- Primitive UI components (`src/components/ui/`)
- Feature-level layout components (`src/features/**/components/`)
- Styling conventions and visual consistency

---

## Design System

### Token source of truth

All colours, spacing, radius, and shadow values live in `src/design-system/tokens.css` as CSS custom properties.  
Never hard-code raw hex values or pixel sizes inline — always reference a token or a Tailwind class that maps to one.

### Colour palette

| Role | Token |
|------|-------|
| Primary action | `--color-brand-500 / -600` |
| Destructive | `--color-danger-500` |
| Success | `--color-success-500` |
| Surface | `--color-neutral-0 / -50 / -100` |
| Body text | `--color-neutral-900` |
| Muted text | `--color-neutral-500` |

### Typography scale

Use Tailwind utility classes directly:

| Use | Class |
|-----|-------|
| Page title | `text-2xl font-semibold` |
| Section heading | `text-lg font-medium` |
| Body | `text-sm` |
| Label | `text-xs font-medium uppercase tracking-wide` |
| Muted | `text-sm text-neutral-500` |

---

## Component Rules

### File size
Every component file must stay **under 500 lines**. If it grows past that, extract sub-components.

### No stale closures
- Always list all values read inside `useEffect` / `useCallback` / `useMemo` in the dependency array.
- Prefer `useReducer` over multiple `useState` calls when state transitions are interdependent.
- Never capture props or state via `useRef` as a closure escape hatch without a clear comment explaining why.

### Props API design
- Prefer `value` + `onChange` (controlled) over internal state for all input primitives.
- Boolean props must default to `false` — use positive names (`isDisabled`, `isRequired`).
- Event handlers are `onXxx: () => void` or `onXxx: (value: T) => void` — never raw DOM events on high-level components.

### Accessibility
- All inputs must have an associated `<label>` (or `aria-label`).
- Interactive elements that aren't `<button>` or `<a>` must have `role` and `tabIndex`.
- Colour contrast must meet WCAG AA.

---

## Component Inventory

### Primitives (`src/components/ui/`)

| Component | File | Purpose |
|-----------|------|---------|
| `Button` | `Button.tsx` | Primary / secondary / ghost / danger variants |
| `Input` | `Input.tsx` | Single-line text with optional prefix/suffix adornments |
| `Textarea` | `Textarea.tsx` | Multi-line with configurable rows |
| `Select` | `Select.tsx` | Native `<select>` wrapper |
| `Toggle` | `Toggle.tsx` | Boolean on/off switch |
| `Badge` | `Badge.tsx` | Small status indicator |
| `Card` | `Card.tsx` | Elevated surface container |
| `Modal` | `Modal.tsx` | Overlay dialog |
| `Tooltip` | `Tooltip.tsx` | Hover hint |
| `EmptyState` | `EmptyState.tsx` | Zero-data placeholder |

### Section header sizes

The `SectionHeaderField` maps its `size` config to heading levels:

| Size | Element | Tailwind |
|------|---------|----------|
| `xl` | `h1` | `text-3xl font-bold` |
| `lg` | `h2` | `text-2xl font-semibold` |
| `md` | `h3` | `text-xl font-semibold` |
| `sm` | `h4` | `text-base font-medium` |
| `xs` | `h5` | `text-sm font-medium text-neutral-500` |

---

## UI Patterns

### Grouped toggle chip selectors

Used in `FileUploadConfig.tsx` for the "Allowed types" preset picker. Pattern: one parent button per category, sub-buttons for individual values within that category.

**Parent button states:**
- All sub-types selected → solid brand background (`bg-brand-500 text-white`)
- Some sub-types selected → light brand tint (`bg-brand-50 border-brand-300 text-brand-700`) + `–` indicator
- None selected → neutral (`bg-neutral-0 border-neutral-200 text-neutral-600`)

**Sub-button states:**
- Active → `bg-brand-50 border-brand-300 text-brand-700`
- Inactive → `bg-neutral-50 border-neutral-200 text-neutral-500`

**Parent toggle behaviour:** if all selected → deselect all; if some or none → select all.  
**Sub-button toggle behaviour:** toggles only that individual item's extensions.

Values are stored as a comma-separated string (e.g. `.jpg,.jpeg,.png`). Helper functions `toggleSub`, `toggleGroup`, `isSubActive`, `getGroupState` live in the same file and operate on `string[]` of extensions.

Always render a raw text `<input>` below the chips so the user can still type custom types.

---

## Layout Structure

```
App
├── TemplateList          ← home / templates list
│   └── TemplateCard
├── BuilderPage           ← 3-column layout
│   ├── FieldTypePalette  ← left panel
│   ├── BuilderCanvas     ← center
│   │   └── FieldCard (draggable)
│   └── FieldConfigPanel  ← right panel (changes based on selected field type)
└── FillPage
    ├── FormRenderer
    │   └── FieldRenderer ← dispatches to concrete input component by field.type
    └── ResponsesPanel
```

---

## Adding a new field type (UI side)

1. Add a config panel component at `src/features/builder/config/YourFieldConfig.tsx`.
2. Add a render component at `src/features/fill/fields/YourField.tsx`.
3. Register both in their respective dispatcher maps — no other files need changing.
