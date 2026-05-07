import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

const CODE_LANGUAGE_LABEL_MAP: Record<string, string> = {
  bash: 'Bash',
  css: 'CSS',
  html: 'HTML',
  javascript: 'JavaScript',
  js: 'JavaScript',
  json: 'JSON',
  markdown: 'Markdown',
  md: 'Markdown',
  python: 'Python',
  py: 'Python',
  shell: 'Shell',
  sql: 'SQL',
  text: 'Text',
  typescript: 'TypeScript',
  ts: 'TypeScript',
  vue: 'Vue',
  xml: 'XML',
  yaml: 'YAML',
  yml: 'YAML',
}

const resolveCodeLanguageLabel = (className?: string) => {
  const matched = className?.match(/language-([a-z0-9+#_-]+)/i)?.[1]?.toLowerCase() ?? 'text'
  return CODE_LANGUAGE_LABEL_MAP[matched] ?? matched.toUpperCase()
}

const wrapTables = (html: string) => {
  return html
    .replace(/<table>/g, '<div class="markdown-table-outer"><div class="markdown-table-wrap"><table>')
    .replace(
      /<\/table>/g,
      '</table></div><div class="markdown-table-sticky-scrollbar"><div class="markdown-table-sticky-spacer"></div></div></div>'
    )
}

const wrapCodeBlocks = (html: string) => {
  return html.replace(/<pre><code(?: class="([^"]*)")?>([\s\S]*?)<\/code><\/pre>/g, (_, className = '', codeHtml = '') => {
    const classAttr = className ? ` class="${className}"` : ''
    const languageLabel = resolveCodeLanguageLabel(className)

    return `
<div class="markdown-code-block">
  <div class="markdown-code-header">
    <span class="markdown-code-lang">${languageLabel}</span>
    <button class="markdown-code-copy" type="button">复制代码</button>
  </div>
  <pre><code${classAttr}>${codeHtml}</code></pre>
</div>`.trim()
  })
}

const beautifyMarkdownHtml = (html: string) => {
  return wrapTables(wrapCodeBlocks(html))
}

export const renderAiMarkdown = (content: string) => {
  const html = marked.parse(content ?? '')
  const normalizedHtml = beautifyMarkdownHtml(typeof html === 'string' ? html : '')
  return DOMPurify.sanitize(normalizedHtml)
}
