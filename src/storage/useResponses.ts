import { useState, useCallback } from 'react'
import type { FormResponse } from '@/schema'
import { responseStore } from './responseStore'

export function useResponses(templateId: string) {
  const [responses, setResponses] = useState<FormResponse[]>(() =>
    responseStore.getByTemplateId(templateId),
  )

  const save = useCallback((response: FormResponse) => {
    responseStore.save(response)
    setResponses(responseStore.getByTemplateId(templateId))
  }, [templateId])

  const remove = useCallback((id: string) => {
    responseStore.delete(id)
    setResponses(responseStore.getByTemplateId(templateId))
  }, [templateId])

  return { responses, save, remove }
}
