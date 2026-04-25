# Form Builder — Agent Index

This project is developed with the help of specialised Claude Code agents. Each agent owns a distinct concern. Read this file first; then follow the link for the agent you are acting as.

---

## Agents

| Agent | File | Owns |
|-------|------|------|
| **UI Agent** | [agents/UI_AGENT.md](agents/UI_AGENT.md) | Design system, component library, visual patterns |
| **Schematics** | [agents/SCHEMATICS.md](agents/SCHEMATICS.md) | Data model, localStorage interface, TypeScript types |
| **Builder** | [agents/BUILDER.md](agents/BUILDER.md) | Feature implementation — Builder Mode, Fill Mode, PDF export, conditional logic |

---

## Shared conventions

### Language
- **Template / form** — the design-time artefact; a `Template` in code.
- **Input component** — the individual interactive elements inside a template (text input, date picker, etc.); a `Field` in code.
- **Response / instance** — a filled-out, submitted copy of a template; a `FormResponse` in code.

### Imports
All source imports use the `@/` alias which resolves to `src/`.

```ts
import { templateStore } from '@/storage'
import type { Field } from '@/schema'
```

### File organisation

```
src/
├── schema/          ← TypeScript types only (no runtime code)
├── storage/         ← localStorage read/write — templateStore, responseStore
├── lib/             ← pure logic — conditions engine, PDF helper, id utils
├── design-system/   ← CSS tokens, global styles
├── components/ui/   ← primitive UI components (Button, Input, Card, …)
└── features/
    ├── templates/   ← home / templates list
    ├── builder/     ← Builder Mode
    └── fill/        ← Fill Mode + responses panel
```

### Adding a new field type

The design goal is **open for extension, closed for modification**:

1. Add the TypeScript type to `src/schema/fields.ts` — extend the `Field` union.
2. Add a default factory case in `src/features/builder/fieldDefaults.ts`.
3. Add a config panel component in `src/features/builder/config/`.
4. Add a render component in `src/features/fill/fields/`.
5. Register in the palette list in `FieldTypePalette.tsx`.
6. Register in the fill dispatcher in `FieldRenderer.tsx`.

No other files need changing.

---

## Key decisions (brief)

| Decision | Choice | Reason |
|----------|--------|--------|
| State management | Local `useState` / `useReducer` per page | No cross-page shared state needed |
| Drag and drop | `@dnd-kit` | Accessible, headless, well-typed |
| PDF | `window.print()` + print CSS | Requirement: no third-party PDF libs |
| Multiple conditions logic | OR semantics | Covers common cases; simpler UX |
| Conflict resolution | `hide` > `show`, `mark-required` > `mark-not-required` | Conservative defaults |
| localStorage layout | Flat `Template[]` + flat `FormResponse[]` | Simple reads, clear separation |

Full rationale for each decision lives in the relevant agent file or in `README.md`.
