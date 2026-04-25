import type { Field, FieldValues, FileMetadata } from '@/schema'
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

export function FieldRenderer({ field, allValues, value, onChange, error, isRequired, isDisabled }: Props) {
  const str = (v: FieldValues[string]): string =>
    v === null || v === undefined ? '' : String(v)

  const strArr = (v: FieldValues[string]): string[] =>
    Array.isArray(v) ? (v as string[]) : []

  const fileMeta = (v: FieldValues[string]): FileMetadata[] =>
    Array.isArray(v) ? (v as FileMetadata[]) : []

  switch (field.type) {
    case 'single-line-text':
      return (
        <SingleLineTextInput
          field={field}
          value={str(value)}
          onChange={v => onChange(field.id, v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'multi-line-text':
      return (
        <MultiLineTextInput
          field={field}
          value={str(value)}
          onChange={v => onChange(field.id, v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'number':
      return (
        <NumberInput
          field={field}
          value={str(value)}
          onChange={v => onChange(field.id, v === '' ? null : v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'date':
      return (
        <DateInput
          field={field}
          value={str(value)}
          onChange={v => onChange(field.id, v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'single-select':
      return (
        <SingleSelectInput
          field={field}
          value={str(value)}
          onChange={v => onChange(field.id, v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'multi-select':
      return (
        <MultiSelectInput
          field={field}
          value={strArr(value)}
          onChange={v => onChange(field.id, v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'file-upload':
      return (
        <FileUploadInput
          field={field}
          value={fileMeta(value)}
          onChange={v => onChange(field.id, v)}
          error={error}
          isRequired={isRequired}
          isDisabled={isDisabled}
        />
      )

    case 'section-header':
      return <SectionHeaderDisplay field={field} />

    case 'calculation':
      return <CalculationDisplay field={field} allValues={allValues} />
  }
}
