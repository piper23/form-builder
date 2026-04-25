import type { FormResponse, Template } from '@/schema'
import { printResponse } from '@/lib/pdf'
import { evaluateAllFields } from '@/lib/conditions'
import { Button } from '@/components/ui/Button'
import { EmptyState } from '@/components/ui/EmptyState'

interface Props {
  responses: FormResponse[]
  template: Template
  onDelete: (id: string) => void
}

export function ResponsesPanel({ responses, template, onDelete }: Props) {
  if (responses.length === 0) {
    return (
      <EmptyState
        icon="📭"
        title="No responses yet"
        description="Submit the form above to see responses here."
      />
    )
  }

  function handlePrint(response: FormResponse) {
    const visibility = evaluateAllFields(template.fields, response.values)
    printResponse(template, response, visibility)
  }

  return (
    <div className="space-y-3">
      {responses
        .slice()
        .reverse()
        .map(r => (
          <div
            key={r.id}
            className="flex items-center justify-between p-4 bg-neutral-0 rounded-xl border border-neutral-200 shadow-sm"
          >
            <div>
              <p className="text-sm font-medium text-neutral-800">
                {new Date(r.submittedAt).toLocaleString()}
              </p>
              <p className="text-xs text-neutral-500 mt-0.5">
                {Object.keys(r.values).length} field{Object.keys(r.values).length !== 1 ? 's' : ''} answered
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handlePrint(r)}
              >
                📄 PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDelete(r.id)}
                className="text-danger-500 hover:bg-danger-50"
              >
                🗑️
              </Button>
            </div>
          </div>
        ))}
    </div>
  )
}
