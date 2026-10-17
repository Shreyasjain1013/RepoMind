import useSWR from 'swr'
import type { RepoSnapshot } from '@/lib/github'

async function fetcher<T>(url: string): Promise<T> {
  const res = await fetch(url)
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.error ?? 'Request failed.')
  return data as T
}

const options = { revalidateOnFocus: false, shouldRetryOnError: false }

export function useRepoSnapshot(repoUrl: string | null) {
  return useSWR<RepoSnapshot>(
    repoUrl ? `/api/repo?url=${encodeURIComponent(repoUrl)}` : null,
    fetcher,
    options,
  )
}

export type FileData = {
  path: string
  content: string
  totalLines: number
  truncated: boolean
}

export function useRepoFile(
  snapshot: RepoSnapshot | undefined,
  path: string | null,
) {
  const key =
    snapshot && path
      ? `/api/repo/file?${new URLSearchParams({
          owner: snapshot.owner,
          repo: snapshot.repo,
          branch: snapshot.branch,
          path,
        }).toString()}`
      : null
  return useSWR<FileData>(key, fetcher, options)
}
