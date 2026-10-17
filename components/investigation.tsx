'use client'

import { ArrowRight } from 'lucide-react'
import { useRepo } from '@/components/repo-provider'

const TRAIL = [
  { label: 'routes.py', path: 'src/api/routes.py', start: 6, end: 10 },
  { label: 'auth.py', path: 'src/services/auth.py', start: 4, end: 11 },
]

export function Investigation() {
  const { openSource } = useRepo()

  return (
    <section className="mx-auto max-w-[1280px] px-5 py-24 sm:px-10">
      <div className="mx-auto max-w-[1100px]">
        <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-teal">
          Question / Evidence / Source
        </p>
        <h2 className="mt-6 font-serif text-[44px] leading-[1.15] text-ink/90 sm:text-[56px]">
          Start with a question. <em className="text-teal-deep">Follow the evidence.</em>
        </h2>

        <div className="mt-10 border border-line bg-white p-6 sm:p-8">
          <div className="max-w-[360px]">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-teal">
              Investigation / 01
            </p>
            <blockquote className="mt-4 font-serif text-[22px] leading-snug text-ink-soft">
              &ldquo;Where does this request get authenticated?&rdquo;
            </blockquote>
            <p className="mt-4 text-[14px] leading-relaxed text-ink-soft">
              Begin with a route and follow the call into the service that checks
              credentials.
            </p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.12em] text-signal">
              Source trail
            </p>
            <ul className="mt-3 border-t border-line">
              {TRAIL.map((item) => (
                <li key={item.path} className="border-b border-line">
                  <button
                    type="button"
                    onClick={() => openSource(item.path, item.start, item.end)}
                    className="flex w-full items-center justify-between py-3 text-left font-mono text-[14px] text-signal transition-colors hover:text-teal-deep"
                  >
                    <span>
                      {item.label} · lines {item.start}-{item.end}
                    </span>
                    <ArrowRight className="size-3.5" aria-hidden="true" />
                  </button>
                </li>
              ))}
            </ul>
            <button
              type="button"
              onClick={() => openSource('src/services/auth.py', 4, 11)}
              className="mt-6 flex items-center gap-2 font-mono text-[14px] text-teal transition-colors hover:text-teal-deep"
            >
              Continue in workspace
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
