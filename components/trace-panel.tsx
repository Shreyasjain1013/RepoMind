'use client'

import { useEffect, useRef, useState } from 'react'
import { Check, FileCode, RotateCcw } from 'lucide-react'
import { CodeLine } from '@/components/code-line'

const ROUTE_LINES: [string, string, boolean?][] = [
  ['06', "@router.post('/login')"],
  ['07', 'async def login(credentials):', true],
  ['08', '    user = await authenticate_user(', true],
  ['09', '        credentials.email, credentials.password'],
  ['10', '    )'],
]

const AUTH_LINES: [string, string][] = [
  ['04', 'async def authenticate_user(email, password):'],
  ['05', '    user = await User.find_by_email(email)'],
]

function Node({
  label,
  index,
  className,
  strong,
  delay,
}: {
  label: string
  index?: string
  className: string
  strong?: boolean
  delay: string
}) {
  return (
    <div
      className={`trace-fade absolute flex items-center gap-3 whitespace-nowrap border px-2.5 py-2 font-mono text-[11px] ${
        strong
          ? 'border-teal-bright bg-night-2 font-semibold text-white'
          : 'border-night-line bg-night-3 text-[#c8d6df]'
      } ${className}`}
      style={{ '--d': delay } as React.CSSProperties}
    >
      {label}
      {index && <span className="text-[10px] font-normal text-teal-bright">{index}</span>}
    </div>
  )
}

const BASE_WIDTH = 709
const BASE_HEIGHT = 542
const MIN_SCALE = 0.7

export function TracePanel() {
  const [run, setRun] = useState(0)
  const [scale, setScale] = useState(1)
  const frame = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = frame.current
    if (!el) return
    const update = () => setScale(Math.max(MIN_SCALE, Math.min(1, el.clientWidth / BASE_WIDTH)))
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      role="img"
      aria-label="Interactive source dependency trace from an API route to authentication and the user model"
      className="relative overflow-hidden rounded-2xl border border-night-line bg-night"
    >
      <div ref={frame} className="overflow-x-auto">
        <div style={{ width: BASE_WIDTH * scale, height: BASE_HEIGHT * scale }}>
        <div
          key={run}
          className="relative origin-top-left"
          style={{
            width: BASE_WIDTH,
            height: BASE_HEIGHT,
            transform: `scale(${scale})`,
            backgroundImage:
              'linear-gradient(to right, rgba(45,212,191,0.045) 1px, transparent 1px), linear-gradient(to bottom, rgba(45,212,191,0.045) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        >
          <div className="absolute right-6 top-7 font-mono text-[10.5px] tracking-wider text-[#6b8696]">
            FIELD MAP 01:48 / AUTH FLOW
          </div>

          <svg
            className="absolute inset-0 size-full"
            viewBox="0 0 709 542"
            fill="none"
            aria-hidden="true"
          >
            <path d="M510 45 C560 55 575 80 582 105" stroke="#2a4350" strokeWidth="1" />
            <path d="M398 462 C420 400 480 330 510 292" stroke="#2a4350" strokeWidth="1" />
            <path
              className="trace-path"
              pathLength={1}
              style={{ '--d': '0.3s' } as React.CSSProperties}
              d="M411 205 C480 200 505 165 526 138"
              stroke="#2dd4bf"
              strokeWidth="1.6"
            />
            <path
              className="trace-path"
              pathLength={1}
              style={{ '--d': '0.9s' } as React.CSSProperties}
              d="M583 145 C615 190 600 225 562 250"
              stroke="#2dd4bf"
              strokeWidth="1.6"
            />
            <path
              className="trace-path"
              pathLength={1}
              style={{ '--d': '1.5s' } as React.CSSProperties}
              d="M553 292 C518 330 508 370 518 400"
              stroke="#2dd4bf"
              strokeWidth="1.6"
            />
            <path d="M565 410 L604 410" stroke="#2a4350" strokeWidth="1" />
          </svg>

          <div className="trace-fade absolute left-[4%] top-[12.5%] w-[54%] border border-teal-bright bg-night-2 p-3 font-mono text-[11px]" style={{ '--d': '0.1s' } as React.CSSProperties}>
            <div className="mb-2 flex items-center gap-2 text-teal-bright">
              <FileCode className="size-3" aria-hidden="true" />
              src/api/routes.py
            </div>
            {ROUTE_LINES.map(([n, code, hot]) => (
              <div
                key={n}
                className={`flex gap-3 py-[3px] pl-1 ${hot ? 'border-l-2 border-teal-bright bg-teal-bright/10' : ''}`}
              >
                <span className="w-4 text-[#6b8696]">{n}</span>
                <span className="whitespace-pre text-[#d7e3ea]">
                  <CodeLine text={code} />
                </span>
              </div>
            ))}
          </div>

          <div className="trace-fade absolute left-[4%] top-[69%] w-[52%] border border-teal-bright bg-night-2 p-3 font-mono text-[11px]" style={{ '--d': '0.7s' } as React.CSSProperties}>
            <div className="mb-2 flex items-center gap-2 text-teal-bright">
              <FileCode className="size-3" aria-hidden="true" />
              src/services/auth.py
            </div>
            {AUTH_LINES.map(([n, code]) => (
              <div key={n} className="flex gap-3 border-l-2 border-teal-bright bg-teal-bright/10 py-[3px] pl-1">
                <span className="w-4 text-[#6b8696]">{n}</span>
                <span className="whitespace-pre text-[#d7e3ea]">
                  <CodeLine text={code} />
                </span>
              </div>
            ))}
          </div>

          <Node label="Configuration" className="left-[58%] top-[8%]" delay="0.2s" />
          <Node label="API Routes" index="01" strong className="left-[75%] top-[19%]" delay="0.5s" />
          <Node label="Authentication" index="02" strong className="left-[70%] top-[46%]" delay="1.1s" />
          <Node label="User Model" index="03" strong className="left-[68%] top-[74%]" delay="1.7s" />
          <Node label="Database" className="left-[85%] top-[75%]" delay="1.8s" />
          <Node label="Tests" className="left-[48%] top-[85%]" delay="1.2s" />

          <div
            className="trace-fade absolute left-[58%] top-[88%] border-l-2 border-teal-bright bg-night-3 px-2.5 py-2 font-mono text-[9.5px]"
            style={{ '--d': '2s' } as React.CSSProperties}
          >
            <div className="tracking-wide text-teal-bright">RESOLVED SOURCE</div>
            <div className="mt-1 text-signal">models.py · line 4</div>
          </div>

          <div className="absolute bottom-3.5 left-6 flex gap-5 font-mono text-[10px] text-[#6b8696]">
            <span className="flex items-center gap-2">
              <span className="h-px w-3 bg-teal-bright" aria-hidden="true" /> selected path
            </span>
            <span className="flex items-center gap-2">
              <span className="h-px w-3 bg-signal" aria-hidden="true" /> source reference
            </span>
          </div>
          <div className="absolute bottom-3.5 right-5 flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-teal-bright">
            <Check className="size-3" aria-hidden="true" /> TRACE COMPLETE
          </div>
        </div>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setRun((n) => n + 1)}
        aria-label="Replay dependency trace"
        className="absolute left-4 top-3.5 flex items-center gap-1.5 rounded border border-night-line bg-night-2 px-2 py-1 font-mono text-[10.5px] text-[#9fb4c2] transition-colors hover:text-teal-bright"
      >
        <RotateCcw className="size-3" aria-hidden="true" />
        Replay
      </button>
    </div>
  )
}
