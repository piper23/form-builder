// ─── Field type discriminated union ──────────────────────────────────────────

export type FieldType =
  | 'single-line-text'
  | 'multi-line-text'
  | 'number'
  | 'date'
  | 'single-select'
  | 'multi-select'
  | 'file-upload'
  | 'section-header'
  | 'calculation'

// ─── Condition system ─────────────────────────────────────────────────────────

export type TextOperator = 'equals' | 'does-not-equal' | 'contains'
export type NumberOperator =
  | 'equals'
  | 'is-greater-than'
  | 'is-less-than'
  | 'is-within-range'
export type SingleSelectOperator = 'equals' | 'does-not-equal'
export type MultiSelectOperator =
  | 'contains-any-of'
  | 'contains-all-of'
  | 'contains-none-of'
export type DateOperator = 'equals' | 'is-before' | 'is-after'

export type ConditionOperator =
  | TextOperator
  | NumberOperator
  | MultiSelectOperator
  | DateOperator

export type ConditionEffect =
  | 'show'
  | 'hide'
  | 'mark-required'
  | 'mark-not-required'

export interface Condition {
  id: string
  targetFieldId: string
  operator: ConditionOperator
  /** For is-within-range this is [min, max]; otherwise a single value */
  value: string | number | [number, number] | string[]
  effect: ConditionEffect
}

// ─── Base field ───────────────────────────────────────────────────────────────

interface BaseField {
  id: string
  type: FieldType
  label: string
  conditions: Condition[]
  defaultVisible: boolean
  defaultRequired: boolean
}

// ─── Concrete field configs ───────────────────────────────────────────────────

export interface SingleLineTextField extends BaseField {
  type: 'single-line-text'
  placeholder: string
  required: boolean
  minLength: number | null
  maxLength: number | null
  prefix: string
  suffix: string
}

export interface MultiLineTextField extends BaseField {
  type: 'multi-line-text'
  placeholder: string
  required: boolean
  minLength: number | null
  maxLength: number | null
  rows: number
}

export interface NumberField extends BaseField {
  type: 'number'
  required: boolean
  min: number | null
  max: number | null
  decimalPlaces: 0 | 1 | 2 | 3 | 4
  prefix: string
  suffix: string
}

export interface DateField extends BaseField {
  type: 'date'
  required: boolean
  prefillToday: boolean
  minDate: string | null
  maxDate: string | null
}

export type SingleSelectDisplayType = 'radio' | 'dropdown' | 'tiles'

export interface SelectOption {
  id: string
  label: string
}

export interface SingleSelectField extends BaseField {
  type: 'single-select'
  required: boolean
  options: SelectOption[]
  displayType: SingleSelectDisplayType
}

export interface MultiSelectField extends BaseField {
  type: 'multi-select'
  required: boolean
  options: SelectOption[]
  minSelections: number | null
  maxSelections: number | null
}

export interface FileUploadField extends BaseField {
  type: 'file-upload'
  required: boolean
  allowedTypes: string
  maxFiles: number | null
}

export type SectionHeaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

export interface SectionHeaderField extends BaseField {
  type: 'section-header'
  size: SectionHeaderSize
}

export type AggregationType = 'sum' | 'average' | 'minimum' | 'maximum'

export interface CalculationField extends BaseField {
  type: 'calculation'
  sourceFieldIds: string[]
  aggregation: AggregationType
  decimalPlaces: 0 | 1 | 2 | 3 | 4
}

// ─── Union ────────────────────────────────────────────────────────────────────

export type Field =
  | SingleLineTextField
  | MultiLineTextField
  | NumberField
  | DateField
  | SingleSelectField
  | MultiSelectField
  | FileUploadField
  | SectionHeaderField
  | CalculationField
