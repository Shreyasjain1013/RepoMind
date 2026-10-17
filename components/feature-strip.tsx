import { Files, MessageSquare, Network, ShieldCheck } from 'lucide-react'

const FEATURES = [
  {
    icon: Files,
    title: 'Explore files & structure',
    body: 'Move through directories and source.',
  },
  {
    icon: Network,
    title: 'Understand dependencies',
    body: 'Trace relationships between modules.',
  },
  {
    icon: MessageSquare,
    title: 'Ask AI assistant',
    body: 'Get concise, cited explanations.',
  },
  {
    icon: ShieldCheck,
    title: 'Find potential issues',
    body: 'Review evidence before acting.',
  },
]

export function FeatureStrip() {
  return (
    <section
      id="features"
      aria-label="Features"
      className="mx-auto max-w-[1280px] scroll-mt-20 px-5 sm:px-10"
    >
      <ul className="grid border-y border-line sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, body }) => (
          <li
            key={title}
            className="flex gap-3 border-b border-line p-5 last:border-b-0 sm:border-r sm:[&:nth-child(2n)]:border-r-0 lg:border-b-0 lg:border-r lg:[&:nth-child(2n)]:border-r lg:last:border-r-0"
          >
            <Icon className="mt-0.5 size-5 shrink-0 text-teal" aria-hidden="true" />
            <div>
              <h2 className="text-[14px] font-medium text-ink">{title}</h2>
              <p className="mt-1.5 text-[13px] text-ink-soft">{body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  )
}
