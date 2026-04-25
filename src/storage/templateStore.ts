import type { Template } from '@/schema'
import { STORAGE_KEYS } from './keys'

function readAll(): Template[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.TEMPLATES)
    return raw ? (JSON.parse(raw) as Template[]) : []
  } catch {
    return []
  }
}

function writeAll(templates: Template[]): void {
  localStorage.setItem(STORAGE_KEYS.TEMPLATES, JSON.stringify(templates))
}

export const templateStore = {
  getAll(): Template[] {
    return readAll()
  },

  getById(id: string): Template | undefined {
    return readAll().find((t) => t.id === id)
  },

  save(template: Template): void {
    const all = readAll()
    const idx = all.findIndex((t) => t.id === template.id)
    if (idx === -1) {
      writeAll([...all, template])
    } else {
      const next = [...all]
      next[idx] = template
      writeAll(next)
    }
  },

  delete(id: string): void {
    writeAll(readAll().filter((t) => t.id !== id))
  },
}
