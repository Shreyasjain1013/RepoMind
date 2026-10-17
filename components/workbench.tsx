'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowRight, GitBranch, RotateCcw } from 'lucide-react'
import { ChatPanel } from '@/components/chat-panel'
import { CodeViewer } from '@/components/code-viewer'
import { FileExplorer } from '@/components/file-explorer'
import { useRepo } from '@/components/repo-provider'
import { SAMPLE_BY_PATH, SAMPLE_FILES, SAMPLE_REPO } from '@/lib/sample'
import { languageOf } from '@/lib/tree'
import { useRepoFile, useRepoSnapshot } from '@/lib/use-repo-data'

const SAMPLE_PATHS = SAMPLE_FILES.map((f) => f.path)
const SAMPLE_ENTRIES = SAMPLE_FILES.filter((f) => f.entry).map((f) => f.path)

type Tab = 'evidence' | 'ask'

export function Workbench() {
  const { repoUrl, activePath, range, selectFile, resetToSample } = useRepo()
  const { data: snapshot, error: repoError, isLoading } = useRepoSnapshot(repoUrl)
  const [tab, setTab] = useState<Tab>('evidence')

  const isSample = !repoUrl
  const paths = isSample ? SAMPLE_PATHS : (snapshot?.files ?? [])

  const defaultPath = useMemo(() => {
    if (isSample) return 'src/services/auth.py'
    return (
      paths.find((p) => /^readme(\.md)?$/i.test(p)) ?? paths[0] ?? null
    )
  }, [isSample, paths])

  const currentPath = activePath && paths.includes(activePath) ? activePath : defaultPath

  const sampleFile = isSample && currentPath ? SAMPLE_BY_PATH[currentPath] : undefined
  const fileQuery = useRepoFile(isSample ? undefined : snapshot, isSample ? null : currentPath)

  useEffect(() => {
    setTab(repoUrl ? 'ask' : 'evidence')
  }, [repoUrl])

  const effectiveRange: [number, number] | null =
    range ?? (sampleFile?.highlight as [number, number] | undefined) ?? null

  const code = sampleFile?.code ?? fileQuery.data?.content ?? ''
  const truncatedNote = fileQuery.data?.truncated
    ? `showing first ${fileQuery.data.content.split('\n').length} of ${fileQuery.data.totalLines}`
    : undefined

  const chatRepo = snapshot
    ? { owner: snapshot.owner, repo: snapshot.repo, branch: snapshot.branch, files: snapshot.files }
    : null
  const repoLabel = isSample ? SAMPLE_REPO : snapshot ? `${snapshot.owner}/${snapshot.repo}` : 'Loading repository'
  const chatKey = isSample ? 'sample' : `${snapshot?.owner}/${snapshot?.repo}@${snapshot?.branch}`

  return (
    <section id="workbench" className="scroll-mt-16 bg-night text-white">
      <div className="mx-auto max-w-[1280px] px-5 pb-24 pt-20 sm:px-10">
        <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-teal-bright">
          The workbench / 03
        </p>
        <h2 className="mt-5 max-w-[620px] font-serif text-[44px] leading-[1.15] text-white/85 sm:text-[56px]">
          The code stays at the center.
        </h2>
        <p className="mt-3 text-[15px] text-[#9fb4c2]">
          Explore files, inspect source, and verify an explanation without losing your place.
        </p>

        <div className="mt-8 overflow-hidden border border-night-line bg-night-2">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-night-line px-4 py-3">
            <div className="flex items-center gap-3 font-mono text-[12px] text-[#c8d6df]">
              <GitBranch className="size-3.5" aria-hidden="true" />
              <span>{repoLabel}</span>
              <span className="rounded-full bg-[#dff3ef] px-2.5 py-1 text-[11px] text-night">
                {isSample ? 'Sample repository' : (snapshot?.branch ?? '...')}
              </span>
            </div>
            {!isSample && (
              <button
                type="button"
                onClick={resetToSample}
                className="flex items-center gap-1.5 font-mono text-[11px] text-teal-bright transition-colors hover:text-white"
              >
                <RotateCcw className="size-3" aria-hidden="true" />
                Back to sample
              </button>
            )}
          </div>

          {repoError ? (
            <div role="alert" className="flex min-h-[320px] flex-col items-start justify-center gap-4 px-6 py-10">
              <p className="max-w-[480px] text-[15px] text-[#f0a3a3]">{repoError.message}</p>
              <button
                type="button"
                onClick={resetToSample}
                className="rounded-md border border-teal px-4 py-2 font-mono text-[13px] text-teal-bright hover:bg-teal/10"
              >
                Return to sample repository
              </button>
            </div>
          ) : isLoading ? (
            <div className="flex min-h-[320px] items-center px-6 font-mono text-[13px] text-[#6b8696]">
              Reading repository structure...
            </div>
          ) : (
            <div className="grid min-h-[480px] lg:h-[540px] lg:grid-cols-[200px_minmax(0,1fr)_300px]">
              <div className="max-h-64 overflow-hidden border-b border-night-line lg:max-h-none lg:border-b-0 lg:border-r">
                <FileExplorer
                  key={chatKey}
                  paths={paths}
                  activePath={currentPath}
                  entryPaths={isSample ? SAMPLE_ENTRIES : []}
                  initialDepth={isSample ? Infinity : 0}
                  onSelect={(path) => selectFile(path)}
                />
              </div>

              <div className="min-h-[320px] min-w-0 border-b border-night-line lg:border-b-0 lg:border-r">
                {currentPath ? (
                  <CodeViewer
                    path={currentPath}
                    code={code}
                    range={effectiveRange}
                    language={languageOf(currentPath)}
                    loading={!isSample && fileQuery.isLoading}
                    error={fileQuery.error?.message}
                    truncatedNote={truncatedNote}
                  />
                ) : (
                  <p className="p-6 text-[#6b8696]">This repository has no readable files.</p>
                )}
              </div>

              <div className="flex min-h-[360px] min-w-0 flex-col lg:min-h-0">
                <div role="tablist" aria-label="Assistant panel" className="flex border-b border-night-line font-mono text-[11px] uppercase tracking-wide">
                  {(['evidence', 'ask'] as Tab[]).map((id) => (
                    <button
                      key={id}
                      role="tab"
                      type="button"
                      aria-selected={tab === id}
                      onClick={() => setTab(id)}
                      className={`flex-1 px-4 py-4 transition-colors ${
                        tab === id ? 'text-teal-bright shadow-[inset_0_-2px_0_#2dd4bf]' : 'text-[#6b8696] hover:text-white'
                      }`}
                    >
                      {id === 'evidence' ? 'Evidence note' : 'Ask AI'}
                    </button>
                  ))}
                </div>

                <div role="tabpanel" className="min-h-0 flex-1">
                  {tab === 'evidence' ? (
                    <EvidenceNote path={currentPath} onOpen={(p, r) => selectFile(p, r)} />
                  ) : (
                    <ChatPanel
                      key={chatKey}
                      repo={isSample ? null : chatRepo}
                      currentFile={currentPath}
                      validPaths={paths}
                      onCite={(path, r) => selectFile(path, r)}
                    />
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

function EvidenceNote({
  path,
  onOpen,
}: {
  path: string | null
  onOpen: (path: string, range: [number, number]) => void
}) {
  const file = path ? SAMPLE_BY_PATH[path] : undefined
  if (!file) {
    return (
      <p className="p-4 text-[13px] leading-relaxed text-[#9fb4c2]">
        Evidence notes are written for the sample repository. For your own repository, switch to Ask AI to get answers
        cited to source lines.
      </p>
    )
  }
  const { ref } = file.note
  return (
    <div className="p-4">
      <p className="text-[13px] leading-relaxed text-[#c8d6df]">{file.note.text}</p>
      <button
        type="button"
        onClick={() => onOpen(file.path, [ref.start, ref.end])}
        className="mt-4 flex w-full items-center justify-between border-t border-night-line pt-3 font-mono text-[13px] text-signal transition-colors hover:text-teal-bright"
      >
        <span>
          {ref.label} · {ref.start}-{ref.end}
        </span>
        <ArrowRight className="size-3.5" aria-hidden="true" />
      </button>
      <p className="mt-4 text-[12px] leading-relaxed text-[#6b8696]">{file.note.caveat}</p>
    </div>
  )
}
