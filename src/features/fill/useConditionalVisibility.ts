import { useMemo } from 'react'
import type { Field, FieldValues } from '@/schema'
import { evaluateAllFields } from '@/lib/conditions'

export function useConditionalVisibility(
  fields: Field[],
  values: FieldValues,
): Record<string, { isVisible: boolean; isRequired: boolean }> {
  return useMemo(() => evaluateAllFields(fields, values), [fields, values])
}
