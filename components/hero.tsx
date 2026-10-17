import { ArrowRight } from 'lucide-react'
import { RepoForm } from '@/components/repo-form'
import { TracePanel } from '@/components/trace-panel'

export function Hero() {
  return (
    <section
      id="product"
      className="mx-auto grid max-w-[1280px] scroll-mt-20 gap-12 px-5 pb-10 pt-12 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:items-center lg:gap-10"
    >
      <div>
        <p className="mb-3 font-mono text-[12px] uppercase tracking-[0.12em] text-teal">
          Codebase intelligence / 01
        </p>
        <h1 className="font-serif text-[64px] leading-[0.92] tracking-tight text-ink sm:text-[84px]">
          Understand any codebase.{' '}
          <em className="text-teal-deep">Trace every connection.</em>
        </h1>
        <p className="mt-9 max-w-[500px] text-[18px] leading-relaxed text-ink-soft">
          Explore unfamiliar repositories, trace dependencies, and ask questions about
          source code—with answers connected to the actual code.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="#analyze"
            className="flex items-center gap-3 rounded-md bg-teal px-5 py-3 font-mono text-[15px] text-white transition-colors hover:bg-teal-deep"
          >
            Analyze a repository
            <ArrowRight className="size-4" aria-hidden="true" />
          </a>
          <a
            href="#workbench"
            className="rounded-md border border-teal px-5 py-3 font-mono text-[15px] text-teal transition-colors hover:bg-accent"
          >
            Watch demo
          </a>
        </div>
        <div className="mt-6 max-w-[513px]">
          <RepoForm />
        </div>
      </div>
      <TracePanel />
    </section>
  )
}
