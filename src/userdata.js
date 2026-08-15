import { reactive } from 'vue'

const STORAGE_KEY = 'silentwrite.library'

export class Folder {
  id = crypto.randomUUID()
  name = ''
  children = []
  password = ''

  constructor(name = '') {
    this.name = name
  }

  appendChild(item) {
    this.children.push(item)
  }

  findFile(id) {
    for (const child of this.children) {
      if (child instanceof File && child.id === id) return child
      if (child instanceof Folder) {
        const found = child.findFile(id)
        if (found) return found
      }
    }
    return null
  }

  deleteChild() {}
  adjustOrder() {}
  setPassword() {}
}

export class File {
  id = crypto.randomUUID()
  title = ''
  content = ''
  password = ''
  date = ''
  updated = ''
  lang = ''

  constructor(title = '') {
    this.title = title
    const now = new Date().toISOString()
    this.date = now
    this.updated = now
  }

  saveContent(content = '') {
    this.content = content
    this.updated = new Date().toISOString()
  }

  analyzeFrontMatter() {}
  setDate() {}
  setUpdated() {}
  setLang() {}
  setPassword() {}
}

export const library = reactive(new Folder())

export const editorSession = {
  file: null,
  getContent: () => '',
}

function serializeItem(item) {
  if (item instanceof Folder) {
    return {
      type: 'folder',
      id: item.id,
      name: item.name,
      password: item.password,
      children: item.children.map(serializeItem),
    }
  }
  return {
    type: 'file',
    id: item.id,
    title: item.title,
    content: item.content,
    password: item.password,
    date: item.date,
    updated: item.updated,
    lang: item.lang,
  }
}

function hydrateItem(data) {
  if (data?.type === 'folder') {
    const folder = new Folder(data.name || '')
    if (typeof data.id === 'string' && data.id) folder.id = data.id
    folder.password = data.password || ''
    folder.children = (data.children || []).map(hydrateItem).filter(Boolean)
    return folder
  }
  if (!data || typeof data.id !== 'string') return null
  const file = new File(data.title || '')
  file.id = data.id
  file.content = data.content || ''
  file.password = data.password || ''
  file.date = data.date || file.date
  file.updated = data.updated || file.updated
  file.lang = data.lang || ''
  return file
}

export function persistLibrary() {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(serializeItem(library)),
  )
}

export function loadLibrary() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    const data = JSON.parse(raw)
    const restored = hydrateItem({ type: 'folder', ...data })
    if (!(restored instanceof Folder)) return
    library.password = restored.password
    library.children = restored.children
  } catch {
    /* keep empty library */
  }
}

loadLibrary()

export const settings = reactive({
  autohideDistraction: true,
  cursorBlinking: true,
  cursorMoveAnimation: true,
  lang: 'zh-CN',
})
