import { GitBranch } from 'lucide-react'
import { Logo } from '@/components/logo'

const LINKS = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Documentation', href: '#workbench' },
]

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-[1280px] px-5 pb-8 sm:px-10">
      <div className="flex flex-col justify-between gap-6 border-t border-line py-8 md:flex-row md:items-center">
        <Logo />
        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-8 gap-y-3 font-mono text-[14px] text-teal">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="transition-colors hover:text-teal-deep">
              {l.label}
            </a>
          ))}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 transition-colors hover:text-teal-deep"
          >
            <GitBranch className="size-3.5" aria-hidden="true" />
            Project repository
          </a>
        </nav>
      </div>
      <div className="flex flex-col justify-between gap-2 font-mono text-[11px] text-ink-soft sm:flex-row">
        <p>© 2026 RepoMind AI. All rights reserved.</p>
        <p>Source-linked exploration · Demonstration content uses sample data.</p>
      </div>
    </footer>
  )
}
