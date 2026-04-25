import type { Field } from './fields'

export interface Template {
  id: string
  title: string
  fields: Field[]
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
}
