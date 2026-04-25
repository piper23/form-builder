# Schematics — Storage & Schema Agent

Responsible for the data model, localStorage interface, and all type definitions.

---

## localStorage Schema

Two keys are used. Both store JSON-serialised arrays.

### `fb_templates` → `Template[]`

An ordered array of all saved form templates.

```ts
interface Template {
  id: string        // nanoid — e.g. "tmpl_k2j9x"
  title: string
  fields: Field[]   // ordered; order is display order
  createdAt: string // ISO 8601
  updatedAt: string // ISO 8601
}
```

**Why an array (not a map)?**  
Order matters for the home screen (most-recently-updated first). An array keeps ordering explicit without a separate index key.

### `fb_responses` → `FormResponse[]`

A flat array of all submitted responses across all templates.

```ts
interface FormResponse {
  id: string
  templateId: string
  templateSnapshot: {
    title: string
    fieldOrder: string[]  // field ids in order at submission time
  }
  values: Record<string, FieldValue>  // fieldId → value; hidden fields absent
  submittedAt: string
}
```

**Why a flat array?**  
Avoids nested `{ [templateId]: Response[] }` which would require full-object reads and writes on every save. Filtering by `templateId` is O(n) but the dataset is small (localStorage cap ~5 MB).

**Why `templateSnapshot`?**  
Templates can be edited after responses are submitted. The snapshot preserves field order so the PDF re-download can reconstruct a meaningful layout even after the template changes.

---

## Field Schema

All fields extend `BaseField`:

```ts
interface BaseField {
  id: string           // nanoid
  type: FieldType
  label: string
  conditions: Condition[]
  defaultVisible: boolean
  defaultRequired: boolean
}
```

The `conditions` array and `defaultVisible` / `defaultRequired` together fully describe a field's conditional behaviour. `required` on concrete field types is the **base** required state (same as `defaultRequired`); the two are kept in sync by the builder.

### Condition

```ts
interface Condition {
  id: string
  targetFieldId: string
  operator: ConditionOperator
  value: string | number | [number, number] | string[]
  effect: 'show' | 'hide' | 'mark-required' | 'mark-not-required'
}
```

**AND / OR decision**: multiple conditions on a single field are evaluated with **OR** semantics — if *any* condition is active, its effect is applied. Rationale: OR covers the most common real-world cases ("show if A equals X *or* B equals Y") and is simpler to reason about. A future AND mode can be added as a `logicMode: 'and' | 'or'` field on each field definition without a breaking schema change.

**Priority when effects conflict**: if two active conditions have contradictory effects (e.g. one says `show`, another says `hide`), `hide` wins. Similarly, `mark-required` wins over `mark-not-required`.

---

## Storage API

All reads and writes go through the store modules — never call `localStorage` directly in feature code.

```ts
// templates
templateStore.getAll()          → Template[]
templateStore.getById(id)       → Template | undefined
templateStore.save(template)    → void   // upsert by id
templateStore.delete(id)        → void

// responses
responseStore.getAll()                    → FormResponse[]
responseStore.getByTemplateId(id)         → FormResponse[]
responseStore.getById(id)                 → FormResponse | undefined
responseStore.save(response)              → void
responseStore.delete(id)                  → void
responseStore.deleteByTemplateId(id)      → void
```

---

## ID generation

Use `nanoid` with a short prefix to make IDs human-readable in DevTools:

```ts
import { nanoid } from 'nanoid'

const templateId  = `tmpl_${nanoid(8)}`
const fieldId     = `fld_${nanoid(8)}`
const conditionId = `cnd_${nanoid(8)}`
const responseId  = `rsp_${nanoid(8)}`
const optionId    = `opt_${nanoid(8)}`
```

---

## Schema evolution

Since all data is in localStorage there is no migration server. If the schema changes:

1. Add a `schemaVersion` field to the stored root objects.
2. Write a migration function in `src/storage/migrations.ts` that runs on app boot.
3. Document the migration in this file.

Current version: **1**.
