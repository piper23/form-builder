import type { JSX } from 'react'
import type {
  Field,
  FieldType,
  FieldValues,
  FileMetadata,
  SingleLineTextField,
  MultiLineTextField,
  NumberField,
  DateField,
  SingleSelectField,
  MultiSelectField,
  FileUploadField,
  SectionHeaderField,
  CalculationField,
} from '@/schema'
import { SingleLineTextInput } from './fields/SingleLineTextInput'
import { MultiLineTextInput } from './fields/MultiLineTextInput'
import { NumberInput } from './fields/NumberInput'
import { DateInput } from './fields/DateInput'
import { SingleSelectInput } from './fields/SingleSelectInput'
import { MultiSelectInput } from './fields/MultiSelectInput'
import { FileUploadInput } from './fields/FileUploadInput'
import { SectionHeaderDisplay } from './fields/SectionHeaderDisplay'
import { CalculationDisplay } from './fields/CalculationDisplay'

interface Props {
  field: Field
  allValues: FieldValues
  value: FieldValues[string]
  onChange: (id: string, value: FieldValues[string]) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

const str = (v: FieldValues[string]): string =>
  v === null || v === undefined ? '' : String(v)

const strArr = (v: FieldValues[string]): string[] =>
  Array.isArray(v) ? (v as string[]) : []

const fileMeta = (v: FieldValues[string]): FileMetadata[] =>
  Array.isArray(v) ? (v as FileMetadata[]) : []

const FIELD_RENDERERS: Record<FieldType, (props: Props) => JSX.Element | null> = {
  'single-line-text': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <SingleLineTextInput
      field={field as SingleLineTextField}
      value={str(value)}
      onChange={v => onChange(field.id, v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'multi-line-text': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <MultiLineTextInput
      field={field as MultiLineTextField}
      value={str(value)}
      onChange={v => onChange(field.id, v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'number': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <NumberInput
      field={field as NumberField}
      value={str(value)}
      onChange={v => onChange(field.id, v === '' ? null : v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'date': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <DateInput
      field={field as DateField}
      value={str(value)}
      onChange={v => onChange(field.id, v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'single-select': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <SingleSelectInput
      field={field as SingleSelectField}
      value={str(value)}
      onChange={v => onChange(field.id, v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'multi-select': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <MultiSelectInput
      field={field as MultiSelectField}
      value={strArr(value)}
      onChange={v => onChange(field.id, v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'file-upload': ({ field, value, onChange, error, isRequired, isDisabled }) => (
    <FileUploadInput
      field={field as FileUploadField}
      value={fileMeta(value)}
      onChange={v => onChange(field.id, v)}
      error={error}
      isRequired={isRequired}
      isDisabled={isDisabled}
    />
  ),
  'section-header': ({ field }) => (
    <SectionHeaderDisplay field={field as SectionHeaderField} />
  ),
  'calculation': ({ field, allValues }) => (
    <CalculationDisplay field={field as CalculationField} allValues={allValues} />
  ),
}

export function FieldRenderer(props: Props) {
  return FIELD_RENDERERS[props.field.type](props)
}
