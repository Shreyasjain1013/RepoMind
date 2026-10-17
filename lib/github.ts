import { OWNER_PATTERN } from '@/lib/repo-url'

export class GithubError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export type RepoSnapshot = {
  owner: string
  repo: string
  branch: string
  description: string | null
  files: string[]
  truncated: boolean
}

const MAX_FILES = 500
const MAX_FILE_BYTES = 200_000
const MAX_LINES = 400

const IGNORED_DIRS =
  /(^|\/)(node_modules|\.git|dist|build|\.next|vendor|__pycache__|coverage|\.venv|target)\//
const BINARY_FILES =
  /\.(png|jpe?g|gif|webp|ico|svg|pdf|zip|gz|tar|woff2?|ttf|eot|mp4|mp3|mov|lock|map|min\.js|bin|exe|dll|so|class|jar)$/i

const GITHUB_HEADERS = {
  Accept: 'application/vnd.github+json',
  'User-Agent': 'repomind-ai',
}

export function isSafeSegment(value: string) {
  return OWNER_PATTERN.test(value) && value !== '.' && value !== '..'
}

export function isSafePath(path: string) {
  return (
    path.length > 0 &&
    path.length <= 300 &&
    !path.startsWith('/') &&
    !path.split('/').some((part) => part === '..' || part === '')
  )
}

export async function fetchRepoSnapshot(
  owner: string,
  repo: string,
  requestedBranch?: string,
): Promise<RepoSnapshot> {
  if (!isSafeSegment(owner) || !isSafeSegment(repo)) {
    throw new GithubError('That does not look like a valid repository.', 400)
  }

  const metaRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, {
    headers: GITHUB_HEADERS,
    next: { revalidate: 300 },
  })

  if (metaRes.status === 404) {
    throw new GithubError(
      'Repository not found. Make sure it exists and is public.',
      404,
    )
  }
  if (metaRes.status === 403 || metaRes.status === 429) {
    throw new GithubError(
      'GitHub rate limit reached. Please try again in a few minutes.',
      429,
    )
  }
  if (!metaRes.ok) {
    throw new GithubError('Could not reach GitHub. Please try again.', 502)
  }

  const meta = (await metaRes.json()) as {
    default_branch: string
    description: string | null
    private?: boolean
  }
  if (meta.private) {
    throw new GithubError('Only public repositories are supported.', 403)
  }

  const branch = requestedBranch || meta.default_branch
  const treeRes = await fetch(
    `https://api.github.com/repos/${owner}/${repo}/git/trees/${encodeURIComponent(branch)}?recursive=1`,
    { headers: GITHUB_HEADERS, next: { revalidate: 300 } },
  )

  if (treeRes.status === 404) {
    throw new GithubError(`Branch "${branch}" was not found.`, 404)
  }
  if (!treeRes.ok) {
    throw new GithubError('Could not read the repository files.', 502)
  }

  const tree = (await treeRes.json()) as {
    tree: { path: string; type: string }[]
    truncated?: boolean
  }

  const allFiles = tree.tree
    .filter((entry) => entry.type === 'blob')
    .map((entry) => entry.path)
    .filter((path) => !IGNORED_DIRS.test(`${path}`) && !BINARY_FILES.test(path))

  return {
    owner,
    repo,
    branch,
    description: meta.description,
    files: allFiles.slice(0, MAX_FILES),
    truncated: Boolean(tree.truncated) || allFiles.length > MAX_FILES,
  }
}

export async function fetchFileText(
  owner: string,
  repo: string,
  branch: string,
  path: string,
) {
  if (!isSafeSegment(owner) || !isSafeSegment(repo) || !isSafePath(path)) {
    throw new GithubError('Invalid file reference.', 400)
  }
  if (BINARY_FILES.test(path)) {
    throw new GithubError('Binary files cannot be displayed.', 415)
  }

  const encodedPath = path.split('/').map(encodeURIComponent).join('/')
  const res = await fetch(
    `https://raw.githubusercontent.com/${owner}/${repo}/${encodeURIComponent(branch)}/${encodedPath}`,
    { headers: { 'User-Agent': 'repomind-ai' }, next: { revalidate: 300 } },
  )

  if (res.status === 404) throw new GithubError('File not found.', 404)
  if (!res.ok) throw new GithubError('Could not load the file.', 502)

  const text = await res.text()
  if (text.length > MAX_FILE_BYTES) {
    throw new GithubError('This file is too large to display.', 413)
  }

  const lines = text.split('\n')
  const truncated = lines.length > MAX_LINES
  return {
    path,
    content: lines.slice(0, MAX_LINES).join('\n'),
    totalLines: lines.length,
    truncated,
  }
}
