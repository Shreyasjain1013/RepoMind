export type TreeNode = {
  name: string
  path: string
  children?: TreeNode[]
}

export function buildTree(paths: string[]): TreeNode[] {
  const root: TreeNode = { name: '', path: '', children: [] }

  for (const path of paths) {
    const parts = path.split('/')
    let node = root
    parts.forEach((part, index) => {
      const currentPath = parts.slice(0, index + 1).join('/')
      const isFile = index === parts.length - 1
      node.children ??= []
      let next = node.children.find((child) => child.name === part)
      if (!next) {
        next = isFile
          ? { name: part, path: currentPath }
          : { name: part, path: currentPath, children: [] }
        node.children.push(next)
      }
      node = next
    })
  }

  const sort = (nodes: TreeNode[]) => {
    nodes.sort((a, b) => {
      const aDir = Boolean(a.children)
      const bDir = Boolean(b.children)
      if (aDir !== bDir) return aDir ? -1 : 1
      return a.name.localeCompare(b.name)
    })
    nodes.forEach((n) => n.children && sort(n.children))
  }
  sort(root.children ?? [])
  return root.children ?? []
}

export function collectDirs(nodes: TreeNode[], maxDepth = Infinity, depth = 0): string[] {
  return nodes.flatMap((node) =>
    node.children && depth < maxDepth
      ? [node.path, ...collectDirs(node.children, maxDepth, depth + 1)]
      : [],
  )
}

export function languageOf(path: string) {
  const ext = path.split('.').pop()?.toLowerCase() ?? ''
  const map: Record<string, string> = {
    py: 'Python',
    ts: 'TypeScript',
    tsx: 'TypeScript',
    js: 'JavaScript',
    jsx: 'JavaScript',
    mjs: 'JavaScript',
    md: 'Markdown',
    json: 'JSON',
    go: 'Go',
    rs: 'Rust',
    java: 'Java',
    rb: 'Ruby',
    css: 'CSS',
    html: 'HTML',
    yml: 'YAML',
    yaml: 'YAML',
    toml: 'TOML',
    sh: 'Shell',
  }
  return map[ext] ?? 'Text'
}
