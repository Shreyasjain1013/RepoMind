export type ParsedRepo = {
  owner: string
  repo: string
  branch?: string
}

export const OWNER_PATTERN = /^[A-Za-z0-9_.-]{1,100}$/

export function parseRepoUrl(input: string): ParsedRepo | null {
  const value = input.trim().replace(/\.git$/, '').replace(/\/+$/, '')
  if (!value) return null

  const cleaned = value
    .replace(/^https?:\/\//i, '')
    .replace(/^(www\.)?github\.com\//i, '')

  if (/^[^/]+\.[^/]+\//.test(cleaned) && !/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+/.test(value)) {
    return null
  }

  const [owner, repo, kind, ...rest] = cleaned.split('/')
  if (!owner || !repo) return null
  if (!OWNER_PATTERN.test(owner) || !OWNER_PATTERN.test(repo)) return null

  if (/^https?:\/\//i.test(value) && !/github\.com/i.test(value)) return null

  const branch = kind === 'tree' && rest.length > 0 ? rest.join('/') : undefined
  return { owner, repo, branch }
}
