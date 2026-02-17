'use client'

import { useState } from 'react'
import { useChildren } from '@/lib/children-context'
import { AddChildForm } from './add-child-form'
import { AVATARS } from '@/lib/types'
import type { ChildProfile } from '@/lib/types'
import { Plus, ChevronLeft, Pencil, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ChildrenScreenProps {
  onBack: () => void
}

export function ChildrenScreen({ onBack }: ChildrenScreenProps) {
  const { children, addChild, updateChild, removeChild } = useChildren()
  const [showForm, setShowForm] = useState(false)
  const [editChild, setEditChild] = useState<ChildProfile | null>(null)

  const getAvatar = (id: string) =>
    AVATARS.find((a) => a.id === id)?.emoji ?? '🐻'

  if (showForm || editChild) {
    return (
      <AddChildForm
        editChild={editChild}
        onSave={(child) => {
          if (editChild) {
            updateChild(child)
          } else {
            addChild(child)
          }
          setShowForm(false)
          setEditChild(null)
        }}
        onCancel={() => {
          setShowForm(false)
          setEditChild(null)
        }}
      />
    )
  }

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
          My Children
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="text-primary"
          aria-label="Add child"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* List */}
      <div className="flex flex-1 flex-col gap-3 overflow-y-auto px-4 pb-4 pt-2">
        {children.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
            <div className="rounded-full bg-secondary p-6">
              <span className="text-5xl" role="img" aria-hidden="true">
                🌙
              </span>
            </div>
            <div>
              <p className="text-lg font-semibold text-foreground">
                No children yet
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Add a child to start creating personalized bedtime stories
              </p>
            </div>
            <Button
              onClick={() => setShowForm(true)}
              className="mt-2 gap-2 bg-primary text-primary-foreground"
            >
              <Plus className="h-4 w-4" />
              Add Your First Child
            </Button>
          </div>
        ) : (
          children.map((child) => (
            <div
              key={child.id}
              className="flex items-center gap-4 rounded-2xl bg-card p-4"
            >
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
                <span className="text-3xl" role="img" aria-hidden="true">
                  {getAvatar(child.avatar)}
                </span>
              </div>
              <div className="flex-1">
                <p className="font-mono text-base font-bold text-card-foreground">
                  {child.name}
                </p>
                <p className="text-sm text-muted-foreground">
                  Age {child.age}
                </p>
                {child.interests.length > 0 && (
                  <div className="mt-1 flex flex-wrap gap-1">
                    {child.interests.slice(0, 3).map((i) => (
                      <span
                        key={i}
                        className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary"
                      >
                        {i}
                      </span>
                    ))}
                    {child.interests.length > 3 && (
                      <span className="text-xs text-muted-foreground">
                        +{child.interests.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => setEditChild(child)}
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary"
                  aria-label={`Edit ${child.name}`}
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={() => removeChild(child.id)}
                  className="rounded-lg p-2 text-destructive transition-colors hover:bg-secondary"
                  aria-label={`Remove ${child.name}`}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
