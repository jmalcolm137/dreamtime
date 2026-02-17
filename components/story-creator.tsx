'use client'

import { useState } from 'react'
import { useChildren } from '@/lib/children-context'
import { AVATARS, SUGGESTED_THEMES } from '@/lib/types'
import type { ChildProfile } from '@/lib/types'
import { ChevronLeft, Sparkles, BookOpen } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface StoryCreatorProps {
  onBack: () => void
  onGenerate: (children: ChildProfile[], theme: string) => void
  preselectedChildId?: string | null
}

export function StoryCreator({
  onBack,
  onGenerate,
  preselectedChildId,
}: StoryCreatorProps) {
  const { children } = useChildren()
  const [selectedChildren, setSelectedChildren] = useState<string[]>(
    preselectedChildId ? [preselectedChildId] : children.length > 0 ? [children[0].id] : []
  )
  const [theme, setTheme] = useState('')

  const getAvatar = (id: string) =>
    AVATARS.find((a) => a.id === id)?.emoji ?? '🐻'

  const toggleChild = (id: string) => {
    setSelectedChildren((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    )
  }

  const selectedProfiles = children.filter((c) => selectedChildren.includes(c.id))
  const canGenerate = selectedProfiles.length > 0 && theme.trim().length > 0

  return (
    <div className="flex flex-1 flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-primary"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm">Back</span>
        </button>
        <h1 className="flex-1 text-center font-mono text-xl font-bold text-foreground">
          New Story
        </h1>
        <div className="w-12" />
      </div>

      <div className="flex flex-1 flex-col gap-6 overflow-y-auto px-4 pb-6 pt-2">
        {/* Child selection */}
        {children.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-2xl bg-card p-6 text-center">
            <span className="text-4xl" role="img" aria-hidden="true">
              🌙
            </span>
            <p className="text-sm text-muted-foreground">
              Add a child first to create a personalized story
            </p>
            <Button onClick={onBack} variant="outline" className="border-border text-foreground">
              Go Back
            </Button>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-muted-foreground">
                Choose children
                <span className="ml-1 text-xs font-normal text-muted-foreground/70">
                  (select one or more)
                </span>
              </label>
              <div className="flex gap-3 overflow-x-auto pb-1">
                {children.map((c) => {
                  const isSelected = selectedChildren.includes(c.id)
                  return (
                    <button
                      key={c.id}
                      onClick={() => toggleChild(c.id)}
                      className={`relative flex flex-shrink-0 flex-col items-center gap-2 rounded-2xl p-4 transition-all ${
                        isSelected
                          ? 'bg-primary/20 ring-2 ring-primary'
                          : 'bg-card'
                      }`}
                      aria-pressed={isSelected}
                      aria-label={`${isSelected ? 'Deselect' : 'Select'} ${c.name}`}
                    >
                      {isSelected && (
                        <div className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                          {'✓'}
                        </div>
                      )}
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                        <span
                          className="text-2xl"
                          role="img"
                          aria-hidden="true"
                        >
                          {getAvatar(c.avatar)}
                        </span>
                      </div>
                      <span className="text-xs font-medium text-foreground">
                        {c.name}
                      </span>
                    </button>
                  )
                })}
              </div>
              {selectedProfiles.length > 1 && (
                <p className="text-xs text-primary">
                  {selectedProfiles.map((c) => c.name).join(', ')} will star together
                </p>
              )}
            </div>

            {/* Theme */}
            <div className="flex flex-col gap-2">
              <label
                htmlFor="story-theme"
                className="text-sm font-medium text-muted-foreground"
              >
                {"What's tonight's story about?"}
              </label>
              <Textarea
                id="story-theme"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="A magical adventure where..."
                rows={3}
                className="resize-none border-border bg-secondary text-foreground placeholder:text-muted-foreground"
              />
            </div>

            {/* Suggested themes */}
            <div className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">Or pick a theme</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_THEMES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                      theme === t
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-card text-card-foreground'
                    }`}
                  >
                    <BookOpen className="h-3 w-3" />
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Generate button */}
            <Button
              onClick={() => canGenerate && onGenerate(selectedProfiles, theme)}
              disabled={!canGenerate}
              className="mt-auto gap-2 bg-primary py-6 text-base font-bold text-primary-foreground disabled:opacity-40"
            >
              <Sparkles className="h-5 w-5" />
              Create Bedtime Story
            </Button>
          </>
        )}
      </div>
    </div>
  )
}
