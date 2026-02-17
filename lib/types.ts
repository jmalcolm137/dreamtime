export interface ChildProfile {
  id: string
  name: string
  age: number
  avatar: string
  interests: string[]
}

export type Screen = 'home' | 'children' | 'create' | 'story'

export const AVATARS = [
  { id: 'bear', label: 'Bear', emoji: '🐻' },
  { id: 'bunny', label: 'Bunny', emoji: '🐰' },
  { id: 'fox', label: 'Fox', emoji: '🦊' },
  { id: 'owl', label: 'Owl', emoji: '🦉' },
  { id: 'cat', label: 'Cat', emoji: '🐱' },
  { id: 'dog', label: 'Dog', emoji: '🐶' },
  { id: 'panda', label: 'Panda', emoji: '🐼' },
  { id: 'unicorn', label: 'Unicorn', emoji: '🦄' },
] as const

export const SUGGESTED_THEMES = [
  'A magical forest adventure',
  'Journey to the stars',
  'Under the sea exploration',
  'A castle in the clouds',
  'Dinosaur discovery',
  'Friendly dragons',
  'A secret garden',
  'Space pirates',
] as const

export const INTEREST_SUGGESTIONS = [
  'Dinosaurs',
  'Space',
  'Animals',
  'Princesses',
  'Superheroes',
  'Pirates',
  'Robots',
  'Fairies',
  'Cars',
  'Music',
  'Art',
  'Nature',
  'Science',
  'Cooking',
  'Sports',
  'Magic',
] as const
