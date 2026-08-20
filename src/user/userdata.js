import { reactive } from 'vue'
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
export const settings = reactive({
  autohideDistraction: true,
  cursorBlinking: true,
  cursorMoveAnimation: true,
  lang: 'zh-CN',
})

export const library = {}
