const KEYWORDS = new Set([
  'from', 'import', 'async', 'await', 'def', 'class', 'return', 'if', 'else', 'elif',
  'not', 'raise', 'with', 'as', 'for', 'in', 'try', 'except', 'const', 'let', 'var',
  'function', 'export', 'default', 'new', 'throw', 'true', 'false', 'None', 'True', 'False',
  'type', 'interface', 'func', 'package', 'fn', 'pub', 'use', 'struct',
])

const TOKEN = /(#.*$|\/\/.*$)|("[^"]*"|'[^']*')|(\b\w+\b)|([\s\S])/g

export function CodeLine({ text }: { text: string }) {
  const nodes: React.ReactNode[] = []
  let key = 0
  for (const match of text.matchAll(TOKEN)) {
    const [token, comment, string, word] = match
    if (comment) {
      nodes.push(<span key={key++} className="text-[#6b8696]">{token}</span>)
    } else if (string) {
      nodes.push(<span key={key++} className="text-[#6ee7d3]">{token}</span>)
    } else if (word && KEYWORDS.has(word)) {
      nodes.push(<span key={key++} className="text-[#8fb4ff]">{token}</span>)
    } else {
      nodes.push(token)
    }
  }
  return <>{nodes}</>
}
