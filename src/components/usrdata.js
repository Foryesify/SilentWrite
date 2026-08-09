export class Folder {
  children = []
  password = ''

  appendChild(item) {
    this.children.push(item)
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

  saveContent() {}
  analyzeFrontMatter() {}
  setDate() {}
  setUpdated() {}
  setLang() {}
  setPassword() {}
}

export const library = new Folder()
