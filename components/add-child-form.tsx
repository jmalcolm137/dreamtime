'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { AVATARS, INTEREST_SUGGESTIONS } from '@/lib/types'
import type { ChildProfile } from '@/lib/types'
import { X, Check, Plus } from 'lucide-react'

interface AddChildFormProps {
  onSave: (child: ChildProfile) => void
  onCancel: () => void
  editChild?: ChildProfile | null
}

export function AddChildForm({ onSave, onCancel, editChild }: AddChildFormProps) {
  const [name, setName] = useState(editChild?.name ?? '')
  const [age, setAge] = useState(editChild?.age?.toString() ?? '')
  const [avatar, setAvatar] = useState(editChild?.avatar ?? AVATARS[0].id)
  const [interests, setInterests] = useState<string[]>(
    editChild?.interests ?? []
  )
  const [customInterest, setCustomInterest] = useState('')

  const toggleInterest = (interest: string) => {
    setInterests((prev) =>
      prev.includes(interest)
        ? prev.filter((i) => i !== interest)
        : [...prev, interest]
    )
  }

  const addCustomInterest = () => {
    const trimmed = customInterest.trim()
    if (trimmed && !interests.includes(trimmed)) {
      setInterests((prev) => [...prev, trimmed])
    }
    setCustomInterest('')
  }

  const removeInterest = (interest: string) => {
    setInterests((prev) => prev.filter((i) => i !== interest))
  }

  const customInterests = interests.filter(
    (i) => !INTEREST_SUGGESTIONS.includes(i)
  )

  const handleSubmit = () => {
    if (!name.trim() || !age) return
    onSave({
      id: editChild?.id ?? (Math.random().toString(36).substring(2) + Date.now().toString(36)),
      name: name.trim(),
      age: parseInt(age),
      avatar,
      interests,
    })
  }

  const isValid = name.trim().length > 0 && age && parseInt(age) >= 1 && parseInt(age) <= 12

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onCancel}
          className="text-muted-foreground text-sm"
          aria-label="Cancel"
        >
          Cancel
        </button>
        <h2 className="font-mono text-lg font-bold text-foreground">
          {editChild ? 'Edit Child' : 'Add Child'}
        </h2>
        <button
          onClick={handleSubmit}
          disabled={!isValid}
          className="text-primary text-sm font-semibold disabled:opacity-40"
          aria-label="Save"
        >
          Save
        </button>
      </div>

      {/* Name */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="child-name" className="text-sm text-muted-foreground">
          Name
        </Label>
        <Input
          id="child-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter child's name"
          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Age */}
      <div className="flex flex-col gap-2">
        <Label htmlFor="child-age" className="text-sm text-muted-foreground">
          Age (1-12)
        </Label>
        <Input
          id="child-age"
          type="number"
          min={1}
          max={12}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          placeholder="Age"
          className="border-border bg-secondary text-foreground placeholder:text-muted-foreground"
        />
      </div>

      {/* Avatar */}
      <div className="flex flex-col gap-2">
        <Label className="text-sm text-muted-foreground">Avatar</Label>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map((a) => (
            <button
              key={a.id}
              onClick={() => setAvatar(a.id)}
              className={`flex flex-col items-center gap-1 rounded-xl p-3 transition-all ${
                avatar === a.id
                  ? 'bg-primary/20 ring-2 ring-primary'
                  : 'bg-secondary'
              }`}
              aria-label={`Select ${a.label} avatar`}
              aria-pressed={avatar === a.id}
            >
              <span className="text-2xl" role="img" aria-hidden="true">
                {a.emoji}
              </span>
              <span className="text-xs text-muted-foreground">{a.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Interests */}
      <div className="flex flex-col gap-3">
        <Label className="text-sm text-muted-foreground">Interests</Label>
        <div className="flex flex-wrap gap-2">
          {INTEREST_SUGGESTIONS.map((interest) => {
            const selected = interests.includes(interest)
            return (
              <button
                key={interest}
                onClick={() => toggleInterest(interest)}
                className={`flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium transition-all ${
                  selected
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-secondary-foreground'
                }`}
                aria-pressed={selected}
              >
                {selected && <Check className="h-3 w-3" />}
                {interest}
              </button>
            )
          })}
        </div>

        {/* Custom interests */}
        {customInterests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {customInterests.map((interest) => (
              <span
                key={interest}
                className="flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium"
              >
                {interest}
                <button
                  onClick={() => removeInterest(interest)}
                  aria-label={`Remove ${interest}`}
                  className="ml-0.5 rounded-full hover:bg-primary-foreground/20"
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            ))}
          </div>
        )}

        {/* Add custom interest input */}
        <div className="flex gap-2">
          <Input
            value={customInterest}
            onChange={(e) => setCustomInterest(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                addCustomInterest()
              }
            }}
            placeholder="Add a custom interest..."
            className="flex-1 border-border bg-secondary text-foreground placeholder:text-muted-foreground"
          />
          <Button
            type="button"
            onClick={addCustomInterest}
            disabled={!customInterest.trim()}
            variant="outline"
            size="icon"
            className="shrink-0 border-border bg-secondary text-foreground"
            aria-label="Add custom interest"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
