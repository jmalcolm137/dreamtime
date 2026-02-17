'use client'

import { useChildren } from '@/lib/children-context'
import { AVATARS } from '@/lib/types'
import { BookOpen, Users, Sparkles, Moon, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface HomeScreenProps {
  onNavigate: (screen: 'children' | 'create') => void
  onCreateForChild: (childId: string) => void
}

export function HomeScreen({ onNavigate, onCreateForChild }: HomeScreenProps) {
  const { children } = useChildren()

  const getAvatar = (id: string) =>
    AVATARS.find((a) => a.id === id)?.emoji ?? '🐻'

  return (
    <div className="flex flex-1 flex-col overflow-y-auto">
      {/* Hero */}
      <div className="flex flex-col items-center gap-2 px-6 pb-4 pt-8 text-center">
        <div className="relative">
          <Moon className="h-12 w-12 text-primary" />
          <Star className="absolute -right-2 -top-1 h-4 w-4 text-primary/60" />
          <Star className="absolute -left-3 top-3 h-3 w-3 text-primary/40" />
        </div>
        <h1 className="font-mono text-3xl font-bold text-foreground">
          Dreamweaver
        </h1>
        <p className="text-sm text-muted-foreground">
          Magical bedtime stories, made just for your little ones
        </p>
      </div>

      {/* Quick action */}
      <div className="px-4 pb-4">
        <Button
          onClick={() => onNavigate('create')}
          className="w-full gap-3 bg-primary py-7 text-base font-bold text-primary-foreground shadow-lg shadow-primary/20"
          disabled={children.length === 0}
        >
          <Sparkles className="h-5 w-5" />
          Create a Bedtime Story
        </Button>
        {children.length === 0 && (
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Add a child first to create stories
          </p>
        )}
      </div>

      {/* Children section */}
      <div className="flex flex-col gap-3 px-4 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="font-mono text-base font-bold text-foreground">
            My Children
          </h2>
          <button
            onClick={() => onNavigate('children')}
            className="flex items-center gap-1 text-sm text-primary"
          >
            <Users className="h-4 w-4" />
            Manage
          </button>
        </div>

        {children.length === 0 ? (
          <button
            onClick={() => onNavigate('children')}
            className="flex flex-col items-center gap-3 rounded-2xl border-2 border-dashed border-border bg-card/50 p-8 transition-colors hover:border-primary/50"
          >
            <div className="rounded-full bg-secondary p-3">
              <Users className="h-6 w-6 text-muted-foreground" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-foreground">
                Add your children
              </p>
              <p className="mt-0.5 text-xs text-muted-foreground">
                Personalize stories with their name, age, and interests
              </p>
            </div>
          </button>
        ) : (
          <div className="flex flex-col gap-2">
            {children.map((child) => (
              <button
                key={child.id}
                onClick={() => onCreateForChild(child.id)}
                className="flex items-center gap-4 rounded-2xl bg-card p-4 text-left transition-colors hover:bg-card/80"
                aria-label={`Create story for ${child.name}`}
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <span className="text-2xl" role="img" aria-hidden="true">
                    {getAvatar(child.avatar)}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-mono text-sm font-bold text-card-foreground">
                    {child.name}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Age {child.age}
                    {child.interests.length > 0 &&
                      ` \u00B7 Loves ${child.interests.slice(0, 2).join(', ')}`}
                  </p>
                </div>
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10">
                  <BookOpen className="h-4 w-4 text-primary" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Features */}
      <div className="flex flex-col gap-3 px-4 pb-8">
        <h2 className="font-mono text-base font-bold text-foreground">
          How it works
        </h2>
        <div className="grid grid-cols-1 gap-2">
          {[
            {
              icon: Users,
              title: 'Add your children',
              desc: 'Name, age, and interests',
            },
            {
              icon: BookOpen,
              title: 'Pick a theme',
              desc: 'Choose or write your own',
            },
            {
              icon: Sparkles,
              title: 'AI writes the story',
              desc: 'Personalized just for them',
            },
          ].map((item) => (
            <div
              key={item.title}
              className="flex items-center gap-3 rounded-xl bg-card p-3"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                <item.icon className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-card-foreground">
                  {item.title}
                </p>
                <p className="text-xs text-muted-foreground">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
