'use client'

import { useState } from 'react'
import { ArrowRight, Funnel, Minus, Plus } from 'lucide-react'
import { useRepo } from '@/components/repo-provider'
import { GRAPH_EDGES, GRAPH_NODES } from '@/lib/sample'

const NODE_BY_ID = Object.fromEntries(GRAPH_NODES.map((n) => [n.id, n]))

export function DependencyMap() {
  const { openSource } = useRepo()
  const [selected, setSelected] = useState('auth')
  const [zoom, setZoom] = useState(1)
  const [activeOnly, setActiveOnly] = useState(false)
  const node = NODE_BY_ID[selected]

  const activeIds = new Set(GRAPH_EDGES.filter((e) => e.active).flatMap((e) => [e.from, e.to]))

  return (
    <section id="architecture" className="scroll-mt-16 bg-night text-white">
      <div className="mx-auto grid max-w-[1280px] gap-10 px-5 pb-24 pt-8 sm:px-10 lg:grid-cols-[320px_minmax(0,1fr)] lg:gap-14">
        <div className="lg:pt-10">
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-teal-bright">
            Code cartography / 04
          </p>
          <h2 className="mt-5 font-serif text-[44px] leading-[1.15] text-white/85 sm:text-[56px]">
            See how the pieces connect.
          </h2>
          <p className="mt-6 text-[15px] leading-relaxed text-[#9fb4c2]">
            Move beyond the file tree and inspect the relationships that shape a codebase.
          </p>
          <button
            type="button"
            onClick={() => openSource(node.path)}
            className="mt-6 inline-flex items-center gap-2 rounded-md border border-teal-bright/70 px-4 py-2.5 font-mono text-[13px] text-teal-bright transition-colors hover:bg-teal-bright/10"
          >
            Open architecture explorer
            <ArrowRight className="size-3.5" aria-hidden="true" />
          </button>
        </div>

        <div className="relative overflow-hidden border border-night-line bg-night-2">
          <div className="flex items-center justify-between px-4 py-3 font-mono text-[10.5px] tracking-wider text-[#6b8696]">
            <span>MAP / DEPENDENCIES / 04</span>
            <div className="flex items-center gap-2 text-teal-bright">
              <button
                type="button"
                aria-label="Zoom out"
                onClick={() => setZoom((z) => Math.max(0.7, +(z - 0.15).toFixed(2)))}
                className="flex size-7 items-center justify-center rounded-full border border-teal-bright/50 hover:bg-teal-bright/10"
              >
                <Minus className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                aria-label="Zoom in"
                onClick={() => setZoom((z) => Math.min(1.4, +(z + 0.15).toFixed(2)))}
                className="flex size-7 items-center justify-center rounded-full border border-teal-bright/50 hover:bg-teal-bright/10"
              >
                <Plus className="size-3.5" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => setZoom(1)}
                className="rounded border border-teal-bright/50 px-2 py-1.5 hover:bg-teal-bright/10"
              >
                Fit view
              </button>
              <button
                type="button"
                aria-pressed={activeOnly}
                onClick={() => setActiveOnly((v) => !v)}
                className={`flex items-center gap-1.5 rounded border px-2 py-1.5 ${
                  activeOnly ? 'border-teal-bright bg-teal-bright/15' : 'border-teal-bright/50 hover:bg-teal-bright/10'
                }`}
              >
                <Funnel className="size-3" aria-hidden="true" />
                Active trace
              </button>
            </div>
          </div>

          <div className="relative aspect-[4/3] min-h-[360px] overflow-hidden sm:aspect-[16/10]">
            <div
              className="absolute inset-0 origin-center transition-transform duration-300"
              style={{ transform: `scale(${zoom})` }}
            >
              <svg className="absolute inset-0 size-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                {GRAPH_EDGES.map((edge) => {
                  const a = NODE_BY_ID[edge.from]
                  const b = NODE_BY_ID[edge.to]
                  const dim = activeOnly && !edge.active
                  return (
                    <line
                      key={`${edge.from}-${edge.to}`}
                      x1={a.x}
                      y1={a.y}
                      x2={b.x}
                      y2={b.y}
                      vectorEffect="non-scaling-stroke"
                      stroke={edge.active ? '#2dd4bf' : '#2a8f86'}
                      strokeWidth={edge.active ? 1.6 : 1}
                      opacity={dim ? 0.15 : edge.active ? 1 : 0.6}
                    />
                  )
                })}
              </svg>

              {GRAPH_NODES.map((n) => {
                const isSelected = n.id === selected
                const dim = activeOnly && !activeIds.has(n.id)
                return (
                  <button
                    key={n.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelected(n.id)}
                    className={`absolute w-[150px] -translate-x-1/2 -translate-y-1/2 border px-3 py-2 text-left transition-all sm:w-[170px] ${
                      isSelected
                        ? 'border-teal-bright bg-night-3 shadow-[0_0_0_1px_#2dd4bf]'
                        : 'border-night-line bg-night-3 hover:border-teal-bright/60'
                    } ${dim ? 'opacity-30' : ''}`}
                    style={{ left: `${n.x}%`, top: `${n.y}%` }}
                  >
                    <span className="flex items-center gap-2 text-[12px] text-white">
                      <span className="font-mono text-[10px] text-teal-bright">{n.index}</span>
                      {n.label}
                    </span>
                    <span className="mt-0.5 block truncate font-mono text-[9.5px] text-[#6b8696]">{n.path}</span>
                  </button>
                )
              })}
            </div>
          </div>

          <div className="border-t border-teal-bright bg-night-3 p-4 sm:absolute sm:bottom-3 sm:right-3 sm:w-[260px] sm:border">
            <p className="font-mono text-[10px] uppercase tracking-wider text-teal-bright">
              Selected node / {node.id}
            </p>
            <p className="mt-2 text-[17px] text-white">{node.label}</p>
            <p className="mt-2 font-mono text-[11px] text-signal">{node.path}</p>
            <p className="mt-1 text-[12px] leading-relaxed text-[#9fb4c2]">{node.description}</p>
            <button
              type="button"
              onClick={() => openSource(node.path)}
              className="mt-3 rounded border border-teal-bright/60 px-3 py-1.5 font-mono text-[11px] text-teal-bright transition-colors hover:bg-teal-bright/10"
            >
              Open source <ArrowRight className="ml-1 inline size-3" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
