import type { SingleLineTextField } from '@/schema'
import { Input } from '@/components/ui/Input'

interface Props {
  field: SingleLineTextField
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function SingleLineTextInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  return (
    <Input
      label={field.label}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={field.placeholder}
      error={error}
      isRequired={isRequired}
      disabled={isDisabled}
      prefix={field.prefix || undefined}
      suffix={field.suffix || undefined}
      minLength={field.minLength ?? undefined}
      maxLength={field.maxLength ?? undefined}
    />
  )
}
