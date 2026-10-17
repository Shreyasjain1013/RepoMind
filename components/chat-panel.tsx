'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import { useChat } from '@ai-sdk/react'
import { DefaultChatTransport } from 'ai'
import { ArrowUp } from 'lucide-react'

export type ChatRepo = {
  owner: string
  repo: string
  branch: string
  files: string[]
}

type Props = {
  repo: ChatRepo | null
  currentFile: string | null
  validPaths: string[]
  onCite: (path: string, range: [number, number]) => void
}

const SUGGESTIONS = [
  'Where does this request get authenticated?',
  'Summarize what this file does.',
  'What could go wrong here?',
]

const CITATION = /([\w./-]+\.\w+):(\d+)(?:-(\d+))?/g

function Message({
  text,
  validPaths,
  onCite,
}: {
  text: string
  validPaths: Set<string>
  onCite: Props['onCite']
}) {
  const nodes: React.ReactNode[] = []
  let last = 0
  let key = 0
  for (const match of text.matchAll(CITATION)) {
    const [full, path, start, end] = match
    const index = match.index ?? 0
    if (!validPaths.has(path)) continue
    nodes.push(text.slice(last, index))
    const from = Number(start)
    const to = end ? Number(end) : from
    nodes.push(
      <button
        key={key++}
        type="button"
        onClick={() => onCite(path, [from, to])}
        className="mx-0.5 rounded bg-signal/15 px-1 font-mono text-[11.5px] text-[#9db9ff] underline-offset-2 hover:underline"
      >
        {full}
      </button>,
    )
    last = index + full.length
  }
  nodes.push(text.slice(last))
  return <p className="whitespace-pre-wrap">{nodes}</p>
}

export function ChatPanel({ repo, currentFile, validPaths, onCite }: Props) {
  const transport = useMemo(() => new DefaultChatTransport({ api: '/api/chat' }), [])
  const { messages, sendMessage, status, error } = useChat({ transport })
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const valid = useMemo(() => new Set(validPaths), [validPaths])
  const busy = status === 'submitted' || status === 'streaming'

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'nearest' })
  }, [messages, status])

  function submit(text: string) {
    const value = text.trim()
    if (!value || busy) return
    sendMessage({ text: value }, { body: { repo, currentFile } })
    setInput('')
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="min-h-0 flex-1 space-y-4 overflow-y-auto px-4 py-4 text-[13px] leading-relaxed text-[#c8d6df]" aria-live="polite">
        {messages.length === 0 && (
          <div>
            <p className="text-[#9fb4c2]">
              Ask about {repo ? `${repo.owner}/${repo.repo}` : 'the sample repository'}. Answers cite the
              source lines they come from.
            </p>
            <div className="mt-4 flex flex-col gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => submit(s)}
                  className="rounded border border-night-line bg-night-3 px-3 py-2 text-left text-[12.5px] text-[#c8d6df] transition-colors hover:border-teal-bright/60"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div key={message.id} className={message.role === 'user' ? 'text-right' : ''}>
            {message.role === 'user' ? (
              <span className="inline-block rounded bg-night-3 px-3 py-2 text-left text-white">
                {message.parts.map((p) => (p.type === 'text' ? p.text : '')).join('')}
              </span>
            ) : (
              <div className="space-y-2">
                {message.parts.map((part, i) => {
                  if (part.type === 'text') {
                    return <Message key={i} text={part.text} validPaths={valid} onCite={onCite} />
                  }
                  if (part.type === 'tool-readFile') {
                    const input = part.input as { path?: string } | undefined
                    return (
                      <p key={i} className="font-mono text-[11px] text-teal-bright">
                        Reading {input?.path ?? 'file'}
                      </p>
                    )
                  }
                  return null
                })}
              </div>
            )}
          </div>
        ))}

        {status === 'submitted' && <p className="font-mono text-[11px] text-[#6b8696]">Thinking...</p>}
        {error && (
          <p role="alert" className="text-[#f0a3a3]">
            {error.message || 'Something went wrong. Please try again.'}
          </p>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault()
          submit(input)
        }}
        className="flex items-center gap-2 border-t border-night-line p-3"
      >
        <label htmlFor="chat-input" className="sr-only">
          Ask about the code
        </label>
        <input
          id="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask about this code"
          autoComplete="off"
          className="h-9 min-w-0 flex-1 rounded border border-night-line bg-night-3 px-3 text-[13px] text-white outline-none placeholder:text-[#6b8696] focus:border-teal-bright"
        />
        <button
          type="submit"
          disabled={busy || !input.trim()}
          aria-label="Send message"
          className="flex size-9 items-center justify-center rounded bg-teal text-white transition-colors hover:bg-teal-deep disabled:opacity-40"
        >
          <ArrowUp className="size-4" aria-hidden="true" />
        </button>
      </form>
    </div>
  )
}
