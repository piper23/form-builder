import { useState } from 'react'
import type { Template } from '@/schema'
import { templateStore } from '@/storage'
import { makeBlankTemplate } from '@/features/builder/builderReducer'
import { useTheme } from '@/storage/useTheme'
import { TemplateList } from '@/features/templates/TemplateList'
import { BuilderPage } from '@/features/builder/BuilderPage'
import { FillPage } from '@/features/fill/FillPage'

type Route =
  | { view: 'home' }
  | { view: 'builder'; templateId: string }
  | { view: 'fill'; templateId: string; responseId: string | null }

export default function App() {
  const [route, setRoute] = useState<Route>({ view: 'home' })
  const { theme, toggleTheme } = useTheme()

  function handleNew() {
    const draft = makeBlankTemplate()
    templateStore.save(draft)
    setRoute({ view: 'builder', templateId: draft.id })
  }

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
      theme={theme}
      onToggleTheme={toggleTheme}
      onNew={handleNew}
      onEdit={(id) => setRoute({ view: 'builder', templateId: id })}
      onFill={(id) => setRoute({ view: 'fill', templateId: id, responseId: null })}
    />
  )
}
