import type { Template, Field } from '@/schema'
import { ids } from '@/lib/ids'

export interface BuilderState {
  template: Template
  selectedFieldId: string | null
  dirty: boolean
}

export type BuilderAction =
  | { type: 'SET_TITLE'; title: string }
  | { type: 'ADD_FIELD'; field: Field }
  | { type: 'DELETE_FIELD'; id: string }
  | { type: 'REORDER_FIELDS'; activeId: string; overId: string }
  | { type: 'UPDATE_FIELD'; field: Field }
  | { type: 'SELECT_FIELD'; id: string | null }
  | { type: 'MARK_SAVED' }
  | { type: 'LOAD'; template: Template }

function arrayMove<T>(arr: T[], fromIndex: number, toIndex: number): T[] {
  const result = [...arr]
  const [removed] = result.splice(fromIndex, 1)
  result.splice(toIndex, 0, removed)
  return result
}

export function builderReducer(state: BuilderState, action: BuilderAction): BuilderState {
  switch (action.type) {
    case 'LOAD':
      return { template: action.template, selectedFieldId: null, dirty: false }

    case 'SET_TITLE':
      return {
        ...state,
        dirty: true,
        template: { ...state.template, title: action.title },
      }

    case 'ADD_FIELD': {
      const template = {
        ...state.template,
        fields: [...state.template.fields, action.field],
      }
      return { ...state, template, selectedFieldId: action.field.id, dirty: true }
    }

    case 'DELETE_FIELD': {
      const fields = state.template.fields.filter(f => f.id !== action.id)
      return {
        ...state,
        dirty: true,
        selectedFieldId: state.selectedFieldId === action.id ? null : state.selectedFieldId,
        template: { ...state.template, fields },
      }
    }

    case 'REORDER_FIELDS': {
      const { fields } = state.template
      const fromIdx = fields.findIndex(f => f.id === action.activeId)
      const toIdx = fields.findIndex(f => f.id === action.overId)
      if (fromIdx === -1 || toIdx === -1) return state
      return {
        ...state,
        dirty: true,
        template: { ...state.template, fields: arrayMove(fields, fromIdx, toIdx) },
      }
    }

    case 'UPDATE_FIELD': {
      const fields = state.template.fields.map(f =>
        f.id === action.field.id ? action.field : f,
      )
      return { ...state, dirty: true, template: { ...state.template, fields } }
    }

    case 'SELECT_FIELD':
      return { ...state, selectedFieldId: action.id }

    case 'MARK_SAVED':
      return {
        ...state,
        dirty: false,
        template: { ...state.template, isDraft: false, updatedAt: new Date().toISOString() },
      }

    default:
      return state
  }
}

export function makeBlankTemplate(): Template {
  return {
    id: ids.template(),
    title: '',
    fields: [],
    isDraft: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }
}
