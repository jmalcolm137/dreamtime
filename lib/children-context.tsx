'use client'

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from 'react'
import type { ChildProfile } from './types'

interface ChildrenContextType {
  children: ChildProfile[]
  addChild: (child: ChildProfile) => void
  removeChild: (id: string) => void
  updateChild: (child: ChildProfile) => void
}

const ChildrenContext = createContext<ChildrenContextType | undefined>(undefined)

export function ChildrenProvider({ children: kids }: { children: ReactNode }) {
  const [children, setChildren] = useState<ChildProfile[]>([])

  const addChild = useCallback((child: ChildProfile) => {
    setChildren((prev) => [...prev, child])
  }, [])

  const removeChild = useCallback((id: string) => {
    setChildren((prev) => prev.filter((c) => c.id !== id))
  }, [])

  const updateChild = useCallback((child: ChildProfile) => {
    setChildren((prev) => prev.map((c) => (c.id === child.id ? child : c)))
  }, [])

  return (
    <ChildrenContext.Provider
      value={{ children, addChild, removeChild, updateChild }}
    >
      {kids}
    </ChildrenContext.Provider>
  )
}

export function useChildren() {
  const context = useContext(ChildrenContext)
  if (!context)
    throw new Error('useChildren must be used within a ChildrenProvider')
  return context
}
