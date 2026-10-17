import { NextResponse } from 'next/server'
import { GithubError, fetchFileText } from '@/lib/github'

export async function GET(request: Request) {
  const params = new URL(request.url).searchParams
  const owner = params.get('owner') ?? ''
  const repo = params.get('repo') ?? ''
  const branch = params.get('branch') ?? ''
  const path = params.get('path') ?? ''

  if (!owner || !repo || !branch || !path || branch.length > 200) {
    return NextResponse.json({ error: 'Missing file reference.' }, { status: 400 })
  }

  try {
    const file = await fetchFileText(owner, repo, branch, path)
    return NextResponse.json(file)
  } catch (error) {
    if (error instanceof GithubError) {
      return NextResponse.json({ error: error.message }, { status: error.status })
    }
    return NextResponse.json({ error: 'Could not load the file.' }, { status: 500 })
  }
}
