import DOMPurify from 'dompurify'
import { marked } from 'marked'

marked.setOptions({
  breaks: true,
  gfm: true,
})

export const renderAiMarkdown = (content: string) => {
  const html = marked.parse(content ?? '')
  return DOMPurify.sanitize(typeof html === 'string' ? html : '')
}
