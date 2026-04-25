import type { FormResponse } from '@/schema'
import { STORAGE_KEYS } from './keys'

function readAll(): FormResponse[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.RESPONSES)
    return raw ? (JSON.parse(raw) as FormResponse[]) : []
  } catch {
    return []
  }
}

function writeAll(responses: FormResponse[]): void {
  localStorage.setItem(STORAGE_KEYS.RESPONSES, JSON.stringify(responses))
}

export const responseStore = {
  getAll(): FormResponse[] {
    return readAll()
  },

  getByTemplateId(templateId: string): FormResponse[] {
    return readAll().filter((r) => r.templateId === templateId)
  },

  getById(id: string): FormResponse | undefined {
    return readAll().find((r) => r.id === id)
  },

  save(response: FormResponse): void {
    const all = readAll()
    const idx = all.findIndex((r) => r.id === response.id)
    if (idx === -1) {
      writeAll([...all, response])
    } else {
      const next = [...all]
      next[idx] = response
      writeAll(next)
    }
  },

  delete(id: string): void {
    writeAll(readAll().filter((r) => r.id !== id))
  },

  deleteByTemplateId(templateId: string): void {
    writeAll(readAll().filter((r) => r.templateId !== templateId))
  },
}
