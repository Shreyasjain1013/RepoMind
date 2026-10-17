import { GitBranch } from 'lucide-react'
import { Logo } from '@/components/logo'

const NAV = [
  { label: 'Product', href: '#product' },
  { label: 'Features', href: '#features' },
  { label: 'How it works', href: '#how-it-works' },
  { label: 'Documentation', href: '#workbench' },
]

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper/90 backdrop-blur">
      <div className="mx-auto flex h-[72px] max-w-[1280px] items-center justify-between gap-4 px-5 sm:px-10">
        <a href="#product" aria-label="RepoMind AI home">
          <Logo />
        </a>
        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-8 font-mono text-[15px] text-teal md:flex"
        >
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="transition-colors hover:text-teal-deep">
              {item.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden items-center gap-2 font-mono text-[15px] text-teal transition-colors hover:text-teal-deep sm:flex"
          >
            <GitBranch className="size-4" aria-hidden="true" />
            GitHub
          </a>
          <a
            href="#analyze"
            className="rounded-md bg-teal px-4 py-2.5 font-mono text-[14px] text-white transition-colors hover:bg-teal-deep sm:px-5 sm:text-[15px]"
          >
            Analyze repository
          </a>
        </div>
      </div>
    </header>
  )
}
