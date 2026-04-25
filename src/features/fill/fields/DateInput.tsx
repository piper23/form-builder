import type { DateField } from '@/schema'
import { Input } from '@/components/ui/Input'

interface Props {
  field: DateField
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function DateInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  return (
    <Input
      label={field.label}
      type="date"
      value={value}
      onChange={e => onChange(e.target.value)}
      error={error}
      isRequired={isRequired}
      disabled={isDisabled}
      min={field.minDate ?? undefined}
      max={field.maxDate ?? undefined}
    />
  )
}
