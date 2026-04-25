import type { Field, FieldType } from '@/schema'
import { ids } from '@/lib/ids'

export function createField(type: FieldType): Field {
  const base = {
    id: ids.field(),
    label: '',
    conditions: [],
    defaultVisible: true,
    defaultRequired: false,
  }

  switch (type) {
    case 'single-line-text':
      return { ...base, type, placeholder: '', required: false, minLength: null, maxLength: null, prefix: '', suffix: '' }

    case 'multi-line-text':
      return { ...base, type, placeholder: '', required: false, minLength: null, maxLength: null, rows: 3 }

    case 'number':
      return { ...base, type, placeholder: '', required: false, min: null, max: null, decimalPlaces: 0, prefix: '', suffix: '' }

    case 'date':
      return { ...base, type, required: false, prefillToday: false, minDate: null, maxDate: null }

    case 'single-select':
      return { ...base, type, required: false, options: [], displayType: 'radio' }

    case 'multi-select':
      return { ...base, type, required: false, options: [], minSelections: null, maxSelections: null }

    case 'file-upload':
      return { ...base, type, required: false, allowedTypes: '', maxFiles: null }

    case 'section-header':
      return { ...base, type, label: 'Section', size: 'md' }

    case 'calculation':
      return { ...base, type, sourceFieldIds: [], aggregation: 'sum', decimalPlaces: 2 }
  }
}
