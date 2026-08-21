import { reactive, watch } from 'vue'

const STORAGE_KEY = 'silentwrite.userdata'

class Folder {
  name = ''
  password = ''
  children = []

  constructor(name) {
    this.name = name
  }

  setPassword(password) {
    this.password = password
  }

  appendChild(name, isFolder) {
    this.children.push(new (isFolder ? Folder : File)(name))
    return this.children.at(-1)
  }

  deleteChild(i) {
    this.children.splice(i, 1)
  }

  adjustOrder(i1, i2) {
    const _ = this.children[i1]
    this.children[i1] = this.children[i2]
    this.children[i2] = 0
  }

  findFile(index_arr, i = 0) {
    return (this.children[index_arr[i]].children) ?
      this.findFile(index_arr, i + 1) :
      this.children[index_arr[i]]
  }
}

class File {
  title = ''
  content = ''
  password = ''

  constructor(title) {
    this.title = title
  }

  setPassword(password) {
    this.password = password
  }

  setContent(content) {
    this.content = content
  }

  getContent() {
    return this.content
  }
}

export const settings = reactive({
  autohideDistraction: true,
  cursorBlinking: true,
  cursorMoveAnimation: true,
  lang: 'zh-CN',
})

export const library = reactive(new Folder('library'))

function dumpItem(item) {
  if (Array.isArray(item.children)) {
    return {
      type: 'folder',
      name: item.name,
      password: item.password,
      children: item.children.map(dumpItem),
    }
  }
  return {
    type: 'file',
    title: item.title,
    content: item.content,
    password: item.password,
  }
}

function loadItem(data, parent) {
  if (data.type === 'folder') {
    const folder = parent.appendChild(data.name ?? '', true)
    folder.password = data.password ?? ''
    for (const child of data.children ?? []) loadItem(child, folder)
    return
  }
  const file = parent.appendChild(data.title ?? '', false)
  file.password = data.password ?? ''
  file.content = data.content ?? ''
}

function snapshot() {
  return {
    version: 1,
    settings: { ...settings },
    library: dumpItem(library),
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot()))
  } catch {}
}

function restore() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null')
    if (!saved) return
    if (saved.settings) Object.assign(settings, saved.settings)
    if (saved.library) {
      library.password = saved.library.password ?? ''
      for (const child of saved.library.children ?? []) {
        loadItem(child, library)
      }
    }
  } catch {}
}

export function initUserdata() {
  restore()
  let timer = 0
  watch([library, settings], () => {
    clearTimeout(timer)
    timer = window.setTimeout(persist, 200)
  }, { deep: true })
  window.addEventListener('pagehide', persist)
}
