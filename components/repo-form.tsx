'use client'

import { useState } from 'react'
import { ArrowRight, GitBranch } from 'lucide-react'
import { useRepo } from '@/components/repo-provider'
import { parseRepoUrl } from '@/lib/repo-url'

export function RepoForm() {
  const { analyze } = useRepo()
  const [value, setValue] = useState('')
  const [error, setError] = useState<string | null>(null)

  function onSubmit(event: React.FormEvent) {
    event.preventDefault()
    const parsed = parseRepoUrl(value)
    if (!parsed) {
      setError('Enter a public GitHub URL such as https://github.com/owner/repository.')
      return
    }
    setError(null)
    analyze(value.trim())
  }

  return (
    <form
      id="analyze"
      onSubmit={onSubmit}
      className="scroll-mt-24 border border-line bg-white p-3.5"
      noValidate
    >
      <label
        htmlFor="repo-url"
        className="mb-2 block text-[15px] font-medium uppercase tracking-tight text-ink"
      >
        Public GitHub repository
      </label>
      <div className="flex items-center gap-3">
        <div className="flex h-11 min-w-0 flex-1 items-center gap-3 rounded-md bg-[#f0ede6] px-3">
          <GitBranch className="size-4 shrink-0 text-ink-soft" aria-hidden="true" />
          <input
            id="repo-url"
            type="text"
            inputMode="url"
            autoComplete="off"
            spellCheck={false}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="https://github.com/owner/repository"
            aria-invalid={error ? true : undefined}
            aria-describedby="repo-help"
            className="min-w-0 flex-1 bg-transparent font-mono text-[15px] text-ink outline-none placeholder:text-ink-soft/80"
          />
        </div>
        <button
          type="submit"
          aria-label="Submit repository"
          className="flex size-11 shrink-0 items-center justify-center rounded-full bg-teal text-white transition-colors hover:bg-teal-deep"
        >
          <ArrowRight className="size-5" aria-hidden="true" />
        </button>
      </div>
      <p
        id="repo-help"
        role={error ? 'alert' : undefined}
        className={`mt-2.5 px-1 font-mono text-[12px] ${error ? 'text-red-700' : 'text-ink-soft'}`}
      >
        {error ?? 'Use a public GitHub repository.'}
      </p>
    </form>
  )
}
