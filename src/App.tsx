import { useState, useEffect } from 'react'
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

function parseRoute(pathname: string): Route {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] === 'builder' && parts[1]) return { view: 'builder', templateId: parts[1] }
  if (parts[0] === 'fill' && parts[1]) return { view: 'fill', templateId: parts[1], responseId: null }
  return { view: 'home' }
}

function routeToPath(route: Route): string {
  if (route.view === 'builder') return `/builder/${route.templateId}`
  if (route.view === 'fill') return `/fill/${route.templateId}`
  return '/'
}

export default function App() {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.pathname))
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const onPop = () => setRoute(parseRoute(window.location.pathname))
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  function navigate(next: Route) {
    window.history.pushState(null, '', routeToPath(next))
    setRoute(next)
  }

  function handleNew() {
    const draft = makeBlankTemplate()
    templateStore.save(draft)
    navigate({ view: 'builder', templateId: draft.id })
  }

  if (route.view === 'builder') {
    return (
      <BuilderPage
        templateId={route.templateId}
        onBack={() => navigate({ view: 'home' })}
        onFill={(t: Template) =>
          navigate({ view: 'fill', templateId: t.id, responseId: null })
        }
      />
    )
  }

  if (route.view === 'fill') {
    return (
      <FillPage
        templateId={route.templateId}
        responseId={route.responseId}
        onBack={() => navigate({ view: 'home' })}
      />
    )
  }

  return (
    <TemplateList
      theme={theme}
      onToggleTheme={toggleTheme}
      onNew={handleNew}
      onEdit={(id) => navigate({ view: 'builder', templateId: id })}
      onFill={(id) => navigate({ view: 'fill', templateId: id, responseId: null })}
    />
  )
}
