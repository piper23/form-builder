import { useState, useEffect, lazy, Suspense } from 'react'
import type { Template } from '@/schema'
import { templateStore } from '@/storage'
import { makeBlankTemplate } from '@/features/builder/builderReducer'
import { useTheme } from '@/storage/useTheme'
import { TemplateList } from '@/features/templates/TemplateList'

const BuilderPage = lazy(() => import('@/features/builder/BuilderPage').then(m => ({ default: m.BuilderPage })))
const FillPage = lazy(() => import('@/features/fill/FillPage').then(m => ({ default: m.FillPage })))

function Shimmer({ className }: { className?: string }) {
  return <div className={`animate-pulse rounded bg-neutral-200 dark:bg-neutral-700 ${className ?? ''}`} />
}

function BuilderSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* nav */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Shimmer className="h-8 w-8 rounded-lg" />
        <Shimmer className="h-5 w-48 rounded-md" />
        <div className="flex-1" />
        <Shimmer className="h-8 w-20 rounded-lg" />
        <Shimmer className="h-8 w-20 rounded-lg" />
        <Shimmer className="h-8 w-24 rounded-lg" />
      </div>
      <div className="flex flex-1 overflow-hidden">
        {/* palette */}
        <div className="hidden md:flex flex-col gap-2 w-52 p-3 border-r border-neutral-200 dark:border-neutral-800">
          <Shimmer className="h-4 w-24 rounded mb-1" />
          {[...Array(7)].map((_, i) => (
            <Shimmer key={i} className="h-9 w-full rounded-lg" />
          ))}
        </div>
        {/* canvas */}
        <div className="flex-1 overflow-auto p-6">
          <div className="max-w-2xl mx-auto flex flex-col gap-3">
            {[...Array(4)].map((_, i) => (
              <Shimmer key={i} className="h-16 w-full rounded-xl" />
            ))}
          </div>
        </div>
        {/* config panel */}
        <div className="hidden lg:flex flex-col gap-3 w-72 p-4 border-l border-neutral-200 dark:border-neutral-800">
          <Shimmer className="h-4 w-32 rounded" />
          <Shimmer className="h-9 w-full rounded-lg" />
          <Shimmer className="h-4 w-24 rounded mt-2" />
          <Shimmer className="h-9 w-full rounded-lg" />
          <Shimmer className="h-9 w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

function FillSkeleton() {
  return (
    <div className="flex flex-col h-screen bg-neutral-50 dark:bg-neutral-900">
      {/* nav */}
      <div className="flex items-center gap-3 px-4 h-14 border-b border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900">
        <Shimmer className="h-8 w-8 rounded-lg" />
        <Shimmer className="h-5 w-40 rounded-md" />
        <div className="flex-1" />
        <Shimmer className="h-8 w-28 rounded-lg" />
        <Shimmer className="h-8 w-28 rounded-lg" />
      </div>
      {/* form area */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto flex flex-col gap-4">
          <Shimmer className="h-7 w-56 rounded-md" />
          {[...Array(5)].map((_, i) => (
            <div key={i} className="flex flex-col gap-2">
              <Shimmer className="h-3.5 w-28 rounded" />
              <Shimmer className="h-10 w-full rounded-lg" />
            </div>
          ))}
          <Shimmer className="h-11 w-full rounded-xl mt-2" />
        </div>
      </div>
    </div>
  )
}

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
      <Suspense fallback={<BuilderSkeleton />}>
        <BuilderPage
          templateId={route.templateId}
          onBack={() => navigate({ view: 'home' })}
          onFill={(t: Template) =>
            navigate({ view: 'fill', templateId: t.id, responseId: null })
          }
        />
      </Suspense>
    )
  }

  if (route.view === 'fill') {
    return (
      <Suspense fallback={<FillSkeleton />}>
        <FillPage
          templateId={route.templateId}
          responseId={route.responseId}
          onBack={() => navigate({ view: 'home' })}
        />
      </Suspense>
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
