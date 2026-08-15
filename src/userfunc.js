import { library, File, Folder, persistLibrary, editorSession } from '@/userdata'
import { router } from '@/router'

export function newEssay(parent = library) {
  const file = createEssay('', parent)
  router.push({ name: 'Editor', params: { id: file.id } })
}

export function createEssay(title, parent = library) {
  const file = new File(title)
  parent.appendChild(file)
  persistLibrary()
  return file
}

export function createFolder(name = '', parent = library) {
  const folder = new Folder(name)
  parent.appendChild(folder)
  persistLibrary()
  return folder
}

export function saveEssay() {
  const file = editorSession.file
  if (!file) return null
  file.saveContent(editorSession.getContent())
  persistLibrary()
  return file
}

export function saveEssayAs() {
  const file = saveEssay()
  if (!file) return
  const content = file.content
  const name = essayFilename(file, content)
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = name
  a.click()
  URL.revokeObjectURL(url)
}

function essayFilename(file, content) {
  const raw =
    file?.title?.trim() ||
    content.split(/\r?\n/).find((line) => line.trim())?.trim() ||
    'untitled'
  const safe = raw.replace(/[\\/:*?"<>|]/g, '_').slice(0, 80) || 'untitled'
  return safe.endsWith('.md') ? safe : `${safe}.md`
}

export function openLibrary() {
  router.push({ name: 'Library' })
}

export const appwindow = {
  toggleFullscreen() { },
  minimize() { },
  toggleMaximize() { },
  close() { },
}
