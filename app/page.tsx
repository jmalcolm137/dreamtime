'use client'

import { useState, useCallback } from 'react'
import { ChildrenProvider } from '@/lib/children-context'
import { StarField } from '@/components/star-field'
import { HomeScreen } from '@/components/home-screen'
import { ChildrenScreen } from '@/components/children-screen'
import { StoryCreator } from '@/components/story-creator'
import { StoryViewer } from '@/components/story-viewer'
import type { Screen, ChildProfile } from '@/lib/types'

function AppContent() {
  const [screen, setScreen] = useState<Screen>('home')
  const [storyChildren, setStoryChildren] = useState<ChildProfile[]>([])
  const [storyTheme, setStoryTheme] = useState('')
  const [preselectedChildId, setPreselectedChildId] = useState<string | null>(
    null
  )

  const handleGenerate = useCallback(
    (children: ChildProfile[], theme: string) => {
      setStoryChildren(children)
      setStoryTheme(theme)
      setScreen('story')
    },
    []
  )

  const handleCreateForChild = useCallback((childId: string) => {
    setPreselectedChildId(childId)
    setScreen('create')
  }, [])

  return (
    <div className="relative mx-auto flex h-dvh w-full max-w-md flex-col bg-background">
      <StarField />
      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        {screen === 'home' && (
          <HomeScreen
            onNavigate={(s) => {
              setPreselectedChildId(null)
              setScreen(s)
            }}
            onCreateForChild={handleCreateForChild}
          />
        )}
        {screen === 'children' && (
          <ChildrenScreen onBack={() => setScreen('home')} />
        )}
        {screen === 'create' && (
          <StoryCreator
            onBack={() => setScreen('home')}
            onGenerate={handleGenerate}
            preselectedChildId={preselectedChildId}
          />
        )}
        {screen === 'story' && storyChildren.length > 0 && (
          <StoryViewer
            storyChildren={storyChildren}
            theme={storyTheme}
            onBack={() => setScreen('home')}
          />
        )}
      </div>
    </div>
  )
}

export default function Page() {
  return (
    <ChildrenProvider>
      <AppContent />
    </ChildrenProvider>
  )
}
