import type { MultiLineTextField } from '@/schema'
import { Textarea } from '@/components/ui/Textarea'

interface Props {
  field: MultiLineTextField
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function MultiLineTextInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  return (
    <Textarea
      label={field.label}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
      error={error}
      isRequired={isRequired}
      disabled={isDisabled}
      rows={field.rows}
      minLength={field.minLength ?? undefined}
      maxLength={field.maxLength ?? undefined}
    />
  )
}
