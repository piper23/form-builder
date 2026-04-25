import type { Field, FieldValues, Condition, ConditionEffect } from '@/schema'

function matchesCondition(cond: Condition, fieldValue: FieldValues[string]): boolean {
  const { operator, value } = cond

  if (fieldValue === null || fieldValue === undefined || fieldValue === '') return false
  if (Array.isArray(fieldValue) && fieldValue.length === 0) return false

  switch (operator) {
    case 'equals':
      return String(fieldValue) === String(value)
    case 'does-not-equal':
      return String(fieldValue) !== String(value)
    case 'contains':
      return String(fieldValue).toLowerCase().includes(String(value).toLowerCase())
    case 'is-greater-than':
      return Number(fieldValue) > Number(value)
    case 'is-less-than':
      return Number(fieldValue) < Number(value)
    case 'is-within-range': {
      const [min, max] = value as [number, number]
      return Number(fieldValue) >= min && Number(fieldValue) <= max
    }
    case 'contains-any-of': {
      const chosen = fieldValue as string[]
      const targets = value as string[]
      return targets.some(t => chosen.includes(t))
    }
    case 'contains-all-of': {
      const chosen = fieldValue as string[]
      const targets = value as string[]
      return targets.every(t => chosen.includes(t))
    }
    case 'contains-none-of': {
      const chosen = fieldValue as string[]
      const targets = value as string[]
      return !targets.some(t => chosen.includes(t))
    }
    case 'is-before':
      return String(fieldValue) < String(value)
    case 'is-after':
      return String(fieldValue) > String(value)
    default:
      return false
  }
}

function resolveField(
  field: Field,
  values: FieldValues,
  visibilityMap: Record<string, boolean>,
): { isVisible: boolean; isRequired: boolean } {
  const baseRequired = 'required' in field ? (field as { required: boolean }).required : field.defaultRequired

  if (!field.conditions.length) {
    return {
      isVisible: field.defaultVisible,
      isRequired: field.defaultVisible && baseRequired,
    }
  }

  const activeEffects = new Set<ConditionEffect>()

  for (const cond of field.conditions) {
    // If the target field is hidden, treat its value as absent
    if (visibilityMap[cond.targetFieldId] === false) continue
    const raw = values[cond.targetFieldId]
    if (matchesCondition(cond, raw ?? null)) {
      activeEffects.add(cond.effect)
    }
  }

  // Resolve visibility: hide wins over show
  let isVisible = field.defaultVisible
  if (activeEffects.has('hide')) {
    isVisible = false
  } else if (activeEffects.has('show')) {
    isVisible = true
  }

  // Hidden fields are never required
  if (!isVisible) return { isVisible: false, isRequired: false }

  // Resolve required: mark-required wins over mark-not-required
  let isRequired = baseRequired
  if (activeEffects.has('mark-required')) {
    isRequired = true
  } else if (activeEffects.has('mark-not-required')) {
    isRequired = false
  }

  return { isVisible, isRequired }
}

export function evaluateAllFields(
  fields: Field[],
  values: FieldValues,
): Record<string, { isVisible: boolean; isRequired: boolean }> {
  const result: Record<string, { isVisible: boolean; isRequired: boolean }> = {}

  // Single ordered pass — each field uses visibility of already-processed fields
  for (const field of fields) {
    const visMap: Record<string, boolean> = {}
    for (const [id, r] of Object.entries(result)) {
      visMap[id] = r.isVisible
    }
    result[field.id] = resolveField(field, values, visMap)
  }

  return result
}
