import { Braces, GitBranch, MessageSquare } from 'lucide-react'

const STEPS = [
  {
    n: '01',
    icon: GitBranch,
    title: 'Connect',
    body: 'Submit a public GitHub repository and select a branch.',
  },
  {
    n: '02',
    icon: Braces,
    title: 'Analyze',
    body: 'Inspect files, identify source structures, and map relationships.',
  },
  {
    n: '03',
    icon: MessageSquare,
    title: 'Explore',
    body: 'Ask questions, inspect source references, and investigate architecture.',
  },
]

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto max-w-[1280px] scroll-mt-16 px-5 py-24 sm:px-10">
      <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
        <div>
          <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-teal">
            How RepoMind works / 05
          </p>
          <h2 className="mt-3 max-w-[480px] font-serif text-[48px] leading-[1] text-ink sm:text-[60px]">
            From repository to understanding.
          </h2>
        </div>
        <p className="max-w-[260px] text-[14px] leading-relaxed text-ink-soft">
          A direct path from a public repository to evidence-linked exploration.
        </p>
      </div>

      <ol className="relative mt-12 grid gap-10 md:grid-cols-3">
        <div className="absolute left-[8%] right-[8%] top-[78px] hidden border-t border-line md:block" aria-hidden="true" />
        {STEPS.map(({ n, icon: Icon, title, body }) => (
          <li key={n} className="relative">
            <p className="font-mono text-[11px] text-teal">{n}</p>
            <div className="relative mt-3 flex size-14 items-center justify-center rounded-full border border-line bg-paper">
              <Icon className="size-5 text-teal" aria-hidden="true" />
            </div>
            <h3 className="mt-5 text-[18px] font-medium text-ink">{title}</h3>
            <p className="mt-2 max-w-[280px] text-[14px] leading-relaxed text-ink-soft">{body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}
