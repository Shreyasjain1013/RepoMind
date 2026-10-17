'use client'

import { useMemo, useState } from 'react'
import { ChevronDown, ChevronRight, FileText } from 'lucide-react'
import { buildTree, collectDirs, type TreeNode } from '@/lib/tree'

type Props = {
  paths: string[]
  activePath: string | null
  entryPaths?: string[]
  onSelect: (path: string) => void
  initialDepth?: number
}

export function FileExplorer({
  paths,
  activePath,
  entryPaths = [],
  onSelect,
  initialDepth = Infinity,
}: Props) {
  const tree = useMemo(() => buildTree(paths), [paths])
  const [collapsed, setCollapsed] = useState<Set<string>>(() => {
    if (initialDepth === Infinity) return new Set()
    const open = new Set(collectDirs(tree, initialDepth))
    return new Set(collectDirs(tree).filter((dir) => !open.has(dir)))
  })

  function toggle(path: string) {
    setCollapsed((prev) => {
      const next = new Set(prev)
      if (next.has(path)) next.delete(path)
      else next.add(path)
      return next
    })
  }

  function render(nodes: TreeNode[], depth: number) {
    return nodes.map((node) => {
      const indent = { paddingLeft: `${depth * 14 + 8}px` }
      if (node.children) {
        const isCollapsed = collapsed.has(node.path)
        return (
          <li key={node.path}>
            <button
              type="button"
              onClick={() => toggle(node.path)}
              aria-expanded={!isCollapsed}
              style={indent}
              className="flex w-full items-center gap-1.5 py-1.5 pr-2 text-left font-mono text-[12px] text-[#7d93a1] transition-colors hover:text-white"
            >
              {isCollapsed ? (
                <ChevronRight className="size-3 shrink-0" aria-hidden="true" />
              ) : (
                <ChevronDown className="size-3 shrink-0" aria-hidden="true" />
              )}
              <span className="truncate">{node.name}</span>
            </button>
            {!isCollapsed && <ul>{render(node.children, depth + 1)}</ul>}
          </li>
        )
      }
      const active = node.path === activePath
      return (
        <li key={node.path}>
          <button
            type="button"
            onClick={() => onSelect(node.path)}
            aria-current={active ? 'true' : undefined}
            style={indent}
            className={`flex w-full items-center gap-1.5 py-1.5 pr-2 text-left font-mono text-[12px] transition-colors ${
              active
                ? 'bg-[#dff3ef] text-night'
                : 'text-[#7d93a1] hover:text-white'
            }`}
          >
            <FileText className="size-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{node.name}</span>
            {entryPaths.includes(node.path) && (
              <span className="ml-auto text-[10px] text-teal-bright">entry</span>
            )}
          </button>
        </li>
      )
    })
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 py-4 font-mono text-[11px] uppercase tracking-wide text-[#9fb4c2]">
        <span>Explorer</span>
        <span className="text-[#6b8696]">{paths.length} files</span>
      </div>
      <ul className="min-h-0 flex-1 overflow-y-auto pb-3" aria-label="Repository files">
        {render(tree, 0)}
      </ul>
    </div>
  )
}
