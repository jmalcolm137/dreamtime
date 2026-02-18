'use client'

import { useEffect, useRef } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { AVATARS } from '@/lib/types'
import type { ChildProfile } from '@/lib/types'
import { ChevronLeft, Moon } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface StoryViewerProps {
  storyChildren: ChildProfile[]
  theme: string
  onBack: () => void
}

const transport = new DefaultChatTransport({ api: '/api/story' })

function getUIMessageText(
  msg: { parts?: Array<{ type: string; text?: string }> }
): string {
  if (!msg.parts || !Array.isArray(msg.parts)) return ''
  return msg.parts
    .filter(
      (p): p is { type: 'text'; text: string } => p.type === 'text'
    )
    .map((p) => p.text)
    .join('')
}

export function StoryViewer({ storyChildren, theme, onBack }: StoryViewerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const hasSent = useRef(false)
  const chatId = useRef(`story-${storyChildren.map((c) => c.id).join('-')}-${Date.now()}`)
  const avatars = storyChildren.map(
    (c) => AVATARS.find((a) => a.id === c.avatar)?.emoji ?? '🐻'
  )

  const { messages, status, sendMessage, error } = useChat({
    transport,
    id: chatId.current,
  })

  useEffect(() => {
    if (hasSent.current) return
    hasSent.current = true

    const payload = JSON.stringify({
      children: storyChildren.map((c) => ({
        name: c.name,
        age: c.age,
        interests: c.interests,
      })),
      theme,
    })

    sendMessage({ text: payload })
  }, [storyChildren, theme, sendMessage])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const assistantMessage = messages.find((m) => m.role === 'assistant')
  const storyText = assistantMessage ? getUIMessageText(assistantMessage) : ''
  const isStreaming = status === 'streaming' || status === 'submitted'



  return (
    <div className="flex h-full min-h-0 flex-1 flex-col">
      {/* Header - fixed height */}
      <div className="shrink-0 flex items-center gap-3 px-4 pb-2 pt-4">
        <button
          onClick={onBack}
          className="flex items-center gap-1 text-primary"
          aria-label="Go back"
        >
          <ChevronLeft className="h-5 w-5" />
          <span className="text-sm">Done</span>
        </button>
        <h1 className="flex-1 text-center font-mono text-xl font-bold text-foreground">
          {"Tonight's Story"}
        </h1>
        <div className="w-12" />
      </div>

      {/* Scrollable story area */}
      <div
        ref={scrollRef}
        className="min-h-0 flex-1 overflow-y-auto px-4 pb-4"
      >
        {/* Story card header */}
        <div className="flex items-center gap-3 rounded-t-2xl bg-card px-4 pb-3 pt-4">
          <div className="flex items-center -space-x-2">
            {avatars.map((emoji, i) => (
              <div
                key={storyChildren[i].id}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary ring-2 ring-card"
              >
                <span className="text-xl" role="img" aria-hidden="true">
                  {emoji}
                </span>
              </div>
            ))}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate font-mono text-sm font-bold text-card-foreground">
              A story for {storyChildren.map((c) => c.name).join(' & ')}
            </p>
            <p className="text-xs text-muted-foreground">{theme}</p>
          </div>
        </div>

        {/* Story content */}
        <div className="rounded-b-2xl bg-card px-4 pb-6">
          {status === 'error' && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <p className="text-sm font-medium text-destructive">
                Something went wrong
              </p>
              <p className="text-xs text-muted-foreground">
                {error?.message || 'Could not generate story. Make sure OPENAI_API_KEY is set in your .env.local file and restart the dev server.'}
              </p>
              <Button
                onClick={onBack}
                variant="outline"
                className="mt-2 border-border text-foreground"
              >
                Go Back
              </Button>
            </div>
          )}
          {!storyText && isStreaming && (
            <div className="flex flex-col items-center gap-3 py-12 text-center">
              <Moon className="h-8 w-8 animate-pulse text-primary" />
              <p className="text-sm text-muted-foreground">
                Weaving a magical story...
              </p>
            </div>
          )}
          {storyText && (
            <div className="prose prose-sm max-w-none">
              {storyText.split('\n').map((paragraph, i) =>
                paragraph.trim() ? (
                  <p
                    key={i}
                    className="mb-3 leading-relaxed text-card-foreground"
                  >
                    {paragraph}
                  </p>
                ) : null
              )}
              {isStreaming && (
                <span className="inline-block h-4 w-1 animate-pulse bg-primary" />
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer - fixed height */}
      {!isStreaming && storyText && (
        <div className="shrink-0 px-4 pb-4 pt-3">
          <Button
            onClick={onBack}
            className="w-full gap-2 bg-primary py-6 text-base font-bold text-primary-foreground"
          >
            <Moon className="h-5 w-5" />
            Sweet Dreams
          </Button>
        </div>
      )}
    </div>
  )
}
