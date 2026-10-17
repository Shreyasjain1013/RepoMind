import { NextResponse } from 'next/server'
import { GithubError, fetchRepoSnapshot } from '@/lib/github'
import { parseRepoUrl } from '@/lib/repo-url'

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get('url') ?? ''
  const parsed = parseRepoUrl(url)

  if (!parsed) {
    return NextResponse.json(
      { error: 'Enter a public GitHub URL such as https://github.com/owner/repository.' },
      { status: 400 },
    )
  }

  try {
    const snapshot = await fetchRepoSnapshot(
      parsed.owner,
      parsed.repo,
      parsed.branch,
    )
    return NextResponse.json(snapshot)
  } catch (error) {
    if (error instanceof GithubError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json(
      { error: 'Something went wrong while analyzing the repository.' },
      { status: 500 },
    )
  }
}
