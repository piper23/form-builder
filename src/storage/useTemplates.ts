import { useState, useCallback } from 'react'
import type { Template } from '@/schema'
import { templateStore } from './templateStore'
import { responseStore } from './responseStore'

export function useTemplates() {
  // Lazy initializer — runs once synchronously, including after a hard refresh.
  const [templates, setTemplates] = useState<Template[]>(() => templateStore.getAll())

  const save = useCallback((template: Template) => {
    templateStore.save(template)
    setTemplates(templateStore.getAll())
  }, [])

  const remove = useCallback((id: string) => {
    templateStore.delete(id)
    responseStore.deleteByTemplateId(id)
    setTemplates(templateStore.getAll())
  }, [])

  return { templates, save, remove }
}
