'use client'

import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { SAMPLE_BY_PATH } from '@/lib/sample'

type Range = [number, number] | null

type RepoContextValue = {
  repoUrl: string | null
  activePath: string | null
  range: Range
  analyze: (url: string) => void
  resetToSample: () => void
  selectFile: (path: string, range?: Range) => void
  openSource: (path: string, start?: number, end?: number) => void
}

const RepoContext = createContext<RepoContextValue | null>(null)

function scrollToWorkbench() {
  requestAnimationFrame(() => {
    document
      .getElementById('workbench')
      ?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
}

export function RepoProvider({ children }: { children: React.ReactNode }) {
  const [repoUrl, setRepoUrl] = useState<string | null>(null)
  const [activePath, setActivePath] = useState<string | null>(null)
  const [range, setRange] = useState<Range>(null)

  const analyze = useCallback((url: string) => {
    setRepoUrl(url)
    setActivePath(null)
    setRange(null)
    scrollToWorkbench()
  }, [])

  const resetToSample = useCallback(() => {
    setRepoUrl(null)
    setActivePath(null)
    setRange(null)
  }, [])

  const selectFile = useCallback((path: string, next: Range = null) => {
    setActivePath(path)
    setRange(next)
  }, [])

  const openSource = useCallback((path: string, start?: number, end?: number) => {
    if (!SAMPLE_BY_PATH[path]) return
    setRepoUrl(null)
    setActivePath(path)
    setRange(start && end ? [start, end] : null)
    scrollToWorkbench()
  }, [])

  const value = useMemo(
    () => ({ repoUrl, activePath, range, analyze, resetToSample, selectFile, openSource }),
    [repoUrl, activePath, range, analyze, resetToSample, selectFile, openSource],
  )

  return <RepoContext.Provider value={value}>{children}</RepoContext.Provider>
}

export function useRepo() {
  const ctx = useContext(RepoContext)
  if (!ctx) throw new Error('useRepo must be used inside RepoProvider')
  return ctx
}
