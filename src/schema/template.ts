import type { Field } from './fields'

export interface Template {
  id: string
  title: string
  fields: Field[]
  isDraft?: boolean
  createdAt: string  // ISO 8601
  updatedAt: string  // ISO 8601
}
