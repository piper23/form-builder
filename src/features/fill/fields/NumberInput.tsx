import type { NumberField } from '@/schema'
import { Input } from '@/components/ui/Input'

interface Props {
  field: NumberField
  value: string
  onChange: (value: string) => void
  error?: string
  isRequired: boolean
  isDisabled?: boolean
}

export function NumberInput({ field, value, onChange, error, isRequired, isDisabled }: Props) {
  return (
    <Input
      label={field.label}
      type="number"
      value={value}
      onChange={e => onChange(e.target.value)}
      error={error}
      isRequired={isRequired}
      disabled={isDisabled}
      prefix={field.prefix || undefined}
      suffix={field.suffix || undefined}
      placeholder={field.placeholder || undefined}
      min={field.min ?? undefined}
      max={field.max ?? undefined}
      step={field.decimalPlaces === 0 ? 1 : Math.pow(10, -field.decimalPlaces)}
    />
  )
}
