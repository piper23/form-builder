import type { Field, FieldValues, FileMetadata } from '@/schema'

export function validateFields(
  fields: Field[],
  values: FieldValues,
  visibility: Record<string, { isVisible: boolean; isRequired: boolean }>,
): Record<string, string> {
  const errors: Record<string, string> = {}

  for (const field of fields) {
    const state = visibility[field.id]
    if (!state?.isVisible) continue
    if (field.type === 'section-header' || field.type === 'calculation') continue

    const val = values[field.id]
    const isRequired = state.isRequired

    if (field.type === 'file-upload') {
      const files = val as FileMetadata[] | undefined
      if (isRequired && (!files || files.length === 0)) {
        errors[field.id] = `${field.label || 'This field'} is required`
        continue
      }
      if (files && files.length > 0 && field.maxFileSizeMb) {
        const oversized = files.find(f => f.size > field.maxFileSizeMb! * 1024 * 1024)
        if (oversized) {
          errors[field.id] = `"${oversized.name}" exceeds the ${field.maxFileSizeMb} MB size limit`
        }
      }
      continue
    }

    if (field.type === 'multi-select') {
      const arr = val as string[] | undefined
      if (isRequired && (!arr || arr.length === 0)) {
        errors[field.id] = `${field.label || 'This field'} is required`
        continue
      }
      if (arr && arr.length > 0) {
        if (field.minSelections && arr.length < field.minSelections) {
          errors[field.id] = `Select at least ${field.minSelections} option${field.minSelections > 1 ? 's' : ''}`
          continue
        }
        if (field.maxSelections && arr.length > field.maxSelections) {
          errors[field.id] = `Select at most ${field.maxSelections} option${field.maxSelections > 1 ? 's' : ''}`
          continue
        }
      }
      continue
    }

    if (val === null || val === undefined || val === '') {
      if (isRequired) {
        errors[field.id] = `${field.label || 'This field'} is required`
      }
      continue
    }

    if (field.type === 'single-line-text' || field.type === 'multi-line-text') {
      const str = val as string
      if (field.minLength && str.length < field.minLength) {
        errors[field.id] = `Must be at least ${field.minLength} character${field.minLength > 1 ? 's' : ''}`
        continue
      }
      if (field.maxLength && str.length > field.maxLength) {
        errors[field.id] = `Must be at most ${field.maxLength} character${field.maxLength > 1 ? 's' : ''}`
        continue
      }
    }

    if (field.type === 'number') {
      const num = Number(val)
      if (!isNaN(num)) {
        if (field.min !== null && num < field.min) {
          errors[field.id] = `Must be at least ${field.min}`
          continue
        }
        if (field.max !== null && num > field.max) {
          errors[field.id] = `Must be at most ${field.max}`
          continue
        }
      }
    }
  }

  return errors
}
