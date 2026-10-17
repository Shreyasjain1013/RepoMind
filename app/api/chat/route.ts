import {
  convertToModelMessages,
  createUIMessageStreamResponse,
  stepCountIs,
  streamText,
  tool,
  toUIMessageStream,
  type UIMessage,
} from 'ai'
import { z } from 'zod'
import { GithubError, fetchFileText } from '@/lib/github'
import { OWNER_PATTERN } from '@/lib/repo-url'
import { SAMPLE_FILES, SAMPLE_REPO } from '@/lib/sample'

export const maxDuration = 60

const bodySchema = z.object({
  messages: z.array(z.unknown()).min(1).max(40),
  repo: z
    .object({
      owner: z.string().regex(OWNER_PATTERN),
      repo: z.string().regex(OWNER_PATTERN),
      branch: z.string().min(1).max(200),
      files: z.array(z.string().max(300)).max(500),
    })
    .nullable(),
  currentFile: z.string().max(300).nullable().optional(),
})

const RULES = `You are RepoMind AI, an assistant that explains source code.
- Answer only from the code you can see. Never invent files, functions or behavior.
- Cite evidence with the format path:startLine-endLine, for example src/services/auth.py:4-11.
- If something is not visible in the available files, say so plainly.
- Keep answers concise and use short paragraphs or short lists.`

function numbered(content: string) {
  return content
    .split('\n')
    .map((line, i) => `${i + 1}: ${line}`)
    .join('\n')
}

export async function POST(request: Request) {
  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) {
    return Response.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { repo, currentFile } = parsed.data
  const messages = parsed.data.messages as UIMessage[]

  let system: string
  let tools = {}

  if (repo) {
    system = `${RULES}

Repository: ${repo.owner}/${repo.repo} (branch ${repo.branch}).
The user is currently viewing: ${currentFile ?? 'no file'}.
Files (${repo.files.length}):
${repo.files.join('\n')}

Use the readFile tool to read files before explaining them. Read only what you need.`

    tools = {
      readFile: tool({
        description: 'Read a text file from the repository by its path.',
        inputSchema: z.object({
          path: z.string().describe('File path exactly as listed in the file list'),
        }),
        execute: async ({ path }) => {
          if (!repo.files.includes(path)) {
            return { error: 'That path is not in the repository file list.' }
          }
          try {
            const file = await fetchFileText(repo.owner, repo.repo, repo.branch, path)
            return { path, content: numbered(file.content), truncated: file.truncated }
          } catch (error) {
            return {
              error:
                error instanceof GithubError ? error.message : 'Could not read file.',
            }
          }
        },
      }),
    }
  } else {
    const files = SAMPLE_FILES.map(
      (file) => `--- ${file.path} ---\n${numbered(file.code)}`,
    ).join('\n\n')
    system = `${RULES}

This is a small sample repository (${SAMPLE_REPO}). The user is currently viewing: ${currentFile ?? 'no file'}.
All indexed files:

${files}`
  }

  const result = streamText({
    model: 'anthropic/claude-sonnet-5.5',
    system,
    messages: await convertToModelMessages(messages),
    tools,
    stopWhen: stepCountIs(6),
    maxOutputTokens: 1200,
  })

  return createUIMessageStreamResponse({
    stream: toUIMessageStream({
      stream: result.stream,
      onError: (error) => {
        console.log('[v0] chat stream error:', error)
        return error instanceof Error ? error.message : 'The assistant could not respond.'
      },
    }),
  })
}
