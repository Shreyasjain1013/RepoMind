'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, Copy, FileCode } from 'lucide-react'
import { CodeLine } from '@/components/code-line'

type Props = {
  path: string
  code: string
  range: [number, number] | null
  language: string
  loading?: boolean
  error?: string
  truncatedNote?: string
}

export function CodeViewer({ path, code, range, language, loading, error, truncatedNote }: Props) {
  const scroller = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)
  const lines = code.split('\n')

  useEffect(() => {
    if (!range || !scroller.current) return
    const el = scroller.current.querySelector<HTMLElement>(`[data-line="${range[0]}"]`)
    if (el) scroller.current.scrollTop = Math.max(0, el.offsetTop - 48)
  }, [range, path, code])

  async function copy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="flex h-full min-w-0 flex-col">
      <div className="flex items-center justify-between border-b border-night-line px-4 py-3.5">
        <div className="flex min-w-0 items-center gap-2 font-mono text-[12px] text-teal-bright">
          <FileCode className="size-3.5 shrink-0" aria-hidden="true" />
          <span className="truncate">{path}</span>
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label={copied ? 'Copied' : 'Copy file contents'}
          className="text-[#6b8696] transition-colors hover:text-teal-bright"
        >
          {copied ? <Check className="size-4" aria-hidden="true" /> : <Copy className="size-4" aria-hidden="true" />}
        </button>
      </div>

      <div ref={scroller} className="relative min-h-0 flex-1 overflow-auto py-3 font-mono text-[12.5px]">
        {error ? (
          <p role="alert" className="px-5 text-[#f0a3a3]">{error}</p>
        ) : loading ? (
          <p className="px-5 text-[#6b8696]">Loading file...</p>
        ) : (
          <div className="min-w-max">
            {lines.map((line, i) => {
              const n = i + 1
              const hot = range ? n >= range[0] && n <= range[1] : false
              return (
                <div
                  key={n}
                  data-line={n}
                  className={`flex gap-5 py-[3px] pl-4 pr-6 ${
                    hot ? 'border-l-2 border-teal-bright bg-teal-bright/10 pl-[14px]' : ''
                  }`}
                >
                  <span className="w-6 shrink-0 select-none text-right text-[#4f6877]">{n}</span>
                  <span className="whitespace-pre text-[#d7e3ea]">
                    <CodeLine text={line} />
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <div className="border-t border-night-line px-4 py-2.5 text-right font-mono text-[11px] text-[#6b8696]">
        {language} · UTF-8 · {lines.length} lines{truncatedNote ? ` · ${truncatedNote}` : ''}
      </div>
    </div>
  )
}
