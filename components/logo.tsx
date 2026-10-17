export function Logo({ tone = 'dark' }: { tone?: 'dark' | 'light' }) {
  const color = tone === 'dark' ? '#0e1b24' : '#f7f6f1'
  return (
    <span className="flex items-center gap-2.5">
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
        <rect x="1.5" y="1.5" width="25" height="25" rx="3" stroke={color} strokeWidth="1.4" />
        <path d="M6 20 L12 12 L16 16 L22 7" stroke="#0e8a7d" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="6" cy="20" r="1.8" fill={color} />
        <circle cx="12" cy="12" r="1.8" fill={color} />
        <circle cx="22" cy="7" r="1.8" fill="#0e8a7d" />
      </svg>
      <span className="text-[19px] font-medium tracking-tight" style={{ color }}>
        RepoMind <span className="text-teal">AI</span>
      </span>
    </span>
  )
}
