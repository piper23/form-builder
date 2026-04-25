import type { CalculationField, FieldValues } from '@/schema'

interface Props {
  field: CalculationField
  allValues: FieldValues
}

export function CalculationDisplay({ field, allValues }: Props) {
  const result = compute(field, allValues)
  const formatted = result === null ? '—' : result.toFixed(field.decimalPlaces)

  return (
    <div className="flex flex-col gap-1">
      <span className="text-xs font-medium text-neutral-700 uppercase tracking-wide">
        {field.label}
        <span className="ml-1.5 text-neutral-400 normal-case font-normal text-xs">
          ({field.aggregation})
        </span>
      </span>
      <div className="flex items-center px-3 py-2 bg-mint-50 border border-mint-200 rounded-lg">
        <span className="text-sm font-semibold text-mint-700">{formatted}</span>
        <span className="ml-auto text-xs text-neutral-400">read-only</span>
      </div>
    </div>
  )
}

function compute(field: CalculationField, values: FieldValues): number | null {
  const nums = field.sourceFieldIds
    .map(id => {
      const v = values[id]
      return v !== null && v !== undefined && v !== '' ? Number(v) : null
    })
    .filter((n): n is number => n !== null && !isNaN(n))

  if (!nums.length) return null

  switch (field.aggregation) {
    case 'sum': return nums.reduce((a, b) => a + b, 0)
    case 'average': return nums.reduce((a, b) => a + b, 0) / nums.length
    case 'minimum': return Math.min(...nums)
    case 'maximum': return Math.max(...nums)
  }
}
