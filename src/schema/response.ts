export interface FileMetadata {
  name: string
  size: number
  type: string
}

// Map of fieldId → value. Section headers and hidden fields are absent.
export type FieldValues = Record<string, FieldValue>

export type FieldValue =
  | string
  | number
  | string[]
  | FileMetadata[]
  | null

export interface FormResponse {
  id: string
  templateId: string
  templateSnapshot: {
    title: string
    fieldOrder: string[]  // ordered field ids at time of submission
  }
  values: FieldValues
  submittedAt: string  // ISO 8601
}
