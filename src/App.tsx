import { useState } from 'react'
import type { Template } from '@/schema'
import { TemplateList } from '@/features/templates/TemplateList'
import { BuilderPage } from '@/features/builder/BuilderPage'
import { FillPage } from '@/features/fill/FillPage'

type Route =
  | { view: 'home' }
  | { view: 'builder'; templateId: string | null }
  | { view: 'fill'; templateId: string; responseId: string | null }

export default function App() {
  const [route, setRoute] = useState<Route>({ view: 'home' })

  if (route.view === 'builder') {
    return (
      <BuilderPage
        templateId={route.templateId}
        onBack={() => setRoute({ view: 'home' })}
        onFill={(t: Template) =>
          setRoute({ view: 'fill', templateId: t.id, responseId: null })
        }
      />
    )
  }

  if (route.view === 'fill') {
    return (
      <FillPage
        templateId={route.templateId}
        responseId={route.responseId}
        onBack={() => setRoute({ view: 'home' })}
      />
    )
  }

  return (
    <TemplateList
      onNew={() => setRoute({ view: 'builder', templateId: null })}
      onEdit={(id) => setRoute({ view: 'builder', templateId: id })}
      onFill={(id) => setRoute({ view: 'fill', templateId: id, responseId: null })}
    />
  )
}
